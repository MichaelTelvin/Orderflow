import Fastify from 'fastify'
import cors from '@fastify/cors';
import { orderRoutes } from './modules/orders/order.routes.js';
import { queueRoutes } from './modules/queue/queue.routes.js';


const fastify = Fastify({
    logger: true
});

fastify.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
});

fastify.register(orderRoutes, {
    prefix: '/api/orders'
});

fastify.register(queueRoutes, {
    prefix: '/api/queue'
});

fastify.get('/health', async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
});

const start = async () => {
    try {
        await fastify.listen({
            port: 3000,
            host: '0.0.0.0',
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();