import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import { OrderEventsTable } from './components/OrderEventsTable.js';
import { listOrders, getOrderEvents, retryOrder } from './api/orders.js';
import { useState, useEffect } from 'react';
import type { Order, OrderEvent } from './types/orders';
import './assets/css/App.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadOrderError, setOrderLoadError] = useState<string | null>(null);
  const [loadOrderEventsError, setOrderEventsLoadError] = useState<string | null>(null);
  const [orderRetryError, setOrderRetryError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setOrderLoadError(null);

      const dbOrders: Order[] = await listOrders();
      if (!dbOrders) {
        throw new Error('Failed to fetch orders');
      }

      setOrders(dbOrders);
    } catch (err) {
      setOrderLoadError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadOrderEvents = async (orderId: string) => {
    try {
      setLoading(true);
      setOrderEventsLoadError(null);

      const dbOrderEvents: OrderEvent[] = await getOrderEvents(orderId);

      if (!dbOrderEvents) {
        throw new Error('Failed to fetch order events');
      }

      setOrderEvents(dbOrderEvents);
    } catch (err) {
      setOrderEventsLoadError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };


  const retryOrderProcessing = async (orderId: string) => {
    try {
      const response = await retryOrder(orderId);

      if (!response.ok) {
        throw new Error('Failed to retry order');
      }

      setTimeout(loadOrders, 1000);
      setTimeout(() => loadOrderEvents(orderId), 1000);

    } catch (err) {
      setOrderRetryError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleOrderCreated = () => {
    setTimeout(() => {
      loadOrders();
    }, 1000);
  };

  return (
    <>
      <section id="center">
        <div id="form-container">
          <CreateOrderForm
            onOrderCreated={handleOrderCreated} />
        </div>
      </section>
      <section>
        <div>
          <OrdersTable
            orders={orders}
            loading={loading}
            loadError={loadOrderError}
            orderRetryError={orderRetryError}
            onOrderClicked={loadOrderEvents}
            onOrderRetryClicked={retryOrderProcessing}
          />
        </div>
      </section>
      <section>
        <div>
          <OrderEventsTable
            orderEvents={orderEvents}
            loading={loading}
            loadError={loadOrderEventsError}
          />
        </div>
      </section>
    </>
  )
}

export default App
