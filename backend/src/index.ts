import Fastify from 'fastify'
const fastify = Fastify({
    logger: true
});

fastify.get("/health", async () => {
    return {
        status: "ok",
        timestamp: new Date().toISOString(),
    };
});

