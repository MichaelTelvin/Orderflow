import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import { OrderEventsTable } from './components/OrderEventsTable.js';
import { listOrders, updateOrderStatus, getOrderEvents } from './api/orders.js';
import { useState, useEffect } from 'react';
import type { Order, OrderEvent } from './types/orders';
import './assets/css/App.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadOrderError, setOrderLoadError] = useState<string | null>(null);
  const [loadOrderEventsError, setOrderEventsLoadError] = useState<string | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

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
      loadOrderEvents(orderId);
    } catch (err) {
      setStatusUpdateError(err instanceof Error ? err.message : 'Unknown error');
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
        <div>
          <OrdersTable
            orders={orders}
            loading={loading}
            loadError={loadOrderError}
            statusUpdateError={statusUpdateError}
            onOrderStatusChanged={changeOrderStatus}
            onOrderClicked={loadOrderEvents}
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
