
export type QueueStats = {
    process: {
        waiting: number,
        active: number,
        completed: number,
        failed: number
    },
    dlq: {
        size: number
    }
};