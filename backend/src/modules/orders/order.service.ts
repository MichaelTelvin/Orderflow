import { prisma } from '../../lib/prisma.js';
import type {
    CreateOrderRequest,
    UpdateOrderStatusRequest
} from './order.types.js';


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
            },
        });
    }

    async updateStatus(id: string, request: UpdateOrderStatusRequest) {
        return prisma.order.update({
            where: { id },
            data: { status: request.status },
        });
    }
}

export const orderService = new OrderService();