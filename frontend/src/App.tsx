import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import { listOrders, updateOrderStatus } from './api/orders.js';
import { useState, useEffect } from 'react';
import type { Order } from './types/orders';
import './assets/css/App.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders()
  }, []);

  const loadOrders = async () => {
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

  const changeOrderStatus = async (orderId: string, status: string) => {

    try {

      const response = await updateOrderStatus(orderId, status);
      if (!response || !response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      ));

      loadOrders();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <>
      <section id="center">
        <div id="form-container">
          <CreateOrderForm
            onOrderCreated={loadOrders} />
        </div>
      </section>
      <section>
        <div id="orders-container">
          <OrdersTable
            orders={orders}
            loading={loading}
            error={error}
            onOrderStatusChanged={changeOrderStatus}
          />
        </div>
      </section>
    </>
  )
}

export default App
