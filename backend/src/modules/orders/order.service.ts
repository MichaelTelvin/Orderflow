import type { OrderStatus } from '../../../generated/prisma/enums.js';
import type {
    CreateOrderRequest,
    UpdateOrderStatusRequest
} from './order.types.js';
import { prisma } from '../../lib/prisma.js';
import { InvalidStatusTransitionError } from '../../errors/InvalidStatusTransitionError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';


const validateStatusTransition = (currentStatus: OrderStatus, newStatus: OrderStatus) => {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        CREATED: ['PROCESSING', 'FAILED'],
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
        return prisma.order.create({
            data: {
                customerId: request.customerId,
                items: {
                    create: request.items,
                },
                orderEvents: {
                    create: {
                        type: 'ORDER_CREATED',
                        message: `Order created with ${request.items.length} items.`
                    },
                },
            },
        });
    }

    async updateStatus(id: string, request: UpdateOrderStatusRequest) {

        const order = await this.getOrder(id);
        if (!order) {
            throw new NotFoundError(`Order ${id} not found`);
        }

        validateStatusTransition(order.status, request.status);

        return prisma.order.update({
            where: { id },
            data: {
                status: request.status,
                orderEvents: {
                    create: {
                        type: 'STATUS_CHANGED',
                        message: `Order status changed to ${request.status}.`
                    },
                },
            },
        });
    }
}

export const orderService = new OrderService();