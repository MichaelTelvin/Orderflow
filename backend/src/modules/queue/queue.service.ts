import { orderProcessingQueue } from '../../queues/order-processing.queue.js';


export class QueueService {

    async getStats() {
        return await orderProcessingQueue.getJobCounts();
    }

    async pause() {

    }

    async resume() {

    }
}

export const queueService = new QueueService();