import { FastifyInstance } from 'fastify';
import { orderProcessingQueue } from '../../queues/order-processing.queue.js';


export async function queueRoutes(fastify: FastifyInstance) {

    fastify.get('/stats', async () => {
        return orderProcessingQueue.getJobCounts();
    });

}