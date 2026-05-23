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
    document.getElementById('feed-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : 'Dukaandaar');
    document.getElementById('dashboard-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : 'Dukaandaar');
    document.getElementById('view-seller-dashboard').classList.add('active');
    document.getElementById('view-feed').classList.remove('active');
    state.currentView = 'seller-dashboard';
  } else {
    document.getElementById('feed-greeting').textContent = __('namaste');
    document.getElementById('view-feed').classList.add('active');
    state.currentView = 'feed';
  }

  document.getElementById('feed-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('dashboard-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-name').textContent = name;
  document.getElementById('profile-listings-count').textContent = role === 'seller' ? getSellerProducts().length : '0';
  document.getElementById('profile-orders-count').textContent = (state.orders || []).length;
  document.getElementById('profile-saved-count').textContent = (state.savedSellers || []).length;

  renderProfile();

  renderCategoryCards();
  renderFilterChips();
  renderLocationChips();
  renderFeed();
  if (role === 'seller') renderSellerDashboard();
  initVoiceSection();

  // Seed initial notifications
  if (!state.notifications || state.notifications.length === 0) {
    state.notifications = [
      { msg: __('notif_order_deal'), type: 'order', time: Date.now() - 3600000 },
      { msg: __('notif_new_seller'), type: 'info', time: Date.now() - 7200000 },
      { msg: __('notif_group_deal'), type: 'info', time: Date.now() - 86400000 }
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
