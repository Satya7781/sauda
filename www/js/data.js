// ============================================================
// FALLBACK DATA — Sauda
// ============================================================
// NOTE: All live data is loaded from backend API at:
// https://sauda-backend.onrender.com/api
// These are fallback constants used only when backend is unavailable.

// Product image mapping — local files
// In production, imageUrl comes from backend product record
var PRODUCT_IMAGES = {
  // Mapping ID -> filename (for local testing only)
  1: 'product-1.jpg',   // Fresh Palak
  2: 'product-2.jpg',   // Gobi
  3: 'product-3.jpg',   // Tamatar
  4: 'product-4.jpg',   // Doodh
  5: 'product-5.jpg',   // Dahi
  6: 'product-6.jpg',   // Paneer
  7: 'product-7.jpg',   // Aashirvaad Atta
  8: 'product-8.jpg',   // Chini
  9: 'product-9.jpg',   // Aam
  10: 'product-10.jpg',  // Kela
  11: 'product-11.jpg',  // Banarasi Silk Saree
  12: 'product-12.jpg',  // Cotton Kurta
  13: 'product-13.jpg',  // Designer Dupatta
  14: 'product-14.jpg',  // Anarkali Suit
  15: 'product-15.jpg',  // Palazzo Set
  16: 'product-16.jpg',  // Lehenga
  17: 'product-17.jpg',  // Custom Blouse
  18: 'product-18.jpg',  // Suit Stitching
  19: 'product-19.jpg',  // Mobile Cover
  20: 'product-20.jpg',  // Earphones
  21: 'product-21.jpg',  // Power Bank
  22: 'product-22.jpg',  // Mehendi Service
  23: 'product-23.jpg',  // Facial
  24: 'product-24.jpg',  // Threading
  25: 'product-25.jpg',  // AC Repair
  26: 'product-26.jpg',  // Plumbing
  27: 'product-27.jpg',  // Full Time Maid
  28: 'product-28.jpg',  // Part Time Maid
  29: 'product-29.jpg',  // Cook
  30: 'product-30.jpg',  // Baby Caretaker
  31: 'product-31.jpg',  // Elderly Caretaker
};

// ============================================================
// DEPRECATED: Mock data arrays below are no longer used
// All data is now fetched from backend API
// ============================================================
// Use state.js to access hydrated data:
// - state.categories (from API.fetchCategories())
// - state.products (from API.fetchProducts())
// - state.sellers (from API.fetchSellers())
// - state.users (from API.fetchUsers())
// - state.directory (from API.fetchDirectory())
// - state.orders (from API.fetchUserOrders())
// ============================================================
