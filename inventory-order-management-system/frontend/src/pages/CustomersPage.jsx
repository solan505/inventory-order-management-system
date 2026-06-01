import { RefreshCw, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Alert from '../components/Alert.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FormField from '../components/FormField.jsx';
import { customersApi } from '../services/api.js';

const initialForm = {
  full_name: '',
  email: '',
  phone_number: '',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const sortedCustomers = useMemo(
    () => [...customers].sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [customers]
  );

  async function loadCustomers() {
    setLoading(true);
    setError('');
    try {
      setCustomers(await customersApi.list());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    if (!form.full_name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email address is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid email address';
    if (!form.phone_number.trim()) return 'Phone number is required';
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
      await customersApi.create({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
      });
      setSuccess('Customer added');
      setForm(initialForm);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteCustomer(customer) {
    if (!window.confirm(`Delete ${customer.full_name}?`)) return;
    setError('');
    setSuccess('');
    try {
      await customersApi.remove(customer.id);
      setSuccess('Customer deleted');
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Accounts</span>
          <h1>Customers</h1>
        </div>
        <button className="button secondary" type="button" onClick={loadCustomers} disabled={loading}>
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert message={success} onClose={() => setSuccess('')} />

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Add Customer</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <FormField label="Full name">
            <input value={form.full_name} onChange={(event) => updateField('full_name', event.target.value)} required />
          </FormField>
          <FormField label="Email address">
            <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
          </FormField>
          <FormField label="Phone number">
            <input value={form.phone_number} onChange={(event) => updateField('phone_number', event.target.value)} required />
          </FormField>
          <div className="form-actions">
            <button className="button primary" type="submit" disabled={submitting}>
              <UserPlus size={16} aria-hidden="true" />
              Add Customer
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <h2>Customer List</h2>
            <p>{sortedCustomers.length} customers</p>
          </div>
        </div>
        {sortedCustomers.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.full_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone_number}</td>
                    <td className="row-actions">
                      <button className="icon-button danger" type="button" onClick={() => deleteCustomer(customer)} aria-label={`Delete ${customer.full_name}`}>
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title={loading ? 'Loading customers' : 'No customers yet'} />
        )}
      </section>
    </section>
  );
}
