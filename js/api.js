// ============================================================
// API SERVICE — Sauda
// ============================================================

// Frontend on :8080, backend on :8000 — detect and proxy correctly
var locPort = window.location.port;
var locHost = window.location.hostname;
var isLocalDev = (locHost === 'localhost' || locHost === '127.0.0.1') && (locPort === '8080' || locPort === '8000' || locPort === '3000');
var defaultProductionApiBaseUrl = 'https://sauda-backend.onrender.com/api';

function resolveApiBaseUrl() {
  if (isLocalDev) {
    return 'http://' + locHost + ':8000/api';
  }

  if (typeof window.getSaudaApiBaseUrl === 'function') {
    return window.getSaudaApiBaseUrl();
  }

  if (window.__SAUDA_CONFIG__ && window.__SAUDA_CONFIG__.apiBaseUrl) {
    return window.__SAUDA_CONFIG__.apiBaseUrl;
  }

  return defaultProductionApiBaseUrl;
}

// Note: API_BASE_URL is set once on page load. To change it, call window.setSaudaApiBaseUrl()
var API_BASE_URL = resolveApiBaseUrl();
window.SAUDA_API_BASE_URL = API_BASE_URL;
console.log('[API] Base URL initialized:', API_BASE_URL);

const API = {
  async fetchCategories() {
    try {
      const url = `${API_BASE_URL}/categories`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      console.log('[API] fetchCategories success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchCategories failed:', e.message);
      return [];
    }
  },

  async fetchProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/products?${query}`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      const data = await resp.json();
      console.log('[API] fetchProducts success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchProducts failed:', e.message);
      return [];
    }
  },

  async fetchSeller(id) {
    try {
      const url = `${API_BASE_URL}/sellers/${id}`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Seller not found');
      const data = await resp.json();
      console.log('[API] fetchSeller success:', id);
      return data;
    } catch (e) {
      console.error('[API] fetchSeller failed:', id, e.message);
      return null;
    }
  },

  async fetchVouchChain() {
    try {
      const url = `${API_BASE_URL}/vouchchain`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchVouchChain success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchVouchChain failed:', e.message);
      return [];
    }
  },

  async placeOrder(productId, userId = 'you') {
    try {
      const url = `${API_BASE_URL}/orders`;
      console.log('[API] POST', url);
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId })
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] placeOrder success:', productId);
      return data;
    } catch (e) {
      console.error('[API] placeOrder failed:', e.message);
      return { error: true };
    }
  },

  async fetchUserOrders(userId = 'you') {
    try {
      const url = `${API_BASE_URL}/orders/${userId}`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchUserOrders success');
      return data;
    } catch (e) {
      console.error('[API] fetchUserOrders failed:', e.message);
      return [];
    }
  },

  async fetchSellers() {
    try {
      const url = `${API_BASE_URL}/sellers`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchSellers success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchSellers failed:', e.message);
      return [];
    }
  },

  async fetchUsers() {
    try {
      const url = `${API_BASE_URL}/users`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchUsers success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchUsers failed:', e.message);
      return [];
    }
  },

  async fetchDirectory(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/directory?${query}`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchDirectory success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchDirectory failed:', e.message);
      return [];
    }
  },

  async fetchPlaces(query) {
    try {
      const url = `${API_BASE_URL}/places/search?q=${encodeURIComponent(query)}`;
      console.log('[API] GET', url);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] fetchPlaces success');
      return data.places || [];
    } catch (e) {
      console.error('[API] fetchPlaces failed:', e.message);
      return [];
    }
  },

  async onboard(userData) {
    try {
      const url = `${API_BASE_URL}/onboard`;
      console.log('[API] POST', url);
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      console.log('[API] onboard success');
      return data;
    } catch (e) {
      console.error('[API] onboard failed:', e.message);
      return { error: true };
    }
  }
};
