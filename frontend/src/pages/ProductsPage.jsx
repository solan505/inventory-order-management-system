import { Edit3, PackagePlus, RefreshCw, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FormField from '../components/FormField.jsx';
import { productsApi } from '../services/api.js';

const initialForm = {
  name: '',
  sku: '',
  price: '',
  quantity_in_stock: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      setProducts(await productsApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.sku.trim()) return 'SKU is required';
    if (Number(form.price) <= 0) return 'Price must be greater than zero';
    if (!Number.isInteger(Number(form.quantity_in_stock)) || Number(form.quantity_in_stock) < 0) {
      return 'Quantity cannot be negative';
    }
    return '';
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
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

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price).toFixed(2),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
        setSuccess('Product updated');
      } else {
        await productsApi.create(payload);
        setSuccess('Product added');
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    setError('');
    setSuccess('');
    try {
      await productsApi.remove(product.id);
      setSuccess('Product deleted');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: Number(product.price).toFixed(2),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Products</h1>
        </div>
        <button className="button secondary" type="button" onClick={loadProducts} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert message={success} onClose={() => setSuccess('')} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
          </div>
          {editingId && (
            <button className="button ghost-button" type="button" onClick={resetForm}>
              <X size={16} aria-hidden="true" />
              Cancel
            </button>
          )}
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <FormField label="Product name">
            <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </FormField>
          <FormField label="SKU/code">
            <input value={form.sku} onChange={(event) => updateField('sku', event.target.value)} required />
          </FormField>
          <FormField label="Price">
            <input
              min="0.01"
              step="0.01"
              type="number"
              value={form.price}
              onChange={(event) => updateField('price', event.target.value)}
              required
            />
          </FormField>
          <FormField label="Quantity in stock">
            <input
              min="0"
              step="1"
              type="number"
              value={form.quantity_in_stock}
              onChange={(event) => updateField('quantity_in_stock', event.target.value)}
              required
            />
          </FormField>
          <div className="form-actions">
            <button className="button primary" type="submit" disabled={submitting}>
              <PackagePlus size={16} aria-hidden="true" />
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Product List</h2>
            <p>{sortedProducts.length} products</p>
          </div>
        </div>
        {sortedProducts.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td><span className="sku">{product.sku}</span></td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>
                      <span className={`stock-pill ${product.quantity_in_stock <= 5 ? 'warning' : ''}`}>
                        {product.quantity_in_stock}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button className="icon-button" type="button" onClick={() => startEdit(product)} aria-label={`Edit ${product.name}`}>
                        <Edit3 size={16} aria-hidden="true" />
                      </button>
                      <button className="icon-button danger" type="button" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`}>
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={loading ? 'Loading products' : 'No products yet'} />
        )}
      </section>
    </section>
  );
}
