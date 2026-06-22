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
        return <div className={styles.messagePlaceholder}>Select an order to view details</div>;
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


    const { customerId, items, retryCount, createdAt, updatedAt } = order;
    const createdDate = formatDate(createdAt);
    const updatedDate = formatDate(updatedAt);


    return (
        <div className={styles.orderDetailsList}>
            <section className={styles.orderDetailsSection}>
                <h2>Order Details</h2>
                <div className={styles.orderDetailsCard}>
                    <div className={styles.orderDetailsContainer}>
                        <div>Customer ID: </div>
                        <div>Items: </div>
                        <div>Retries: </div>
                        <div>Created: </div>
                        <div>Updated: </div>
                    </div>
                    <div className={styles.orderDetailsContainer}>
                        <div>{customerId}</div>
                        <div>{items.length}</div>
                        <div>{retryCount}</div>
                        <div className={styles.orderDate}>{createdDate}</div>
                        <div className={styles.orderDate}>{updatedDate}</div>
                    </div>
                </div>
            </section>
            <section className={styles.orderDetailsSection}>
                <h2>Timeline</h2>
                {orderEvents.length === 0 ? (
                    <div>No order events found</div>
                ) : (
                    <ul>
                        {orderEvents.map((event: OrderEvent) => (
                            <li key={event.id}>
                                <div>{event.type}</div>
                                <div>{event.message}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            <section className={styles.orderDetailsSection}>
                <h2>Actions</h2>
            </section>
        </div>
    );
};

