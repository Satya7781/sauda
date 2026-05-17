// ============================================================
// API SERVICE — Sauda
// ============================================================

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? (window.location.port === '3000' ? 'http://localhost:8000/api' : '/api')
  : '/api';

const API = {
  async fetchCategories() {
    try {
      const resp = await fetch(`${API_BASE_URL}/categories`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch categories:', e);
      return [];
    }
  },

  async fetchProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const resp = await fetch(`${API_BASE_URL}/products?${query}`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch products:', e);
      return [];
    }
  },

  async fetchSeller(id) {
    try {
      const resp = await fetch(`${API_BASE_URL}/sellers/${id}`);
      if (!resp.ok) throw new Error('Seller not found');
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch seller:', e);
      return null;
    }
  },

  async fetchVouchChain() {
    try {
      const resp = await fetch(`${API_BASE_URL}/vouchchain`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch vouchchain:', e);
      return [];
    }
  },

  async placeOrder(productId, userId = 'you') {
    try {
      const resp = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId })
      });
      return await resp.json();
    } catch (e) {
      console.error('Failed to place order:', e);
      return { error: true };
    }
  },

  async fetchUserOrders(userId = 'you') {
    try {
      const resp = await fetch(`${API_BASE_URL}/orders/${userId}`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch orders:', e);
      return [];
    }
  },

  async onboard(userData) {
    try {
      const resp = await fetch(`${API_BASE_URL}/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await resp.json();
    } catch (e) {
      console.error('Failed to onboard:', e);
      return { error: true };
    }
  }
};
