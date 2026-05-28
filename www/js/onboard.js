// ============================================================
// ONBOARDING — Sauda
// ============================================================

function goOnboard(step) {
  var boards = document.querySelectorAll('.onboard');
  boards.forEach(function (o) { o.classList.remove('active'); });

  var el = document.getElementById('onboard-' + step);
  if (el) el.classList.add('active');
  state.onboardStep = step;

  if (step === 4) {
    // Capture location from input if moving from step 3
    var locationInput = document.getElementById('inp-location');
    var locVal = locationInput ? locationInput.value.trim() : '';
    if (locVal) state.userLocation = locVal;

    if (state.userRole === 'seller') {
      var sellerStep = document.getElementById('onboard-4a');
      var buyerStep = document.getElementById('onboard-4b');
      if (sellerStep) sellerStep.classList.add('active');
      if (buyerStep) buyerStep.classList.remove('active');
      renderSellerCatChips();
    } else {
      var sellerStepBuyer = document.getElementById('onboard-4a');
      var buyerStepBuyer = document.getElementById('onboard-4b');
      if (buyerStepBuyer) buyerStepBuyer.classList.add('active');
      if (sellerStepBuyer) sellerStepBuyer.classList.remove('active');
      renderBuyerCatChips();
    }
  }
  if (step === 2) updateNameBtn();
  if (step === 6) {
    var welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = state.userName || (typeof __ === 'function' ? __('friend') : 'Friend');
  }
}

function selectRole(role, el) {
  state.userRole = role;
  document.querySelectorAll('.role-card').forEach(function (c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  document.getElementById('role-next-btn').disabled = false;
}

function updateNameBtn() {
  var nameInput = document.getElementById('inp-name');
  var phoneInput = document.getElementById('inp-phone');
  var nextButton = document.getElementById('name-next-btn');
  if (!nameInput || !phoneInput || !nextButton) return;

  var n = nameInput.value.trim();
  var p = phoneInput.value.trim();
  nextButton.disabled = !(n.length >= 2 && /^\d{10}$/.test(p));
}

function autoDetectLocation() {
  var el = document.getElementById('location-detected');
  if (!el) return;
  el.style.display = 'flex';
  el.style.background = 'var(--trust-light)';
  el.style.border = '1px solid rgba(13,148,136,0.15)';
  el.style.borderRadius = '12px';
  var locationText = document.getElementById('location-text');
  var locationInput = document.getElementById('inp-location');
  if (locationText) locationText.textContent = 'Lalghati, Bhopal — Detected';
  state.userLocation = 'Lalghati, Bhopal';
  if (locationInput) locationInput.value = 'Lalghati, Bhopal';
}

function renderSellerCatChips() {
  var c = document.getElementById('seller-cat-chips');
  if (!c) return;
  
  // Ensure categories are loaded
  if (!state.categories || state.categories.length === 0) {
    state.categories = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
  }
  
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="cat-chip" onclick="toggleCatChip(this,\'' + cat.id + '\')"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i>' + getCategoryName(cat) + '</div>';
  }).join('');
}

function renderBuyerCatChips() {
  var c = document.getElementById('buyer-cat-chips');
  if (!c) return;
  
  // Ensure categories are loaded
  if (!state.categories || state.categories.length === 0) {
    state.categories = typeof CATEGORIES !== 'undefined' ? CATEGORIES : [];
  }
  
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="cat-chip" onclick="toggleCatChip(this,\'' + cat.id + '\')"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i>' + getCategoryName(cat) + '</div>';
  }).join('');
}

function toggleCatChip(el, id) {
  el.classList.toggle('selected');
  if (!state.userCategories) state.userCategories = [];
  if (el.classList.contains('selected')) {
    if (state.userCategories.indexOf(id) === -1) state.userCategories.push(id);
  } else {
    state.userCategories = state.userCategories.filter(function (c) { return c !== id; });
  }
}

function verifyAadhaar() {
  var aadhaarInput = document.getElementById('inp-aadhaar');
  var aadhaarError = document.getElementById('aadhaar-error');
  if (!aadhaarInput || !aadhaarError) return;

  var val = aadhaarInput.value.replace(/\s/g, '');
  if (!/^\d{12}$/.test(val)) {
    aadhaarError.style.display = 'block';
    return;
  }
  var aadhaarBefore = document.getElementById('aadhaar-before');
  var aadhaarScanning = document.getElementById('aadhaar-scanning');
  var aadhaarDone = document.getElementById('aadhaar-done');
  aadhaarError.style.display = 'none';
  if (aadhaarBefore) aadhaarBefore.style.display = 'none';
  if (aadhaarScanning) aadhaarScanning.style.display = 'block';
  setTimeout(function () {
    if (aadhaarScanning) aadhaarScanning.style.display = 'none';
    if (aadhaarDone) aadhaarDone.style.display = 'block';
    state.aadhaarVerified = true;
  }, 2500);
}

async function completeOnboarding() {
  var shopInput = document.getElementById('inp-shop');
  var shopVal = shopInput ? shopInput.value.trim() : '';
  if (shopVal) state.userShop = shopVal;

  var selectedCategory = state.userCategories && state.userCategories.length ? state.userCategories[0] : null;
  var payload = {
    name: state.userName || 'Aap',
    role: state.userRole || 'buyer',
    locality: state.userLocation || 'Lalghati, Bhopal',
    phone: state.userPhone || '',
    aadhaarVerified: !!state.aadhaarVerified,
    shopName: state.userShop || null,
    category: selectedCategory,
  };

  try {
    var onboardResp = await API.onboard(payload);
    if (onboardResp && !onboardResp.error && onboardResp.id) {
      state.userId = onboardResp.id;
      if (state.userRole === 'seller') state.sellerId = onboardResp.id;
    }
  } catch (e) {
    console.warn('Onboarding backend sync failed, continuing locally:', e);
  }

  saveState();
  document.querySelectorAll('.onboard').forEach(function (o) { o.classList.remove('active'); });
  var mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.style.display = 'flex';
  initMainApp();
}

function skipOnboard() {
  completeOnboarding();
}

function bindOnboardInputs() {
  var nameInput = document.getElementById('inp-name');
  var phoneInput = document.getElementById('inp-phone');
  var locationInput = document.getElementById('inp-location');
  var aadhaarInput = document.getElementById('inp-aadhaar');
  var aadhaarError = document.getElementById('aadhaar-error');

  if (nameInput) {
    nameInput.addEventListener('input', function () {
      state.userName = nameInput.value.trim();
      updateNameBtn();
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      state.userPhone = phoneInput.value.trim();
      updateNameBtn();
    });
  }

  if (locationInput) {
    locationInput.addEventListener('input', function () {
      state.userLocation = locationInput.value.trim();
    });
  }

  if (aadhaarInput) {
    aadhaarInput.addEventListener('input', function () {
      if (aadhaarError) aadhaarError.style.display = 'none';
      var v = this.value.replace(/[^0-9]/g, '').slice(0, 12);
      var f = v.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.value = f;
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindOnboardInputs);
} else {
  bindOnboardInputs();
}

if (typeof window !== 'undefined') {
  window.goOnboard = goOnboard;
  window.selectRole = selectRole;
  window.updateNameBtn = updateNameBtn;
  window.autoDetectLocation = autoDetectLocation;
  window.renderSellerCatChips = renderSellerCatChips;
  window.renderBuyerCatChips = renderBuyerCatChips;
  window.toggleCatChip = toggleCatChip;
  window.verifyAadhaar = verifyAadhaar;
  window.completeOnboarding = completeOnboarding;
  window.skipOnboard = skipOnboard;
}
