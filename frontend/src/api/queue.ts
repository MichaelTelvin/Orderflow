

const API_BASE_URL = 'http://localhost:3000';
const QUEUE_API_URL = `${API_BASE_URL}/api/queue`;

const getQueueStats = async () => {
    try {
        const response = await fetch(`${QUEUE_API_URL}/stats`);
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

const requeueOrderFromDlq = async (orderId: string) => {
    try {
        const response = await fetch(`${QUEUE_API_URL}/requeue`, {
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

export { getQueueStats, requeueOrderFromDlq };