import { Worker } from 'bullmq';
import { orderService } from '../modules/orders/order.service.js';


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