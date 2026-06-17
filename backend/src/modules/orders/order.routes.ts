import type { CreateOrderRequest } from './order.types.js';
import { orderService } from './order.service.js';
import { rateLimit } from '../../middleware/rate-limit.js';
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

    fastify.post('/', { preHandler: [rateLimit] },
        async (request, reply) => {

            const { idempotencyKey, customerId, items } = request.body as CreateOrderRequest;
            const order = await orderService.createOrder({
                idempotencyKey,
                customerId,
                items
            });

            return reply.code(201).send(order);
        });
} 