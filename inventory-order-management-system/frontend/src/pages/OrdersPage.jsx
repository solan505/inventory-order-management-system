import { ClipboardPlus, Eye, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FormField from '../components/FormField.jsx';
import { customersApi, ordersApi, productsApi } from '../services/api.js';

const initialOrderForm = {
  customer_id: '',
  items: [{ product_id: '', quantity: 1 }],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialOrderForm);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const productsById = useMemo(
    () => Object.fromEntries(products.map((product) => [String(product.id), product])),
    [products]
  );

  const estimatedTotal = useMemo(
    () =>
      form.items.reduce((total, item) => {
        const product = productsById[item.product_id];
        const quantity = Number(item.quantity) || 0;
        return product ? total + Number(product.price) * quantity : total;
      }, 0),
    [form.items, productsById]
  );

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [ordersData, productsData, customersData] = await Promise.all([
        ordersApi.list(),
        productsApi.list(),
        customersApi.list(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function setCustomer(value) {
    setForm((current) => ({ ...current, customer_id: value }));
  }

  function updateItem(index, field, value) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      items: [...current.items, { product_id: '', quantity: 1 }],
    }));
  }

  function removeItem(index) {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function validateForm() {
    if (!form.customer_id) return 'Select a customer';
    if (!form.items.length) return 'Add at least one product';
    for (const item of form.items) {
      if (!item.product_id) return 'Select a product for each row';
      if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
        return 'Quantity ordered must be a positive whole number';
      }
    }
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await ordersApi.create({
        customer_id: Number(form.customer_id),
        items: form.items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
        })),
      });
      setSuccess('Order created');
      setForm(initialOrderForm);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteOrder(order) {
    if (!window.confirm(`Delete order #${order.id}?`)) return;
    setError('');
    setSuccess('');
    try {
      await ordersApi.remove(order.id);
      setSuccess('Order deleted');
      if (selectedOrder?.id === order.id) setSelectedOrder(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Sales</span>
          <h1>Orders</h1>
        </div>
        <button className="button secondary" type="button" onClick={loadData} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert message={success} onClose={() => setSuccess('')} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Create Order</h2>
          </div>
          <strong className="amount">${estimatedTotal.toFixed(2)}</strong>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid compact">
            <FormField label="Customer">
              <select value={form.customer_id} onChange={(event) => setCustomer(event.target.value)} required>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="item-editor">
            {form.items.map((item, index) => {
              const product = productsById[item.product_id];
              return (
                <div className="order-item-row" key={`${index}-${item.product_id || 'new'}`}>
                  <FormField label="Product">
                    <select value={item.product_id} onChange={(event) => updateItem(index, 'product_id', event.target.value)} required>
                      <option value="">Select product</option>
                      {products.map((productOption) => (
                        <option key={productOption.id} value={productOption.id}>
                          {productOption.name} - {productOption.sku} ({productOption.quantity_in_stock} in stock)
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Quantity ordered">
                    <input
                      min="1"
                      step="1"
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                      required
                    />
                  </FormField>
                  <div className="line-preview">
                    <span>{product ? `$${Number(product.price).toFixed(2)} each` : '-'}</span>
                  </div>
                  <button
                    className="icon-button danger"
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                    disabled={form.items.length === 1}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="split-actions">
            <button className="button secondary" type="button" onClick={addItem}>
              <Plus size={16} aria-hidden="true" />
              Add Item
            </button>
            <button className="button primary" type="submit" disabled={submitting}>
              <ClipboardPlus size={16} aria-hidden="true" />
              Create Order
            </button>
          </div>
        </form>
      </section>

      <div className="two-column">
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Order List</h2>
              <p>{orders.length} orders</p>
            </div>
          </div>
          {orders.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer?.full_name}</td>
                      <td>${Number(order.total_amount).toFixed(2)}</td>
                      <td className="row-actions">
                        <button className="icon-button" type="button" onClick={() => setSelectedOrder(order)} aria-label={`View order ${order.id}`}>
                          <Eye size={16} aria-hidden="true" />
                        </button>
                        <button className="icon-button danger" type="button" onClick={() => deleteOrder(order)} aria-label={`Delete order ${order.id}`}>
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title={loading ? 'Loading orders' : 'No orders yet'} />
          )}
        </section>

        <section className="panel detail-panel">
          <div className="section-heading">
            <div>
              <h2>Order Details</h2>
              {selectedOrder && <p>#{selectedOrder.id}</p>}
            </div>
          </div>
          {selectedOrder ? (
            <div className="details">
              <div className="detail-row">
                <span>Customer</span>
                <strong>{selectedOrder.customer?.full_name}</strong>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <strong>{selectedOrder.customer?.email}</strong>
              </div>
              <div className="detail-row">
                <span>Total</span>
                <strong>${Number(selectedOrder.total_amount).toFixed(2)}</strong>
              </div>
              <div className="detail-items">
                {selectedOrder.items.map((item) => (
                  <div className="detail-item" key={item.id}>
                    <div>
                      <strong>{item.product_name}</strong>
                      <span>{item.product_sku}</span>
                    </div>
                    <div>
                      <span>{item.quantity} x ${Number(item.unit_price).toFixed(2)}</span>
                      <strong>${Number(item.line_total).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState title="Select an order" />
          )}
        </section>
      </div>
    </section>
  );
}
