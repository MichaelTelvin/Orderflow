import styles from '../assets/css/OrderDetails.module.css';
import type { Order, OrderEvent } from '../types/orders';

type OrderEventsTableProps = {
    order: Order | null;
    orderEvents: OrderEvent[];
    loading: boolean;
    loadError: string | null;
};

export const OrderDetails = ({ order, orderEvents, loading, loadError }: OrderEventsTableProps) => {

    if (!order) {
        return <div className={styles.messagePlaceholder}>Select an order</div>;
    }

    if (loading) {
        return <div className={styles.messagePlaceholder}>Loading order details...</div>;
    }

    if (loadError) {
        return <div className={`${styles.error} ${styles.messagePlaceholder}`}>{loadError}</div>;
    }

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(date));


    const { customerId, items, createdAt } = order;
    const formattedDate = formatDate(createdAt);


    return (
        <div className={styles.orderDetailsList}>
            <section className={styles.orderDetailsCard}>
                <h2>Order Details</h2>
                <div>Customer ID: {customerId}</div>
                <div>Items: {items.length}</div>
                <div>Created: {formattedDate}</div>
            </section>
            <section className={styles.orderDetailsCard}>
                <h2>Timeline</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Message</th>
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
                                <td>
                                    {event.type}
                                </td>
                                <td>{event.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className={styles.orderDetailsCard}>
                <h2>Actions</h2>
            </section>
        </div>
    );
};

