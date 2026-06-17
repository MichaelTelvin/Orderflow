import styles from '../assets/css/QueueStatsList.module.css';
import type { QueueStats } from '../types/queue';


type queueStatsListProps = {
    queueStats: QueueStats | null;
    loadError: string | null;
};

export const QueueStatsList = ({ queueStats, loadError }: queueStatsListProps) => {

    if (!queueStats) {
        return <div>Loading queue stats...</div>;
    }

    if (loadError) {
        return <div className={styles.error}>{loadError}</div>;
    }

    return (
        <div className={styles.queueStatsContainer}>
            <h2>Queue Stats</h2>
            <h3>Order Processing</h3>
            <ul className={styles.queueStatsList}>
                <li>Waiting: {queueStats.process.waiting}</li>
                <li>Active: {queueStats.process.active}</li>
                <li>Completed: {queueStats.process.completed}</li>
                <li>Failed: {queueStats.process.failed}</li>
            </ul>
            <h3>Dead Letter Queue</h3>
            <ul className={styles.queueStatsList}>
                <li>Size: {queueStats.dlq.size}</li>
            </ul>
        </div>
    );
};
