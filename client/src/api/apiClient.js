// API Client helper
const BASE_URL = '';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/api/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => apiRequest('/api/auth/register', { method: 'POST', body: userData }),
  getProfile: () => apiRequest('/api/auth/profile'),
  updateProfile: (userData) => apiRequest('/api/auth/profile', { method: 'PUT', body: userData }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return apiRequest(`/api/products?${query.toString()}`);
  },
  getProductById: (id) => apiRequest(`/api/products/${id}`),
  getCategories: () => apiRequest('/api/products/meta/categories'),
  createProduct: (data) => apiRequest('/api/products', { method: 'POST', body: data }),
  updateProduct: (id, data) => apiRequest(`/api/products/${id}`, { method: 'PUT', body: data }),
  deleteProduct: (id) => apiRequest(`/api/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => apiRequest('/api/cart'),
  addToCart: (productId, quantity = 1) => apiRequest('/api/cart', { method: 'POST', body: { productId, quantity } }),
  updateCartItem: (productId, quantity) => apiRequest(`/api/cart/${productId}`, { method: 'PUT', body: { quantity } }),
  removeFromCart: (productId) => apiRequest(`/api/cart/${productId}`, { method: 'DELETE' }),
  clearCart: () => apiRequest('/api/cart', { method: 'DELETE' }),

  // Orders
  createOrder: (orderData) => apiRequest('/api/orders', { method: 'POST', body: orderData }),
  getOrderById: (id) => apiRequest(`/api/orders/${id}`),
  getMyOrders: () => apiRequest('/api/orders/myorders'),
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params);
    return apiRequest(`/api/orders?${query.toString()}`);
  },
  updateOrderStatus: (id, status) => apiRequest(`/api/orders/${id}/status`, { method: 'PUT', body: { status } }),

  // Admin
  getAdminAnalytics: () => apiRequest('/api/admin/analytics')
};
