import type { CreateOrderRequest } from './order.types.js';
import type { OrderStatus } from '../../../generated/prisma/enums.js';
import { prisma } from '../../lib/prisma.js';
import { InvalidStatusTransitionError } from '../../errors/InvalidStatusTransitionError.js';
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
        const order = await prisma.order.create({
            data: {
                customerId: request.customerId,
                items: {
                    create: request.items,
                },
                orderEvents: {
                    create: {
                        type: 'ORDER_CREATED',
                        message: `Order created with ${request.items.length} items.`,
                    },
                },
            },
        });

        await orderProcessingQueue.add('process-order', { orderId: order.id });
        return order;
    }

    async updateStatus(id: string, newStatus: OrderStatus) {

        const order = await this.getOrder(id);
        if (!order) {
            throw new NotFoundError(`Order ${id} not found`);
        }

        validateStatusTransition(order.status, newStatus);

        return prisma.order.update({
            where: { id },
            data: {
                status: newStatus,
                orderEvents: {
                    create: {
                        type: 'STATUS_CHANGED',
                        message: `Order status changed to ${newStatus}.`
                    },
                },
            },
        });
    }

    async getOrderEvents(orderId: string) {
        return prisma.orderEvent.findMany({
            where: { orderId },
        });
    }

    async processOrder(id: string) {
        try {
            await this.updateStatus(id, 'PROCESSING');

            await inventoryAdapter.reserveInventory();
            await legalAdapter.validateLegal();
            await shippingAdapter.calculateShipping();

            await this.updateStatus(id, 'COMPLETED');
        } catch (error) {
            await this.updateStatus(id, 'FAILED');
            throw error;
        }
    }
}

export const orderService = new OrderService();