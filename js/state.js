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
  console.log('[STATE] Loading app state...');
  state.userName = localStorage.getItem('sauda_name') || 'Aap';
  state.userRole = localStorage.getItem('sauda_role') || 'buyer';
  state.userLocation = localStorage.getItem('sauda_location') || 'Lalghati, Bhopal';
  state.aadhaarVerified = localStorage.getItem('sauda_aadhaar') === '1';
  state.userShop = localStorage.getItem('sauda_shop') || '';
  state.userLang = localStorage.getItem('sauda_lang') || 'hi';
  console.log('[STATE] Local state loaded:', { role: state.userRole, name: state.userName, lang: state.userLang });

  // Fetch data from backend
  console.log('[STATE] Fetching backend data...');
  var products = await API.fetchProducts();
  var categories = await API.fetchCategories();
  var sellersList = await API.fetchSellers();
  var usersList = await API.fetchUsers();
  var directoryList = await API.fetchDirectory();
  console.log('[STATE] Backend data fetched:', { products: products.length, categories: categories.length, sellers: sellersList.length, users: usersList.length, directory: directoryList.length });
  
  // Build sellers map from backend, merge into global SELLERS for backward compat
  var sellersMap = {};
  if (sellersList.length) {
    sellersList.forEach(function(s) { sellersMap[s.id] = s; });
    Object.keys(sellersMap).forEach(function(k) { SELLERS[k] = sellersMap[k]; });
    state.sellers = SELLERS;
    console.log('[STATE] Sellers merged into SELLERS map');
  } else {
    state.sellers = SELLERS;
    console.log('[STATE] No sellers from backend, using local SELLERS');
  }
  
  // Build users map from backend
  if (usersList.length) {
    var usersMap = {};
    usersList.forEach(function(u) { usersMap[u.id] = u; });
    // Merge into USERS constant for backward compat
    Object.keys(usersMap).forEach(function(k) { USERS[k] = usersMap[k]; });
    console.log('[STATE] Users merged into USERS map');
  }
  
  if (products.length) {
    state.productFeed = products;
    state._originalFeed = products;
    console.log('[STATE] Using backend products:', products.length);
  } else {
    state.productFeed = PRODUCTS.map(function(p) {
      return {
        id: p.id, title: p.title, titleEn: p.titleEn, titleHi: p.titleHi,
        price: p.price, unit: p.unit, seller: p.seller,
        category: p.category, stock: p.stock
      };
    });
    state._originalFeed = state.productFeed.slice();
    console.log('[STATE] Using local products:', PRODUCTS.length);
  }
  
  if (categories.length) {
    state.categories = categories;
    console.log('[STATE] Using backend categories:', categories.length);
  } else {
    state.categories = CATEGORIES;
    console.log('[STATE] Using local categories:', CATEGORIES.length);
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
    console.log('[STATE] Directory populated from backend:', directoryList.length);
  }
  console.log('[STATE] App state fully loaded');
}

function isOnboardingDone() {
  return localStorage.getItem('sauda_onboard') === '1';
}

function resetApp() {
  localStorage.clear();
  location.reload();
}
