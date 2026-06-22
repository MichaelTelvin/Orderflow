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

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (loadError) {
        return <div className={styles.error}>{loadError}</div>;
    }

    return (
        <div className={styles.ordersList}>
            {orders.length === 0 ? (
                <div className={styles.messagePlaceholder}>No orders found</div>
            ) : (
                orders.map(order => (
                    <div
                        key={order.id}
                        className={styles.orderCard}
                        onClick={() => onOrderClicked(order.id)}>
                        <div className={styles.orderHeader}>
                            <span className={styles.orderLabel}>Order:</span> &nbsp;{order.id.slice(0, 8)}...
                        </div>
                        <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                            {order.status}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

