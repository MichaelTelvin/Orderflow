import type { RequeueDlqRequest } from './queue.types.js';
import { FastifyInstance } from 'fastify';
import { queueService } from './queue.service.js';


export async function queueRoutes(fastify: FastifyInstance) {

    fastify.get('/stats', async () => {
        return queueService.getStats();
    });

    fastify.post('/requeue', async (request, reply) => {

        const { orderId } = request.body as RequeueDlqRequest;
        await queueService.requeueDlqJob(orderId);

        return reply.code(200).send({ message: `Order ${orderId} requeued` });
    });

}