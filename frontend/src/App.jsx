import { useState } from 'react';

import Layout from './components/Layout.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';

const pageMap = {
  dashboard: Dashboard,
  products: ProductsPage,
  customers: CustomersPage,
  orders: OrdersPage,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const Page = pageMap[activePage];

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <Page onNavigate={setActivePage} />
    </Layout>
  );
}
