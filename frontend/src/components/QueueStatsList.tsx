import styles from '../assets/css/QueueStatsList.module.css';

type QueueStats = {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
    prioritized: number;
};

type queueStatsListProps = {
    queueStats: QueueStats[];
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
            <div>
                <h2>Queue Stats</h2>
            </div>
            <ul className={styles.queueStatsList}>
                {Object.entries(queueStats).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value.toString()}
                    </li>
                ))}
            </ul>
        </div>
    );
};
