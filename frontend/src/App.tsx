import type { Order, OrderEvent, OrderSummary } from './types/orders';
import type { QueueStats } from './types/queue';
import { CreateOrderPanel } from './components/CreateOrderPanel.js';
import { OrdersList } from './components/OrdersList.js';
import { DashboardSummary } from './components/DashboardSummary.js';
import { OrderDetails } from './components/OrderDetails.js';
import { listOrders, getOrderEvents } from './api/orders.js';
import { getQueueStats } from './api/queue.js';
import { useState, useEffect, useMemo } from 'react';
import styles from './assets/css/App.module.css';


function App() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderEvents, setOrderEvents] = useState<OrderEvent[]>([]);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [loadOrderError, setOrderLoadError] = useState<string | null>(null);
  const [loadOrderEventsError, setOrderEventsLoadError] = useState<string | null>(null);
  const [loadQueueStatsError, setLoadQueueStatsError] = useState<string | null>(null);


  useEffect(() => {
    refreshDashboard();
    const interval = setInterval(() => {
      refreshDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOrderId]);

  const buildOrderSummary = (orders: Order[]): OrderSummary => {
    return orders.reduce<OrderSummary>((acc, order) => {
      switch (order.status) {
        case 'COMPLETED':
          acc.completed++;
          break;
        case 'FAILED':
          acc.failed++;
          break;
        case 'PROCESSING':
          acc.processing++;
          break;
      }
      return acc;
    }, {
      completed: 0,
      failed: 0,
      processing: 0,
    });
  };


  const orderSummary = useMemo(
    () => buildOrderSummary(orders),
    [orders]
  );


  const selectedOrder = useMemo(
    () => selectedOrderId
      ? orders.find(order => order.id === selectedOrderId) ?? null
      : null,
    [orders, selectedOrderId]
  );


  const refreshDashboard = async () => {
    await Promise.all([
      loadOrders(),
      loadQueueStats(),
      selectedOrderId ? loadOrderEvents(selectedOrderId) : Promise.resolve(),
    ]);
  };


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
      setOrderLoadError(null);

      const dbOrders: Order[] = await listOrders();
      if (!dbOrders) {
        throw new Error('Failed to fetch orders');
      }

      setOrders(dbOrders);
    } catch (err) {
      setOrderLoadError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setOrdersLoading(false);
    }
  };


  const loadOrderEvents = async (orderId: string) => {
    try {
      setOrderEventsLoadError(null);

      const dbOrderEvents: OrderEvent[] = await getOrderEvents(orderId);

      if (!dbOrderEvents) {
        throw new Error('Failed to fetch order events');
      }

      setOrderEvents(dbOrderEvents);
    } catch (err) {
      setOrderEventsLoadError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setEventsLoading(false);
    }
  };


  const handleOrderCreated = () => {
    setTimeout(async () => {
      refreshDashboard();
    }, 1000);
  };


  const handleOrderSelected = async (orderId: string) => {
    setSelectedOrderId(orderId);
    await loadOrderEvents(orderId);
  };


  return (
    <>
      <section className={`${styles.appSection} ${styles.unifiedBar}`}>
        <CreateOrderPanel
          onOrderCreated={handleOrderCreated} />
        <DashboardSummary
          orderSummary={orderSummary}
          queueStats={queueStats}
          loadError={loadQueueStatsError} />
      </section>
      <section className={`${styles.appSection} ${styles.masterDetail}`}>
        <OrdersList
          orders={orders}
          loading={ordersLoading}
          loadError={loadOrderError}
          onOrderClicked={handleOrderSelected}
        />
        <OrderDetails
          order={selectedOrder}
          orderEvents={orderEvents}
          loading={eventsLoading}
          loadError={loadOrderEventsError}
        />
      </section>
    </>
  )
}

export default App
