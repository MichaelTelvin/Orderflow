
export type Order = {
    id: string;
    customerId: string;
    status: string;
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
    items: [];
};

export type OrderEvent = {
    id: string;
    orderId: string;
    type: string;
    message: string;
    createdAt: string;
};