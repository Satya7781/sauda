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
  userId: '',
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
  if (state.userId) localStorage.setItem('sauda_user_id', state.userId);
  localStorage.setItem('sauda_name', state.userName || 'Aap');
  localStorage.setItem('sauda_role', state.userRole || 'buyer');
  localStorage.setItem('sauda_location', state.userLocation || 'Lalghati, Bhopal');
  localStorage.setItem('sauda_aadhaar', state.aadhaarVerified ? '1' : '0');
  localStorage.setItem('sauda_lang', state.userLang || 'hi');
  localStorage.setItem('sauda_seller_id', state.sellerId || 'neeta');
  if (state.userShop) localStorage.setItem('sauda_shop', state.userShop);
}

async function loadState() {
  console.log('[STATE] Loading app state...');
  state.userId = localStorage.getItem('sauda_user_id') || '';
  state.userName = localStorage.getItem('sauda_name') || 'Aap';
  state.userRole = localStorage.getItem('sauda_role') || 'buyer';
  state.userLocation = localStorage.getItem('sauda_location') || 'Lalghati, Bhopal';
  state.aadhaarVerified = localStorage.getItem('sauda_aadhaar') === '1';
  state.userShop = localStorage.getItem('sauda_shop') || '';
  state.userLang = localStorage.getItem('sauda_lang') || 'hi';
  state.sellerId = localStorage.getItem('sauda_seller_id') || state.sellerId || 'neeta';
  console.log('[STATE] Local state loaded:', { userId: state.userId, role: state.userRole, name: state.userName, lang: state.userLang });

  // Fetch data from backend
  console.log('[STATE] Fetching backend data...');
  var requests = [
    API.fetchProducts(),
    API.fetchCategories(),
    API.fetchSellers(),
    API.fetchUsers(),
    API.fetchDirectory(),
    state.userId ? API.fetchUserOrders(state.userId) : Promise.resolve([])
  ];

  var settled = await Promise.allSettled(requests);

  function settledValue(index, fallback) {
    return settled[index] && settled[index].status === 'fulfilled' && settled[index].value ? settled[index].value : fallback;
  }

  var products = settledValue(0, []);
  var categories = settledValue(1, []);
  var sellersList = settledValue(2, []);
  var usersList = settledValue(3, []);
  var directoryList = settledValue(4, []);
  var backendOrders = settledValue(5, []);
  console.log('[STATE] Backend data fetched:', { products: products.length, categories: categories.length, sellers: sellersList.length, users: usersList.length, directory: directoryList.length, orders: backendOrders.length });
  
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

  if (backendOrders.length) {
    state.orders = backendOrders.map(function (o) {
      return {
        id: o.id,
        productId: o.product && o.product.id,
        title: o.product && o.product.title ? o.product.title : 'Item',
        price: o.product && o.product.price ? o.product.price : 0,
        sellerId: o.product && o.product.seller ? o.product.seller : '',
        sellerName: (o.product && o.product.seller) ? getSellerRecord(o.product.seller).shop : 'Unknown Seller',
        status: o.status || 'confirmed',
        time: (o.timestamp || Date.now() / 1000) * 1000,
        quantity: 1,
        total: o.product && o.product.price ? o.product.price : 0
      };
    });
    console.log('[STATE] Orders hydrated from backend:', state.orders.length);
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
