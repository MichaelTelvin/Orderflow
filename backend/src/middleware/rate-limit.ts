import type {
    FastifyRequest,
    FastifyReply
} from 'fastify';
import { redis } from '../lib/redis.js';


export async function rateLimit(
    request: FastifyRequest,
    reply: FastifyReply
) {

    const limit = 5;
    const now = Date.now();
    const windowMs = 60_000;
    const key = `rate_limit:${request.ip}`;

    await redis.zremrangebyscore(key, 0, now - windowMs);
    const count = await redis.zcard(key);

    if (count >= limit) {
        return reply.code(429).send({
            message: 'Rate limit exceeded'
        });
    }

    await redis.zadd(key, now, `${now}`);
    await redis.expire(key, 60);

    return;
}