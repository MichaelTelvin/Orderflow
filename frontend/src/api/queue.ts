

const API_BASE_URL = 'http://localhost:3000';
const QUEUE_STATS_URL = `${API_BASE_URL}/api/queue/stats`;

const getQueueStats = async () => {
    try {
        const response = await fetch(QUEUE_STATS_URL);
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

export { getQueueStats };