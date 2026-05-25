// ============================================================
// APP STATE — Sauda
// ============================================================

var state = {
  currentView: 'feed',
  isRecording: false,
  activeFilter: 'all',
  activeLocation: 'all',
  productFeed: [],
  categories: [],
  sellers: {},
  selectedSeller: null,
  selectedCategory: null,
  userRole: null,
  userName: '',
  userPhone: '',
  userLocation: 'Lalghati, Bhopal',
  aadhaarVerified: false,
  userCategories: [],
  onboardStep: 0,
  savedSellers: [],
  orders: [],
  notifications: [],
  groupDealJoined: false,
  sellerId: 'neeta',
  userShop: '',
  userLang: 'hi',
};

function saveState() {
  localStorage.setItem('sauda_onboard', '1');
  localStorage.setItem('sauda_name', state.userName || 'Aap');
  localStorage.setItem('sauda_role', state.userRole || 'buyer');
  localStorage.setItem('sauda_location', state.userLocation || 'Lalghati, Bhopal');
  localStorage.setItem('sauda_aadhaar', state.aadhaarVerified ? '1' : '0');
  localStorage.setItem('sauda_lang', state.userLang || 'hi');
  if (state.userShop) localStorage.setItem('sauda_shop', state.userShop);
}

async function loadState() {
  state.userName = localStorage.getItem('sauda_name') || 'Aap';
  state.userRole = localStorage.getItem('sauda_role') || 'buyer';
  state.userLocation = localStorage.getItem('sauda_location') || 'Lalghati, Bhopal';
  state.aadhaarVerified = localStorage.getItem('sauda_aadhaar') === '1';
  state.userShop = localStorage.getItem('sauda_shop') || '';
  state.userLang = localStorage.getItem('sauda_lang') || 'hi';

  // Fetch data from backend
  var products = await API.fetchProducts();
  var categories = await API.fetchCategories();
  var sellersList = await API.fetchSellers();
  var usersList = await API.fetchUsers();
  var directoryList = await API.fetchDirectory();
  
  // Build sellers map from backend, merge into global SELLERS for backward compat
  var sellersMap = {};
  if (sellersList.length) {
    sellersList.forEach(function(s) { sellersMap[s.id] = s; });
    Object.keys(sellersMap).forEach(function(k) { SELLERS[k] = sellersMap[k]; });
    state.sellers = SELLERS;
  } else {
    state.sellers = SELLERS;
  }
  
  // Build users map from backend
  if (usersList.length) {
    var usersMap = {};
    usersList.forEach(function(u) { usersMap[u.id] = u; });
    // Merge into USERS constant for backward compat
    Object.keys(usersMap).forEach(function(k) { USERS[k] = usersMap[k]; });
  }
  
  if (products.length) {
    state.productFeed = products;
    state._originalFeed = products;
  } else {
    state.productFeed = PRODUCTS.map(function(p) {
      return {
        id: p.id, title: p.title, titleEn: p.titleEn, titleHi: p.titleHi,
        price: p.price, unit: p.unit, seller: p.seller,
        category: p.category, stock: p.stock
      };
    });
    state._originalFeed = state.productFeed.slice();
  }
  
  if (categories.length) {
    state.categories = categories;
  } else {
    state.categories = CATEGORIES;
  }

  // Replace SELLER_DIRECTORY with backend data if available
  if (directoryList.length) {
    // Clear and repopulate the global SELLER_DIRECTORY
    SELLER_DIRECTORY.length = 0;
    directoryList.forEach(function(d) {
      SELLER_DIRECTORY.push({
        locality: d.locality,
        shop: d.shop,
        category: d.category,
        registered: d.registered,
        sellerId: d.sellerId
      });
    });
  }
}

function isOnboardingDone() {
  return localStorage.getItem('sauda_onboard') === '1';
}

function resetApp() {
  localStorage.clear();
  location.reload();
}
