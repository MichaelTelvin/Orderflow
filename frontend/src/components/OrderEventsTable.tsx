import styles from '../assets/css/OrderEventsTable.module.css';
import type { OrderEvent } from '../types/orders';

type OrderEventsTableProps = {
    orderEvents: OrderEvent[];
    loading: boolean;
    loadError: string | null;
};

export const OrderEventsTable = ({ orderEvents, loading, loadError }: OrderEventsTableProps) => {

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(date));

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (loadError) {
        return <div className={styles.error}>{loadError}</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.orderEventsTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>CreatedAt</th>
                    </tr>
                </thead>
                <tbody>
                    {orderEvents.length === 0 ? (
                        <tr>
                            <td colSpan={6}>
                                No order events found
                            </td>
                        </tr>
                    ) : orderEvents.map((event: OrderEvent) => (
                        <tr key={event.id}>
                            <td title={event.id}>
                                {event.id.slice(0, 8)}...
                            </td>
                            <td title={event.orderId}>
                                {event.orderId.slice(0, 8)}...
                            </td>
                            <td>
                                {event.type}
                            </td>
                            <td>{event.message}</td>
                            <td>{formatDate(event.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

