import Fastify from 'fastify'
import { orderRoutes } from './modules/orders/order.routes.js';


const fastify = Fastify({
    logger: true
});

fastify.get('/health', async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
});

fastify.register(orderRoutes, {
    prefix: '/api/orders'
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