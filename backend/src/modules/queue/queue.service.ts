import { orderProcessingQueue } from '../../queues/order-processing.queue.js';
import { orderDlqQueue } from '../../queues/order-dlq.queue.js';


export class QueueService {

    async getStats() {

        const orderProcStats = await orderProcessingQueue.getJobCounts();
        const dlqStats = await orderDlqQueue.getJobCounts();

        return {
            process: {
                active: orderProcStats.active,
                waiting: orderProcStats.waiting,
                completed: orderProcStats.completed,
                failed: orderProcStats.failed
            },
            dlq: {
                size: dlqStats.waiting
            }
        };
    }
}

export const queueService = new QueueService();