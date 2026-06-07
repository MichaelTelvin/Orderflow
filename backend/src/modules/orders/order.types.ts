import * as z from 'zod';
import type {
    createOrderSchema,
    createOrderItemSchema,
    updateOrderStatusSchema
} from './order.schemas.js';


export type CreateOrderRequest = z.infer<typeof createOrderSchema>;

export type CreateOrderItemRequest = z.infer<typeof createOrderItemSchema>;

export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;