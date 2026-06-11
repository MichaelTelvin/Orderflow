

type Item = {
    sku: string,
    quantity: number
};

type OrderRequest = {
    customerId: string,
    items: Item[]
};

const API_BASE_URL = 'http://localhost:3000';
const ORDERS_URL = `${API_BASE_URL}/api/orders`;

const listOrders = async () => {
    try {
        const response = await fetch(ORDERS_URL);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ?? `HTTP error! Status: ${response.status}`
            );
        }
        return data;

    } catch (error) {
        throw error;
    }
};

const createOrder = async (payload: OrderRequest) => {
    try {
        const response = await fetch(ORDERS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer AUTH_TOKEN'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(
                errorBody.message ?? `HTTP error! Status: ${response.status}`
            );
        }
        return response;

    } catch (error) {
        throw error;
    }
};

const updateOrderStatus = async (orderId: string, status: string) => {
    try {
        const response = await fetch(`${ORDERS_URL}/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer AUTH_TOKEN'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(
                errorBody.message ?? `HTTP error! Status: ${response.status}`
            );
        }
        return response;

    } catch (error) {
        throw error;
    }
};

const getOrderEvents = async (orderId: string) => {
    try {
        const response = await fetch(`${ORDERS_URL}/${orderId}/events`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ?? `HTTP error! Status: ${response.status}`
            );
        }
        return data;

    } catch (error) {
        throw error;
    }
};

const retryOrder = async (orderId: string) => {
    try {
        const response = await fetch(`${ORDERS_URL}/${orderId}/retry`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer AUTH_TOKEN'
            },
            body: JSON.stringify({ orderId })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(
                errorBody.message ?? `HTTP error! Status: ${response.status}`
            );
        }
        return response;

    } catch (error) {
        throw error;
    }
};

export { listOrders, createOrder, updateOrderStatus, getOrderEvents, retryOrder };