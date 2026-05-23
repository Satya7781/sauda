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
    var locVal = document.getElementById('inp-location').value.trim();
    if (locVal) state.userLocation = locVal;

    if (state.userRole === 'seller') {
      document.getElementById('onboard-4a').classList.add('active');
      document.getElementById('onboard-4b').classList.remove('active');
      renderSellerCatChips();
    } else {
      document.getElementById('onboard-4b').classList.add('active');
      document.getElementById('onboard-4a').classList.remove('active');
      renderBuyerCatChips();
    }
  }
  if (step === 2) updateNameBtn();
  if (step === 6) document.getElementById('welcome-name').textContent = state.userName || __('friend');
}

function selectRole(role, el) {
  state.userRole = role;
  document.querySelectorAll('.role-card').forEach(function (c) { c.classList.remove('selected'); });
  el.classList.add('selected');
  document.getElementById('role-next-btn').disabled = false;
}

function updateNameBtn() {
  var n = document.getElementById('inp-name').value.trim();
  var p = document.getElementById('inp-phone').value.trim();
  document.getElementById('name-next-btn').disabled = !(n.length >= 2 && p.length >= 8);
}

function autoDetectLocation() {
  var el = document.getElementById('location-detected');
  el.style.display = 'flex';
  el.style.background = 'var(--trust-light)';
  el.style.border = '1px solid rgba(13,148,136,0.15)';
  el.style.borderRadius = '12px';
    document.getElementById('location-text').textContent = 'Lalghati, Bhopal — Detected';
    state.userLocation = 'Lalghati, Bhopal';
    document.getElementById('inp-location').value = 'Lalghati, Bhopal';
}

function renderSellerCatChips() {
  var c = document.getElementById('seller-cat-chips');
  if (!c) return;
  
  // Ensure categories are loaded
  if (!state.categories || state.categories.length === 0) {
    state.categories = CATEGORIES || [];
  }
  
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="cat-chip" onclick="toggleCatChip(this,\'' + cat.id + '\')"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i>' + cat.name + '</div>';
  }).join('');
}

function renderBuyerCatChips() {
  var c = document.getElementById('buyer-cat-chips');
  if (!c) return;
  
  // Ensure categories are loaded
  if (!state.categories || state.categories.length === 0) {
    state.categories = CATEGORIES || [];
  }
  
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="cat-chip" onclick="toggleCatChip(this,\'' + cat.id + '\')"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i>' + cat.name + '</div>';
  }).join('');
}

function toggleCatChip(el, id) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (state.userCategories.indexOf(id) === -1) state.userCategories.push(id);
  } else {
    state.userCategories = state.userCategories.filter(function (c) { return c !== id; });
  }
}

function verifyAadhaar() {
  document.getElementById('aadhaar-before').style.display = 'none';
  document.getElementById('aadhaar-scanning').style.display = 'block';
  setTimeout(function () {
    document.getElementById('aadhaar-scanning').style.display = 'none';
    document.getElementById('aadhaar-done').style.display = 'block';
    state.aadhaarVerified = true;
  }, 2500);
}

function completeOnboarding() {
  var shopVal = document.getElementById('inp-shop').value.trim();
  if (shopVal) state.userShop = shopVal;
  saveState();
  document.querySelectorAll('.onboard').forEach(function (o) { o.classList.remove('active'); });
  document.getElementById('main-app').style.display = 'flex';
  initMainApp();
}

function skipOnboard() {
  completeOnboarding();
}

document.getElementById('inp-name').addEventListener('input', function () {
  state.userName = document.getElementById('inp-name').value.trim();
  updateNameBtn();
});
document.getElementById('inp-phone').addEventListener('input', function () {
  state.userPhone = document.getElementById('inp-phone').value.trim();
  updateNameBtn();
});
document.getElementById('inp-location').addEventListener('input', function () {
  state.userLocation = document.getElementById('inp-location').value.trim();
});
