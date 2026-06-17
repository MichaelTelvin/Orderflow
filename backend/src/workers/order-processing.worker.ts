import { Worker } from 'bullmq';
import { orderService } from '../modules/orders/order.service.js';
import { orderDlqQueue } from '../queues/order-dlq.queue.js';


const worker = new Worker(
    'order-processing',
    async (job) => {
        await orderService.processOrder(job.data.orderId);
    }, {
    connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: 6379,
    }
});

worker.on('failed', async (job, error) => {
    if (!job) {
        return;
    }

    if (job.attemptsMade > 0) {
        await orderService.setRetryCount(
            job.data.orderId,
            job.attemptsMade
        );
    }

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {

        await orderDlqQueue.add('dead-order', {
            orderId: job.data.orderId,
            reason: error.message,
            failedAt: new Date().toISOString(),
        });

        await orderService.emitOrderEvent(
            job.data.orderId,
            'RETRY_LIMIT_EXCEEDED',
            error.message
        );
    }
});