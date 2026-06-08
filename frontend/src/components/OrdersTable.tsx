import styles from '../assets/css/OrdersTable.module.css';
import { listOrders } from '../api/orders.js';
import { useState, useEffect } from 'react';

export const OrdersTable = () => {

    type Order = {
        id: string;
        customerId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        items: [];
    };

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const orders = await listOrders();

                if (!orders) {
                    throw new Error('Failed to fetch orders');
                }

                setOrders(orders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                            <td>{order.status}</td>
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

