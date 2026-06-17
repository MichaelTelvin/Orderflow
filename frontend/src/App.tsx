import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import { QueueStatsList } from './components/QueueStatsList.js';
import { OrderEventsTable } from './components/OrderEventsTable.js';
import { listOrders, getOrderEvents } from './api/orders.js';
import { getQueueStats } from './api/queue.js';
import { useState, useEffect } from 'react';
import type { Order, OrderEvent } from './types/orders';
import type { QueueStats } from './types/queue';
import './assets/css/App.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadOrderError, setOrderLoadError] = useState<string | null>(null);
  const [loadOrderEventsError, setOrderEventsLoadError] = useState<string | null>(null);
  const [loadQueueStatsError, setLoadQueueStatsError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    loadQueueStats();
    const interval = setInterval(
      loadQueueStats,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const loadQueueStats = async () => {
    try {
      setLoadQueueStatsError(null);

      const procQueueStats: any = await getQueueStats();
      if (!procQueueStats) {
        throw new Error('Failed to fetch queue stats');
      }

      setQueueStats(procQueueStats);
    } catch (err) {
      setLoadQueueStatsError(err instanceof Error ? err.message : 'Unknown error');
    }
  };


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

  const handleOrderCreated = () => {
    setTimeout(() => {
      loadOrders();
    }, 1000);
  };

  return (
    <>
      <section id="center">
        <CreateOrderForm
          onOrderCreated={handleOrderCreated} />
        <QueueStatsList
          queueStats={queueStats}
          loadError={loadQueueStatsError} />
      </section>
      <section>
        <OrdersTable
          orders={orders}
          loading={loading}
          loadError={loadOrderError}
          onOrderClicked={loadOrderEvents}
        />
      </section>
      <section>
        <OrderEventsTable
          orderEvents={orderEvents}
          loading={loading}
          loadError={loadOrderEventsError}
        />
      </section>
    </>
  )
}

export default App
