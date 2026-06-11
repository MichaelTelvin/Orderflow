import { Worker } from 'bullmq';
import { orderService } from '../modules/orders/order.service.js';

const worker = new Worker(
    'order-processing',
    async (job) => {
        console.log('Processing order:', job.data.orderId);
        await orderService.processOrder(job.data.orderId);
    },
    {
        connection: {
            host: process.env.REDIS_HOST || 'redis',
            port: 6379,
        },
    }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed`, err);
});