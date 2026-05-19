// ============================================================
// APP STATE — Sauda
// ============================================================

var state = {
  currentView: 'feed',
  isRecording: false,
  activeFilter: 'all',
  productFeed: [],
  categories: [],
  sellers: {},
  selectedSeller: null,
  selectedCategory: null,
  userRole: null,
  userName: '',
  userPhone: '',
  userLocation: 'Sultanpuri, Delhi',
  aadhaarVerified: false,
  userCategories: [],
  onboardStep: 0,
  savedSellers: [],
  orders: [],
  notifications: [],
  groupDealJoined: false,
  sellerId: 'neeta',
};

function saveState() {
  localStorage.setItem('sauda_onboard', '1');
  localStorage.setItem('sauda_name', state.userName || 'Aap');
  localStorage.setItem('sauda_role', state.userRole || 'buyer');
  localStorage.setItem('sauda_location', state.userLocation || 'Sultanpuri, Delhi');
  localStorage.setItem('sauda_aadhaar', state.aadhaarVerified ? '1' : '0');
}

async function loadState() {
  state.userName = localStorage.getItem('sauda_name') || 'Aap';
  state.userRole = localStorage.getItem('sauda_role') || 'buyer';
  state.userLocation = localStorage.getItem('sauda_location') || 'Sultanpuri, Delhi';
  state.aadhaarVerified = localStorage.getItem('sauda_aadhaar') === '1';

  // Fetch data from backend or fallback to mock data
  const products = await API.fetchProducts();
  const categories = await API.fetchCategories();
  
  if (products.length) {
    state.productFeed = products;
  } else {
    // Fallback to mock data
    state.productFeed = PRODUCTS.map(function(p) {
      return {
        id: p.id,
        title: p.title,
        titleHi: p.titleHi,
        price: p.price,
        unit: p.unit,
        seller: p.seller,
        category: p.category,
        stock: p.stock
      };
    });
  }
  
  if (categories.length) {
    state.categories = categories;
  } else {
    // Fallback to mock data
    state.categories = CATEGORIES;
  }
}

function isOnboardingDone() {
  return localStorage.getItem('sauda_onboard') === '1';
}

function resetApp() {
  localStorage.clear();
  location.reload();
}
