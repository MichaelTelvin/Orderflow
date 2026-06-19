import styles from '../assets/css/OrdersList.module.css';
import type { Order } from '../types/orders';

type OrdersListProps = {
    orders: Order[];
    loading: boolean;
    loadError: string | null;
    onOrderClicked: (orderId: string) => void;
};

export const OrdersList = (
    { orders, loading, loadError, onOrderClicked }: OrdersListProps
) => {

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
        <div className={styles.ordersList}>
            {orders.length === 0 ? (
                <div>No orders found</div>
            ) : (
                orders.map(order => (
                    <div
                        key={order.id}
                        className={styles.orderCard}
                        onClick={() => onOrderClicked(order.id)}>
                        <div className={styles.orderHeader}>
                            <span>{order.id.slice(0, 6)}...</span>
                            <span className={styles.statusBadge}>
                                {order.status}
                            </span>
                        </div>
                        <div className={styles.orderMeta}>
                            Retries: {order.retryCount}
                        </div>
                        <div className={styles.orderMeta}>
                            {formatDate(order.updatedAt)}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

