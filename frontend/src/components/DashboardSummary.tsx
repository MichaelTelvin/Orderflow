import type { QueueStats } from '../types/queue';
import type { OrderSummary } from '../types/orders';
import styles from '../assets/css/DashboardSummary.module.css';


type dashboardSummaryProps = {
    orderSummary: OrderSummary;
    queueStats: QueueStats | null;
    loadError: string | null;
};

export const DashboardSummary = (
    { orderSummary, queueStats, loadError }: dashboardSummaryProps
) => {

    if (!queueStats || !orderSummary) {
        return <div>Loading summary...</div>;
    }

    if (loadError) {
        return <div className={styles.error}>{loadError}</div>;
    }

    const { completed, failed, processing } = orderSummary;
    const { size: dlqSize } = queueStats.dlq;

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.summaryItem}>Completed: {completed}</div> |
            <div className={styles.summaryItem}>Processing: {processing}</div> |
            <div className={styles.summaryItem}>Failed: {failed}</div> |
            <div className={styles.summaryItem}>DLQ: {dlqSize}</div>
        </div>
    );
};
