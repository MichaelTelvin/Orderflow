

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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Fetch failed:', error);
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;

    } catch (error) {
        console.error('Order creation failed:', error);
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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;

    } catch (error) {
        console.error('Order status update failed:', error);
    }
};

export { listOrders, createOrder, updateOrderStatus };