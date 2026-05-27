(function () {
  var defaultApiBaseUrl = 'https://sauda-backend.onrender.com/api';
  var runtimeConfig = window.__SAUDA_CONFIG__ || {};
  var storedApiBaseUrl = null;

  try {
    storedApiBaseUrl = localStorage.getItem('sauda_api_base_url');
  } catch (e) {
    storedApiBaseUrl = null;
  }

  var apiBaseUrl = runtimeConfig.apiBaseUrl || storedApiBaseUrl || defaultApiBaseUrl;

  window.__SAUDA_CONFIG__ = Object.assign({}, runtimeConfig, {
    apiBaseUrl: apiBaseUrl,
  });
  window.SAUDA_API_BASE_URL = apiBaseUrl;

  window.setSaudaApiBaseUrl = function (nextUrl) {
    var normalized = (nextUrl || '').trim();
    if (!normalized) return window.SAUDA_API_BASE_URL;

    window.SAUDA_API_BASE_URL = normalized;
    window.__SAUDA_CONFIG__.apiBaseUrl = normalized;
    try {
      localStorage.setItem('sauda_api_base_url', normalized);
    } catch (e) {}
    return normalized;
  };

  window.getSaudaApiBaseUrl = function () {
    return window.SAUDA_API_BASE_URL || defaultApiBaseUrl;
  };
})();