import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import { listOrders } from './api/orders.js';
import { useState, useEffect } from 'react';
import type { Order } from './types/orders';
import './assets/css/App.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    loadOrders()
  }, []);

  return (
    <>
      <section id="center">
        <div>
          <CreateOrderForm
            onOrderCreated={loadOrders} />
        </div>
      </section>
      <section id="spacer"></section>
      <section>
        <div>
          <OrdersTable
            orders={orders}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    </>
  )
}

export default App
