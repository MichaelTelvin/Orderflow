import { prisma } from '../../lib/prisma.js';
import type { OrderStatus } from '../../../generated/prisma/client.js';


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

    async createOrder(customerId: string) {
        return prisma.order.create({
            data: {
                customerId,
            },
        });
    }

    async updateStatus(id: string, status: OrderStatus) {
        return prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}

export const orderService = new OrderService();