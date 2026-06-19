
export type Order = {
    id: string;
    customerId: string;
    status: OrderStatus;
    retryCount: number;
    createdAt: string;
    updatedAt: string;
    items: [];
};

export type OrderItem = {
    id: string;
    customerId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type OrderEvent = {
    id: string;
    orderId: string;
    type: string;
    message: string;
    createdAt: string;
};

export type OrderStatus =
    | 'CREATED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED';

export type OrderSummary = {
    completed: number;
    failed: number;
    processing: number;
};