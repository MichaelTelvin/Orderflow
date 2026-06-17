import type { CreateOrderRequest } from './order.types.js';
import type { OrderEventType, OrderStatus } from '../../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import { InvalidStatusTransitionError } from '../../errors/InvalidStatusTransitionError.js';
import { AdapterError } from '../../errors/AdapterError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { inventoryAdapter } from '../../adapters/inventory.adapter.js';
import { legalAdapter } from '../../adapters/legal.adapter.js';
import { shippingAdapter } from '../../adapters/shipping.adapter.js';
import { orderProcessingQueue } from '../../queues/order-processing.queue.js';


const validateStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus) => {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        CREATED: ['PROCESSING'],
        PROCESSING: ['COMPLETED', 'FAILED'],
        COMPLETED: [],
        FAILED: ['PROCESSING']
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
        throw new InvalidStatusTransitionError(
            `Invalid status transition from ${currentStatus} to ${newStatus}`
        );
    }
};


export class OrderService {

    async listOrders() {

        return prisma.order.findMany({
            include: {
                items: true,
            },
        });
    }

    async getOrder(id: string) {

        return prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
    }

    async createOrder(request: CreateOrderRequest) {

        const existing = await prisma.order.findUnique({
            where: {
                idempotencyKey: request.idempotencyKey
            }
        });

        if (existing) {
            return existing;
        }

        const order = await prisma.order.create({
            data: {
                idempotencyKey: request.idempotencyKey,
                customerId: request.customerId,
                items: {
                    create: request.items,
                },
            },
        });

        await this.emitOrderEvent(order.id, 'ORDER_CREATED', `Order created.`);
        await orderProcessingQueue.add('process-order', { orderId: order.id },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            }
        );

        return order;
    }

    async updateStatus(id: string, newStatus: OrderStatus) {

        const order = await this.getOrder(id);
        if (!order) {
            throw new NotFoundError(`Order ${id} not found`);
        }

        validateStatusTransition(order.status, newStatus);

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: newStatus,
            },
        });

        return updatedOrder;
    }

    async getOrderEvents(orderId: string) {
        return prisma.orderEvent.findMany({
            where: { orderId },
        });
    }

    async processOrder(id: string) {
        try {
            await this.updateStatus(id, 'PROCESSING');
            await this.emitOrderEvent(id, 'PROCESSING_STARTED', `Order status changed to 'PROCESSING'.`);

            await inventoryAdapter.reserveInventory();
            await legalAdapter.validateLegal();
            await shippingAdapter.calculateShipping();

            await this.updateStatus(id, 'COMPLETED');
            await this.emitOrderEvent(id, 'ORDER_COMPLETED', `Order processing completed successfully.`);
        } catch (error) {
            if (error instanceof AdapterError) {
                await this.updateStatus(id, 'FAILED');
                await this.emitOrderEvent(id, 'PROCESSING_FAILED', error.message);
            }

            throw error;
        }
    }

    async emitOrderEvent(orderId: string, type: OrderEventType, message: string) {
        await prisma.orderEvent.create({
            data: {
                orderId,
                type,
                message,
            },
        });
    }
}

export const orderService = new OrderService();