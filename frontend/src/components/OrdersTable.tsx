import styles from '../assets/css/OrdersTable.module.css';
import type { Order } from '../types/orders';

type OrdersTableProps = {
    orders: Order[];
    loading: boolean;
    error: string | null;
    onOrderStatusChanged: (orderId: string, status: string) => void;
};

export const OrdersTable = ({ orders, loading, error, onOrderStatusChanged }: OrdersTableProps) => {

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(date));

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
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
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order: Order) => (
                        <tr key={order.id}>
                            <td title={order.id}>
                                {order.id.slice(0, 8)}...
                            </td>
                            <td>{order.customerId}</td>
                            <td>
                                <select value={order.status} onChange={(e) => onOrderStatusChanged(order.id, e.target.value)}>
                                    <option value="CREATED">CREATED</option>
                                    <option value="PROCESSING">PROCESSING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="FAILED">FAILED</option>
                                </select>
                            </td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{formatDate(order.updatedAt)}</td>
                            <td>{order.items.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

