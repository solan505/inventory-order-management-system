const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((item) => item.msg).join(', ')
      : data.detail || 'Request failed';
    throw new Error(detail);
  }

  return data;
}

export const dashboardApi = {
  getSummary: () => request('/dashboard'),
};

export const productsApi = {
  list: () => request('/products'),
  get: (id) => request(`/products/${id}`),
  create: (payload) =>
    request('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
};

export const customersApi = {
  list: () => request('/customers'),
  get: (id) => request(`/customers/${id}`),
  create: (payload) =>
    request('/customers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/customers/${id}`, {
      method: 'DELETE',
    }),
};

export const ordersApi = {
  list: () => request('/orders'),
  get: (id) => request(`/orders/${id}`),
  create: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/orders/${id}`, {
      method: 'DELETE',
    }),
};
