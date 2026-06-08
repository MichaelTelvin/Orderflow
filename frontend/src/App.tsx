import { CreateOrderForm } from './components/CreateOrderForm';
import { OrdersTable } from './components/OrdersTable';
import './assets/css/App.css';

function App() {

  return (
    <>
      <section id="center">
        <div>
          <CreateOrderForm />
        </div>
      </section>
      <section id="spacer"></section>
      <section>
        <div>
          <OrdersTable />
        </div>
      </section>
    </>
  )
}

export default App
