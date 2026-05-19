// ============================================================
// APP BOOT & INIT — Sauda
// ============================================================

async function initMainApp() {
  await loadState();
  var name = state.userName || 'Aap';
  var role = state.userRole || 'buyer';
  var aadhaar = state.aadhaarVerified;

  document.documentElement.setAttribute('data-role', role);
  document.getElementById('app').setAttribute('data-role', role);
  updateNavForRole();

  if (role === 'seller') {
    var sellerObj = SELLERS[state.sellerId || 'neeta'];
    document.getElementById('feed-greeting').textContent = 'Namaste, ' + (sellerObj ? sellerObj.name.split(' ')[0] : 'Dukaandaar');
    document.getElementById('dashboard-greeting').textContent = 'Namaste, ' + (sellerObj ? sellerObj.name.split(' ')[0] : 'Dukaandaar');
    document.getElementById('view-seller-dashboard').classList.add('active');
    document.getElementById('view-feed').classList.remove('active');
    state.currentView = 'seller-dashboard';
  } else {
    document.getElementById('feed-greeting').textContent = 'Namaste';
    document.getElementById('view-feed').classList.add('active');
    state.currentView = 'feed';
  }

  document.getElementById('feed-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-location').textContent = state.userLocation;
  document.getElementById('profile-role').textContent = role === 'seller' ? 'Active Seller' : 'Active Buyer';
  document.getElementById('profile-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-name').textContent = name;
  document.getElementById('profile-connections').textContent = '5 trusted connections';
  document.getElementById('my-listings-count').textContent = role === 'seller' ? getSellerProducts().length : '0';
  document.getElementById('my-orders-count').textContent = (state.orders || []).length;
  document.getElementById('saved-sellers-count').textContent = (state.savedSellers || []).length;

  var badges = [];
  if (aadhaar) badges.push('<div class="vouch-tag text-[9px]"><i class="fa-solid fa-shield-halved text-[7px]"></i>Aadhaar</div>');
  badges.push('<div class="vouch-tag text-[9px]"><i class="fa-solid fa-people-group text-[7px]"></i>5 Vouches</div>');
  if (role === 'seller') badges.push('<div class="vouch-tag text-[9px]" style="background:var(--seller-accent-light);color:var(--seller-accent)"><i class="fa-solid fa-store text-[7px]"></i>Seller</div>');
  document.getElementById('profile-badges').innerHTML = badges.join('');
  document.getElementById('aadhaar-status-icon').className = aadhaar ? 'fa-solid fa-check-circle' : 'fa-solid fa-circle-xmark';
  document.getElementById('aadhaar-status-icon').style.color = aadhaar ? 'var(--trust)' : 'var(--text3)';

  renderCategoryCards();
  renderFilterChips();
  renderFeed();
  if (role === 'seller') renderSellerDashboard();
  initVoice();

  // Seed initial notifications
  if (!state.notifications || state.notifications.length === 0) {
    state.notifications = [
      { msg: 'Priya ne Banarasi Silk Saree ka deal kiya', type: 'order', time: Date.now() - 3600000 },
      { msg: 'Naya seller: Rajesh Mobile Corner aaya', type: 'info', time: Date.now() - 7200000 },
      { msg: 'Group Deal: 3 log milke 20% sasta!', type: 'info', time: Date.now() - 86400000 }
    ];
  }
  updateNotificationBadge();
}

async function boot() {
  await loadState();
  if (isOnboardingDone()) {
    document.querySelectorAll('.onboard').forEach(function (o) { o.classList.remove('active'); });
    document.getElementById('main-app').style.display = 'flex';
    initMainApp();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupFeedSearch();
  boot();
});
