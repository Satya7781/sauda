function renderProfile() {
  var name = state.userName || 'Aap';
  var role = state.userRole || 'buyer';
  var aadhaar = state.aadhaarVerified;
  var phone = state.userPhone || '';

  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-location').textContent = state.userLocation || 'Lalghati, Bhopal';
  document.getElementById('profile-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profile-role').textContent = role === 'seller' ? __('seller') + ' ' + __('live') : __('buyer') + ' ' + __('active');
  document.getElementById('profile-role-label').textContent = role === 'seller' ? __('seller') : __('buyer');
  document.getElementById('profile-connections').textContent = '5 ' + __('trusted_connections');

  if (phone) {
    var pb = document.getElementById('profile-phone-badge');
    pb.textContent = '+91 ' + phone;
    pb.style.display = 'inline-flex';
    document.getElementById('profile-phone-display').textContent = '+91 ' + phone;
  } else {
    document.getElementById('profile-phone-badge').style.display = 'none';
    document.getElementById('profile-phone-display').textContent = __('phone_number_display');
  }

  document.getElementById('profile-orders-count').textContent = (state.orders || []).length;
  document.getElementById('profile-listings-count').textContent = role === 'seller' ? getSellerProducts().length : '0';
  document.getElementById('profile-saved-count').textContent = (state.savedSellers || []).length;

  // Badges
  var badges = [];
  if (aadhaar) badges.push('<div class="vouch-tag text-[9px]"><i class="fa-solid fa-shield-halved text-[7px]"></i>'+__('aadhaar_tag')+'</div>');
  badges.push('<div class="vouch-tag text-[9px]"><i class="fa-solid fa-people-group text-[7px]"></i>5 ' + __('vouches_count') +'</div>');
  if (role === 'seller') badges.push('<div class="vouch-tag text-[9px]" style="background:var(--seller-accent-light);color:var(--seller-accent)"><i class="fa-solid fa-store text-[7px]"></i>'+__('seller')+'</div>');
  document.getElementById('profile-badges').innerHTML = badges.join('');

  document.getElementById('aadhaar-status-icon').className = aadhaar ? 'fa-solid fa-check-circle' : 'fa-solid fa-circle-xmark';
  document.getElementById('aadhaar-status-icon').style.color = aadhaar ? 'var(--trust)' : 'var(--text3)';
}

function openEditProfileModal() {
  document.getElementById('edit-name').value = state.userName || '';
  document.getElementById('edit-phone').value = state.userPhone || '';
  document.getElementById('edit-location').value = state.userLocation || '';
  document.getElementById('edit-profile-modal').classList.add('show');
  updateEditRoleUI();
  updateEditAadhaarUI();
}

function closeEditProfileModal() {
  document.getElementById('edit-profile-modal').classList.remove('show');
}

function selectEditRole(role) {
  state.editRole = role;
  updateEditRoleUI();
}

function updateEditRoleUI() {
  var r = state.editRole || state.userRole || 'buyer';
  document.getElementById('role-option-buyer').classList.toggle('selected', r === 'buyer');
  document.getElementById('role-option-seller').classList.toggle('selected', r === 'seller');
}

function toggleEditAadhaar() {
  state.editAadhaar = !(state.editAadhaar ?? state.aadhaarVerified);
  updateEditAadhaarUI();
}

function updateEditAadhaarUI() {
  var val = state.editAadhaar ?? state.aadhaarVerified;
  var toggle = document.getElementById('aadhaar-toggle');
  toggle.classList.toggle('on', val);
  document.getElementById('aadhaar-toggle-label').textContent = val ? __('yes_label') : __('no_label');
}

function saveProfileChanges() {
  var name = document.getElementById('edit-name').value.trim();
  var phone = document.getElementById('edit-phone').value.trim();
  var location = document.getElementById('edit-location').value.trim();
  var role = state.editRole || state.userRole || 'buyer';
  var aadhaar = state.editAadhaar ?? state.aadhaarVerified;

  if (!name) { showToast(__('name_required')); return; }

  state.userName = name;
  state.userPhone = phone;
  state.userLocation = location || state.userLocation;
  state.userRole = role;
  state.aadhaarVerified = aadhaar;

  // Update role across the app
  document.documentElement.setAttribute('data-role', role);
  document.getElementById('app').setAttribute('data-role', role);
  updateNavForRole();

  // Update desktop greeting
  if (role === 'seller') {
    var sellerObj = SELLERS[state.sellerId || 'neeta'];
    document.getElementById('feed-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : '');
    document.getElementById('dashboard-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : '');
  } else {
    document.getElementById('feed-greeting').textContent = __('namaste');
  }

  // Update desktop avatar/name
  document.getElementById('feed-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-avatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('desktop-name').textContent = name;

  saveState();
  renderProfile();
  renderFeed();
  if (role === 'seller') renderSellerDashboard();

  // Navigate to appropriate view
  if (role === 'seller') {
    document.getElementById('view-feed').classList.remove('active');
    document.getElementById('view-seller-dashboard').classList.add('active');
    state.currentView = 'seller-dashboard';
  }

  closeEditProfileModal();
  showToast(__('profile_updated'));
}

function switchRole() {
  state.userRole = state.userRole === 'seller' ? 'buyer' : 'seller';
  document.documentElement.setAttribute('data-role', state.userRole);
  document.getElementById('app').setAttribute('data-role', state.userRole);
  updateNavForRole();

  if (state.userRole === 'seller') {
    var sellerObj = SELLERS[state.sellerId || 'neeta'];
    document.getElementById('feed-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : '');
    document.getElementById('dashboard-greeting').textContent = __('namaste') + ', ' + (sellerObj ? sellerObj.name.split(' ')[0] : '');
    document.getElementById('view-feed').classList.remove('active');
    document.getElementById('view-seller-dashboard').classList.add('active');
    state.currentView = 'seller-dashboard';
  } else {
    document.getElementById('feed-greeting').textContent = __('namaste');
    document.getElementById('view-seller-dashboard').classList.remove('active');
    document.getElementById('view-feed').classList.add('active');
    state.currentView = 'feed';
  }

  saveState();
  renderProfile();
  renderFeed();
  if (state.userRole === 'seller') renderSellerDashboard();
  showToast(__('role_changed_to') + ' ' + (state.userRole === 'seller' ? __('seller') : __('buyer')));
}

document.getElementById('edit-profile-modal').addEventListener('click', function (e) {
  if (e.target.id === 'edit-profile-modal') closeEditProfileModal();
});
