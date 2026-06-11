import styles from '../assets/css/OrdersTable.module.css';
import type { Order } from '../types/orders';

type OrdersTableProps = {
    orders: Order[];
    loading: boolean;
    loadError: string | null;
    orderRetryError: string | null;
    onOrderClicked: (orderId: string) => void;
    onOrderRetryClicked: (orderId: string) => void;
};

export const OrdersTable = ({ orders, loading, loadError, orderRetryError, onOrderClicked, onOrderRetryClicked }: OrdersTableProps) => {

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
        <>
            {orderRetryError && (<div className={styles.error} > {orderRetryError}</div>)}
            <div className={styles.tableWrapper}>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer ID</th>
                            <th>Status</th>
                            <th>CreatedAt</th>
                            <th>UpatedAt</th>
                            <th>Items</th>
                            <th>Retry Count</th>
                            <th>Retry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={6}>
                                    No orders found
                                </td>
                            </tr>
                        ) : orders.map((order: Order) => (
                            <tr key={order.id}>
                                <td
                                    title={order.id}
                                    onClick={() => onOrderClicked(order.id)}>
                                    {order.id.slice(0, 8)}...
                                </td>
                                <td>{order.customerId}</td>
                                <td>{order.status}</td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>{formatDate(order.updatedAt)}</td>
                                <td>{order.items.length}</td>
                                <td>{order.retryCount}</td>
                                {order.status === 'FAILED' && (
                                    <td>
                                        <button
                                            className={styles.retryButton}
                                            onClick={() => onOrderRetryClicked(order.id)}>
                                            <span className={styles.retryIcon}>↻</span>
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </>
    );
};

