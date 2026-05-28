// ============================================================
// API SERVICE — Sauda
// ============================================================

var locPort = window.location.port;
var locHost = window.location.hostname;
var isLocalHost = locHost === 'localhost' || locHost === '127.0.0.1';
var isLocalDev = isLocalHost && (locPort === '8080' || locPort === '8000' || locPort === '3000');
var defaultProductionApiBaseUrl = 'https://sauda-backend.onrender.com/api';
var API_TIMEOUT_MS = 12000;

function normalizeApiBaseUrl(url) {
  if (!url || typeof url !== 'string') return '';
  return url.trim().replace(/\/+$/, '');
}

function isLoopbackUrl(url) {
  if (!url) return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

function getRuntimeConfiguredBaseUrl() {
  if (typeof window.getSaudaApiBaseUrl === 'function') {
    return normalizeApiBaseUrl(window.getSaudaApiBaseUrl());
  }
  if (window.__SAUDA_CONFIG__ && window.__SAUDA_CONFIG__.apiBaseUrl) {
    return normalizeApiBaseUrl(window.__SAUDA_CONFIG__.apiBaseUrl);
  }
  return '';
}

function resolveApiBaseUrl() {
  if (isLocalDev) return normalizeApiBaseUrl('http://' + locHost + ':8000/api');

  var configured = getRuntimeConfiguredBaseUrl();
  if (configured && !isLoopbackUrl(configured)) return configured;

  return normalizeApiBaseUrl(defaultProductionApiBaseUrl);
}

function updateResolvedApiBaseUrl() {
  var resolved = resolveApiBaseUrl();
  window.SAUDA_API_BASE_URL = resolved;
  return resolved;
}

function buildApiUrl(path, params) {
  var base = updateResolvedApiBaseUrl();
  var normalizedPath = path.charAt(0) === '/' ? path : '/' + path;
  if (!params) return base + normalizedPath;
  var query = new URLSearchParams(params).toString();
  return query ? (base + normalizedPath + '?' + query) : (base + normalizedPath);
}

async function fetchJson(url, options, timeoutMs) {
  var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var timer = null;
  var requestOptions = Object.assign({}, options || {});

  if (controller) {
    requestOptions.signal = controller.signal;
    timer = setTimeout(function () {
      try { controller.abort(); } catch (e) {}
    }, timeoutMs || API_TIMEOUT_MS);
  }

  try {
    var resp = await fetch(url, requestOptions);
    if (!resp.ok) throw new Error('HTTP ' + resp.status + ': ' + resp.statusText);
    return await resp.json();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function requestJson(path, options, params) {
  var attempts = [buildApiUrl(path, params)];
  var fallback = normalizeApiBaseUrl(defaultProductionApiBaseUrl);
  if (attempts[0].indexOf(fallback) !== 0) {
    var fallbackPath = path.charAt(0) === '/' ? path : '/' + path;
    var fallbackQuery = params ? new URLSearchParams(params).toString() : '';
    attempts.push(fallback + fallbackPath + (fallbackQuery ? ('?' + fallbackQuery) : ''));
  }

  var lastError = null;
  for (var i = 0; i < attempts.length; i++) {
    var url = attempts[i];
    try {
      if (i > 0) {
        window.SAUDA_API_BASE_URL = fallback;
        if (window.__SAUDA_CONFIG__) window.__SAUDA_CONFIG__.apiBaseUrl = fallback;
      }
      return await fetchJson(url, options, API_TIMEOUT_MS);
    } catch (e) {
      lastError = e;
      console.error('[API] request failed:', url, e.message);
    }
  }

  throw lastError || new Error('Request failed');
}

window.SAUDA_API_BASE_URL = updateResolvedApiBaseUrl();
console.log('[API] Base URL initialized:', window.SAUDA_API_BASE_URL);

const API = {
  async fetchCategories() {
    try {
      const data = await requestJson('/categories');
      console.log('[API] fetchCategories success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchCategories failed:', e.message);
      return [];
    }
  },

  async fetchProducts(params = {}) {
    try {
      const data = await requestJson('/products', null, params);
      console.log('[API] fetchProducts success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchProducts failed:', e.message);
      return [];
    }
  },

  async fetchSeller(id) {
    try {
      const data = await requestJson('/sellers/' + encodeURIComponent(id));
      console.log('[API] fetchSeller success:', id);
      return data;
    } catch (e) {
      console.error('[API] fetchSeller failed:', id, e.message);
      return null;
    }
  },

  async fetchVouchChain() {
    try {
      const data = await requestJson('/vouchchain');
      console.log('[API] fetchVouchChain success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchVouchChain failed:', e.message);
      return [];
    }
  },

  async placeOrder(productId, userId = 'you') {
    try {
      const data = await requestJson('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId })
      });
      console.log('[API] placeOrder success:', productId);
      return data;
    } catch (e) {
      console.error('[API] placeOrder failed:', e.message);
      return { error: true };
    }
  },

  async fetchUserOrders(userId = 'you') {
    try {
      const data = await requestJson('/orders/' + encodeURIComponent(userId));
      console.log('[API] fetchUserOrders success');
      return data;
    } catch (e) {
      console.error('[API] fetchUserOrders failed:', e.message);
      return [];
    }
  },

  async fetchSellers() {
    try {
      const data = await requestJson('/sellers');
      console.log('[API] fetchSellers success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchSellers failed:', e.message);
      return [];
    }
  },

  async fetchUsers() {
    try {
      const data = await requestJson('/users');
      console.log('[API] fetchUsers success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchUsers failed:', e.message);
      return [];
    }
  },

  async fetchDirectory(params = {}) {
    try {
      const data = await requestJson('/directory', null, params);
      console.log('[API] fetchDirectory success:', data.length, 'items');
      return data;
    } catch (e) {
      console.error('[API] fetchDirectory failed:', e.message);
      return [];
    }
  },

  async fetchPlaces(query) {
    try {
      const data = await requestJson('/places/search', null, { q: query });
      console.log('[API] fetchPlaces success');
      return data.places || [];
    } catch (e) {
      console.error('[API] fetchPlaces failed:', e.message);
      return [];
    }
  },

  async createProduct(productData) {
    try {
      const data = await requestJson('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      console.log('[API] createProduct success:', data.id);
      return data;
    } catch (e) {
      console.error('[API] createProduct failed:', e.message);
      return { error: true };
    }
  },

  async onboard(userData) {
    try {
      const data = await requestJson('/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      console.log('[API] onboard success');
      return data;
    } catch (e) {
      console.error('[API] onboard failed:', e.message);
      return { error: true };
    }
  }
};
