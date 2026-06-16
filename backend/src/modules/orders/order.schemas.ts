import * as z from 'zod';


export const createOrderItemSchema = z.object({
    sku: z.string().min(1),
    quantity: z.number().int().positive().gte(1)
});

export const createOrderSchema = z.object({
    customerId: z.string().min(3),
    items: z.array(createOrderItemSchema).min(1)
});

