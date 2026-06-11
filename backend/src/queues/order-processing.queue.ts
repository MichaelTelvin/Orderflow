import { Queue } from 'bullmq';

export const orderProcessingQueue = new Queue(
    'order-processing',
    {
        connection: {
            host: process.env.REDIS_HOST || 'redis',
            port: 6379,
        },
    }
);