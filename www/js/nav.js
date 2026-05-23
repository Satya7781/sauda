// ============================================================
// NAVIGATION — Sauda
// ============================================================

function navigateTo(view) {
  state.currentView = view;
  document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
  document.getElementById('view-' + view).classList.add('active');

  var navItems = document.querySelectorAll('.nav-item, .desktop-link');
  navItems.forEach(function (n) {
    n.classList.toggle('active', n.dataset.view === view);
  });

  if (view === 'categories') renderCategoryGrid();
  if (view === 'seller-dashboard') renderSellerDashboard();
  if (view === 'profile') renderProfile();
  if (view === 'voice') initVoiceSection();
}

function setupNav() {
  var navItems = document.querySelectorAll('.nav-item, .desktop-link');
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      navigateTo(item.dataset.view);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') navigateTo(item.dataset.view);
    });
  });
}

function updateNavForRole() {
  var role = state.userRole || 'buyer';
  
  // Update Bottom Nav
  var bottomNav = document.querySelector('.bottom-nav');
  if (bottomNav) bottomNav.setAttribute('data-role', role);
  
  // Update Desktop Nav
  var desktopNav = document.querySelector('.desktop-nav');
  if (desktopNav) desktopNav.setAttribute('data-role', role);

  document.querySelectorAll('.nav-item, .desktop-link').forEach(function (item) {
    var show = item.dataset.show;
    if (!show) { item.style.display = ''; return; }
    item.style.display = (show === role) ? '' : 'none';
  });
}
