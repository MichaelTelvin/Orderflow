import type { CreateOrderRequest } from '../../src/modules/orders/order.types.js';
import { describe, it, expect, vi, afterAll } from 'vitest';
import { prisma } from '../../src/lib/prisma.js';
import { orderService } from '../../src/modules/orders/order.service.js';
import { orderDlqQueue } from '../../src/queues/order-dlq.queue.js';
import { queueService } from '../../src/modules/queue/queue.service.js';
import { orderProcessingQueue } from '../../src/queues/order-processing.queue.js';
import { InvalidStatusTransitionError } from '../../src/errors/InvalidStatusTransitionError.js';
import { beforeEach } from 'node:test';


describe('Order Lifecycle', () => {

    const orderRequest: CreateOrderRequest = {
        customerId: '12345',
        idempotencyKey: crypto.randomUUID(),
        items: [{ sku: 'test', quantity: 2 }]
    };

    beforeEach(async () => {
        await orderProcessingQueue.obliterate({
            force: true,
        });

        await orderDlqQueue.obliterate({
            force: true,
        });
    });

    afterAll(async () => {
        await prisma.orderEvent.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
    });

    it('creates an order', async () => {

        const order = await orderService.createOrder(orderRequest);
        const dbOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: {
                items: true,
            },
        });

        expect(dbOrder).not.toBeNull();
        expect(dbOrder?.customerId).toBe(orderRequest.customerId);
        expect(dbOrder?.items).toHaveLength(1);
        expect(dbOrder?.items[0]?.sku).toBe('test');
    });

    it('returns existing order for duplicate idempotency key', async () => {

        const first = await orderService.createOrder(orderRequest);
        const second = await orderService.createOrder(orderRequest);

        expect(second.id).toBe(first.id);
    });

    it('valid status transition succeeds', async () => {

        const newStatus = 'PROCESSING';
        const order = await prisma.order.create({
            data: {
                customerId: 'test',
                idempotencyKey: crypto.randomUUID(),
            }
        });

        const updatedOrder = await orderService.updateStatus(order.id, newStatus);
        expect(updatedOrder.status).toBe(newStatus);
    });

    it('invalid status transition throws', async () => {

        const newStatus = 'COMPLETED';
        const order = await prisma.order.create({
            data: {
                customerId: 'test',
                idempotencyKey: crypto.randomUUID(),
            }
        });

        await expect(
            orderService.updateStatus(order.id, newStatus)
        ).rejects.toThrow(InvalidStatusTransitionError);
    });

    it('DLQ requeue moves job back to processing queue', async () => {

        const order = await prisma.order.create({
            data: {
                customerId: 'test',
                idempotencyKey: crypto.randomUUID(),
            }
        });

        await orderDlqQueue.add('failed-order', { orderId: order.id });
        await queueService.requeueDlqJob(order.id);
        const processingJobs = await orderProcessingQueue.getJobs(['waiting']);

        expect(
            processingJobs.some(
                job => job.data.orderId === order.id
            )
        ).toBe(true);

        const remainingDlqJobs = await orderDlqQueue.getJobs(['waiting']);

        expect(
            remainingDlqJobs.some(
                job => job.data.orderId === order.id
            )
        ).toBe(false);

    });
});

