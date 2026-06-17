import { FastifyInstance } from 'fastify';
import { queueService } from './queue.service.js';


export async function queueRoutes(fastify: FastifyInstance) {

    fastify.get('/stats', async () => {
        return queueService.getStats();
    });

}