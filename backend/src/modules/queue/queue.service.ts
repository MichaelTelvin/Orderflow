import { orderProcessingQueue } from '../../queues/order-processing.queue.js';
import { orderDlqQueue } from '../../queues/order-dlq.queue.js';
import { orderService } from '../orders/order.service.js';
import { NotFoundError } from '../../errors/NotFoundError.js';


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

    async requeueDlqJob(orderId: string) {

        const jobs = await orderDlqQueue.getJobs(['waiting']);
        const orderJob = jobs.find(job => job.data.orderId === orderId);

        if (!orderJob) {
            throw new NotFoundError(`Job for order ${orderId} not found`);
        }

        await orderProcessingQueue.add('process-order', { orderId },
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
            }
        );

        await orderJob.remove();

        await orderService.emitOrderEvent(
            orderId,
            'DLQ_REQUEUED',
            'Order manually requeued from DLQ.'
        );
    }
}

export const queueService = new QueueService();