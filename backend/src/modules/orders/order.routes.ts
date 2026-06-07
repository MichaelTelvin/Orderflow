import { FastifyInstance } from 'fastify';
import type { OrderStatus } from '../../../generated/prisma/client.js';
import { orderService } from './order.service.js';

export async function orderRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return orderService.listOrders();
    });

    fastify.get('/:id', async (request) => {
        const { id } = request.params as { id: string };

        return orderService.getOrder(id);
    });

    fastify.post('/', async (request, reply) => {
        const { customerId } = request.body as {
            customerId: string;
        };

        const order = await orderService.createOrder({
            customerId,
            items: []
        });

        return reply.code(201).send(order);
    });

    fastify.patch('/:id/status', async (request) => {
        const { id } = request.params as { id: string };

        const { status } = request.body as {
            status: OrderStatus;
        };

        return orderService.updateStatus(id, { status });
    });
}