// ============================================================
// API SERVICE — Sauda
// ============================================================

// Frontend on :8080, backend on :8000 — detect and proxy correctly
var locPort = window.location.port;
var locHost = window.location.hostname;
var isLocal = locHost === 'localhost' || locHost === '127.0.0.1';
// If we're on any local dev port (3000, 8080, etc.), point API at :8000
var API_BASE_URL = isLocal ? ('http://' + locHost + ':8000/api') : '/api';

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

  async fetchSellers() {
    try {
      const resp = await fetch(`${API_BASE_URL}/sellers`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch sellers:', e);
      return [];
    }
  },

  async fetchUsers() {
    try {
      const resp = await fetch(`${API_BASE_URL}/users`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch users:', e);
      return [];
    }
  },

  async fetchDirectory(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const resp = await fetch(`${API_BASE_URL}/directory?${query}`);
      return await resp.json();
    } catch (e) {
      console.error('Failed to fetch directory:', e);
      return [];
    }
  },

  async fetchPlaces(query) {
    try {
      const resp = await fetch(`${API_BASE_URL}/places/search?q=${encodeURIComponent(query)}`);
      const data = await resp.json();
      return data.places || [];
    } catch (e) {
      console.error('Failed to fetch places:', e);
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
