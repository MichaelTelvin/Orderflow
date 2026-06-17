import { Queue } from 'bullmq';

export const orderDlqQueue = new Queue(
    'order-dlq', {
    connection: {
        host: process.env.REDIS_HOST || 'redis',
        port: 6379,
    },
});