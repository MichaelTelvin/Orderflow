import type { OrderStatus } from '../../../generated/prisma/client.js';

export interface CreateOrderRequest {
    customerId: string;
    items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
    sku: string;
    quantity: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}