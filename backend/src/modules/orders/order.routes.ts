import type { CreateOrderRequest } from './order.types.js';
import { orderService } from './order.service.js';
import { FastifyInstance } from 'fastify';

export async function orderRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return orderService.listOrders();
    });

    fastify.get('/:id', async (request) => {
        const { id } = request.params as { id: string };
        return orderService.getOrder(id);
    });

    fastify.get('/:id/events', async (request) => {
        const { id } = request.params as { id: string };
        return orderService.getOrderEvents(id);
    });

    fastify.post('/', async (request, reply) => {
        const { customerId, items } = request.body as CreateOrderRequest;
        const order = await orderService.createOrder({
            customerId,
            items
        });

        return reply.code(201).send(order);
    });

    fastify.post('/:id/retry', async (request) => {
        const { id } = request.params as { id: string };
        return await orderService.retryOrder(id);
    });
} 