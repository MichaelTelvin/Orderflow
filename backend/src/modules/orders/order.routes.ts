import type {
    CreateOrderRequest,
    UpdateOrderStatusRequest
} from './order.types.js';
import { orderService } from './order.service.js';
import { FastifyInstance } from 'fastify';
import { AppError } from '../../errors/AppError.js';

export async function orderRoutes(fastify: FastifyInstance) {
    fastify.get('/', async () => {
        return orderService.listOrders();
    });

    fastify.get('/:id', async (request) => {
        const { id } = request.params as { id: string };
        return orderService.getOrder(id);
    });

    fastify.post('/', async (request, reply) => {
        const { customerId, items } = request.body as CreateOrderRequest;
        const order = await orderService.createOrder({
            customerId,
            items
        });

        return reply.code(201).send(order);
    });

    fastify.patch('/:id/status', async (request, reply) => {
        const { id } = request.params as { id: string };
        const { status } = request.body as UpdateOrderStatusRequest;

        try {
            const order = await orderService.updateStatus(id, { status });
            return reply.send(order);
        } catch (error) {
            if (error instanceof AppError) {
                return reply.code(error.statusCode).send({
                    message: error.message,
                });
            }
            throw error;
        }
    });
} 