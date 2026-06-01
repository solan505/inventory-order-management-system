import { AlertTriangle, Boxes, ClipboardList, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { dashboardApi } from '../services/api.js';

const statConfig = [
  { key: 'total_products', label: 'Products', icon: Boxes, tone: 'teal' },
  { key: 'total_customers', label: 'Customers', icon: Users, tone: 'blue' },
  { key: 'total_orders', label: 'Orders', icon: ClipboardList, tone: 'violet' },
  { key: 'low_stock_count', label: 'Low Stock', icon: AlertTriangle, tone: 'amber' },
];

export default function Dashboard({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadSummary() {
    setLoading(true);
    setError('');
    try {
      setSummary(await dashboardApi.getSummary());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Operations</span>
          <h1>Dashboard</h1>
        </div>
        <button className="button secondary" type="button" onClick={loadSummary} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="stat-grid">
        {statConfig.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`stat-card tone-${item.tone}`}
              type="button"
              onClick={() => {
                if (item.key === 'total_products' || item.key === 'low_stock_count') onNavigate('products');
                if (item.key === 'total_customers') onNavigate('customers');
                if (item.key === 'total_orders') onNavigate('orders');
              }}
            >
              <span className="stat-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
              <strong>{loading ? '-' : summary?.[item.key] ?? 0}</strong>
            </button>
          );
        })}
      </div>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Low Stock Products</h2>
            <p>Products at or below the configured stock threshold.</p>
          </div>
        </div>
        {summary?.low_stock_products?.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {summary.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td><span className="sku">{product.sku}</span></td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`stock-pill ${product.quantity_in_stock === 0 ? 'danger' : 'warning'}`}>
                        {product.quantity_in_stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={loading ? 'Loading summary' : 'No low stock products'} />
        )}
      </section>
    </section>
  );
}
