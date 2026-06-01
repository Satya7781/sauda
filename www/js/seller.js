// ============================================================
// SELLER DASHBOARD — Sauda
// ============================================================

function getSellerProducts() {
  var sellerId = state.sellerId || 'neeta';
  return state.productFeed.filter(function (p) {
    return p.seller === sellerId;
  });
}

function renderSellerDashboard() {
  var container = document.getElementById('seller-dashboard-content');
  if (!container) return;

  var sellerId = state.sellerId || 'neeta';
  var seller = getSellerRecord(sellerId);
  var sellerProds = getSellerProducts();
  var totalProducts = sellerProds.length;
  var todayOrders = Math.floor(Math.random() * 5) + 1;
  var totalRevenue = sellerProds.reduce(function (sum, p) { return sum + p.price * Math.min(p.stock, 3); }, 0);

  container.innerHTML =
    '<div class="px-5 pt-2 pb-1">' +
    '<div class="s-card p-4 mb-3" style="background:linear-gradient(135deg,var(--seller-accent-light),#FFF7EA);border-color:rgba(184,104,15,0.2)">' +
    '<div class="flex items-center justify-between mb-3">' +
    '<div>' +
    '<p class="text-lg font-extrabold" style="font-family:\'Space Grotesk\',sans-serif">' + seller.shop + '</p>' +
    '<p class="text-xs" style="color:var(--text2)">' + seller.locality + '</p>' +
    '</div>' +
    '<div class="flex items-center gap-2">' +
    '<div class="pulse-dot" style="width:7px;height:7px"></div>' +
    '<span class="text-[10px] font-bold" style="color:var(--trust)">'+__('live')+'</span>' +
    '</div>' +
    '</div>' +
    '<div class="grid grid-cols-3 gap-3">' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-2xl font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">' + totalProducts + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">'+__('listings_stat')+'</p>' +
    '</div>' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-2xl font-extrabold" style="color:var(--trust)">' + todayOrders + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">'+__('aaj_orders')+'</p>' +
    '</div>' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-sm font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + totalRevenue + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">'+__('revenue')+'</p>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="flex items-center justify-between px-1 mb-2">' +
    '<p class="text-xs font-bold uppercase tracking-wider" style="color:var(--text3)">'+__('meri_listings')+'</p>' +
    '<div class="flex gap-1">' +
    '<button class="text-[10px] font-bold px-3 py-1.5 rounded-full" style="background:var(--seller-accent-light);color:var(--seller-accent);border:none;cursor:pointer" onclick="navigateTo(\'voice\')"><i class="fa-solid fa-microphone mr-1"></i>'+__('voice')+'</button>' +
    '<button class="text-[10px] font-bold px-3 py-1.5 rounded-full" style="background:var(--seller-accent-light);color:var(--seller-accent);border:none;cursor:pointer" onclick="openQuickManualModal()"><i class="fa-solid fa-pen mr-1"></i>'+__('manual')+'</button>' +
    '</div>' +
    '</div>' +

    '<div class="space-y-2" id="seller-feed">' +
    sellerProds.map(function (p) {
      var cat = CATEGORIES.find(function (c) { return c.id === p.category; });
      return '<div class="s-card flex overflow-hidden">' +
        productImageHTML(p, 80, 100) +
        '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
        '<div>' +
        '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? getCategoryName(cat) : p.category) + '</span>' +
        '<h4 class="text-sm font-bold leading-tight truncate">' + getProductTitle(p) + '</h4>' +
        '<p class="text-[10px] truncate" style="color:var(--text2)">' + getProductTitle(p) + ' — ' + p.unit + '</p>' +
        '</div>' +
        '<div class="flex items-center justify-between mt-2">' +
        '<span class="text-base font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
        '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:var(--trust-light);color:var(--trust)">' + p.stock + __('in_stock') + '</span>' +
        '</div>' +
        '</div></div>';
    }).join('') +
    '</div>' +
    '</div>';
}

function renderSellerFeed() {
  var sf = document.getElementById('seller-feed');
  if (!sf) return;

  var sellerProds = getSellerProducts();
  sf.innerHTML = sellerProds.map(function (p) {
    var cat = getCategoryRecord(p.category);
    return '<div class="s-card flex overflow-hidden">' +
      productImageHTML(p, 80, 100) +
      '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
      '<div>' +
      '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + cat.color + '">' + getCategoryName(cat) + '</span>' +
      '<h4 class="text-sm font-bold leading-tight truncate">' + getProductTitle(p) + '</h4>' +
      '<p class="text-[10px] truncate" style="color:var(--text2)">' + getProductTitle(p) + ' — ' + p.unit + '</p>' +
      '</div>' +
      '<div class="flex items-center justify-between mt-2">' +
      '<span class="text-base font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
      '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:var(--trust-light);color:var(--trust)">' + p.stock + __('in_stock') + '</span>' +
      '</div>' +
      '</div></div>';
  }).join('');
}

// ============================================================
// SELLER SEARCH
// ============================================================

document.getElementById('seller-search-input').addEventListener('input', function () {
  var q = this.value.trim().toLowerCase();
  var c = document.getElementById('seller-dashboard-content');
  if (!q) {
    renderSellerDashboard();
    return;
  }
  var cats = c.querySelectorAll('.seller-stat-card, .quick-add-btn, .seller-feed-item');
  if (cats.length) {
    cats.forEach(function (el) {
      var txt = el.textContent.toLowerCase();
      el.style.display = txt.indexOf(q) !== -1 ? '' : 'none';
    });
  } else {
    var items = c.querySelectorAll('.s-card');
    items.forEach(function (el) {
      var txt = el.textContent.toLowerCase();
      el.style.display = txt.indexOf(q) !== -1 ? '' : 'none';
    });
  }
});

// ============================================================
// QUICK ADD (from Seller Dashboard)
// ============================================================

function openQuickManualModal() {
  var modal = document.getElementById('quick-add-modal');
  if (modal) modal.style.display = 'flex';
}

function switchQuickMode(mode) {
  var manualBtn = document.getElementById('quick-manual-btn');
  var voiceBtn = document.getElementById('quick-voice-btn');
  var manualForm = document.getElementById('quick-manual-form');
  var voiceForm = document.getElementById('quick-voice-form');
  
  if (mode === 'manual') {
    manualBtn.style.background = 'var(--accent-light)';
    manualBtn.style.color = 'var(--accent)';
    voiceBtn.style.background = 'var(--bg2)';
    voiceBtn.style.color = 'var(--text2)';
    manualForm.style.display = 'block';
    voiceForm.style.display = 'none';
  } else if (mode === 'voice') {
    manualBtn.style.background = 'var(--bg2)';
    manualBtn.style.color = 'var(--text2)';
    voiceBtn.style.background = 'var(--accent-light)';
    voiceBtn.style.color = 'var(--accent)';
    manualForm.style.display = 'none';
    voiceForm.style.display = 'block';
  }
}

function startQuickVoiceListing() {
  // Simulate voice recording - in production would use Web Speech API
  var result = document.getElementById('quick-voice-result');
  var parsed = document.getElementById('quick-voice-parsed');
  document.getElementById('quick-voice-text').textContent = '"3 kilo aloo, 80 rupee kilo"';
  
  // Pre-fill with parsed values
  document.getElementById('quick-voice-title').value = 'Aloo';
  document.getElementById('quick-voice-title-hi').value = 'आलू';
  document.getElementById('quick-voice-category').value = 'sabzi';
  document.getElementById('quick-voice-price').value = '80';
  document.getElementById('quick-voice-unit').value = 'kg';
  document.getElementById('quick-voice-stock').value = '50';
  
  result.style.display = 'block';
  showToast(__('voice_item_detected'));
}

async function publishQuickVoiceItem() {
  var title = document.getElementById('quick-voice-title').value.trim();
  var titleHi = document.getElementById('quick-voice-title-hi').value.trim();
  var category = document.getElementById('quick-voice-category').value;
  var price = parseInt(document.getElementById('quick-voice-price').value) || 0;
  var unit = document.getElementById('quick-voice-unit').value || 'pcs';
  var stock = parseInt(document.getElementById('quick-voice-stock').value) || 10;

  if (!title || !category || !price) {
    showToast(__('kripya_fill'));
    return;
  }

  var created = await API.createProduct({
    title: title,
    titleEn: title,
    titleHi: titleHi || title,
    price: price,
    unit: unit,
    seller: state.sellerId || 'neeta',
    category: category,
    stock: stock
  });

  if (created && !created.error && created.id) {
    state.productFeed.unshift(created);
    if (state._originalFeed) state._originalFeed.unshift(created);
  } else {
    state.productFeed.unshift({
      id: Date.now(),
      title: title,
      titleEn: title,
      titleHi: titleHi || title,
      price: price,
      unit: unit,
      seller: state.sellerId || 'neeta',
      category: category,
      stock: stock
    });
  }

  showToast(__('item_added_voice'));

  // Clear and close
  document.getElementById('quick-voice-result').style.display = 'none';
  document.getElementById('quick-voice-title').value = '';
  document.getElementById('quick-voice-title-hi').value = '';
  document.getElementById('quick-voice-category').value = '';
  document.getElementById('quick-voice-price').value = '';
  document.getElementById('quick-voice-unit').value = 'pcs';
  document.getElementById('quick-voice-stock').value = '10';

  var modal = document.getElementById('quick-add-modal');
  if (modal) modal.style.display = 'none';

  renderSellerDashboard();
}

async function publishQuickManualItem() {
  var title = document.getElementById('quick-title').value.trim();
  var titleHi = document.getElementById('quick-title-hi').value.trim();
  var category = document.getElementById('quick-category').value;
  var price = parseInt(document.getElementById('quick-price').value) || 0;
  var unit = document.getElementById('quick-unit').value || 'pcs';
  var stock = parseInt(document.getElementById('quick-stock').value) || 10;

  if (!title || !category || !price) {
    showToast(__('kripya_fill'));
    return;
  }

  var created = await API.createProduct({
    title: title,
    titleEn: title,
    titleHi: titleHi || title,
    price: price,
    unit: unit,
    seller: state.sellerId || 'neeta',
    category: category,
    stock: stock
  });

  if (created && !created.error && created.id) {
    state.productFeed.unshift(created);
    if (state._originalFeed) state._originalFeed.unshift(created);
  } else {
    state.productFeed.unshift({
      id: Date.now(),
      title: title,
      titleEn: title,
      titleHi: titleHi || title,
      price: price,
      unit: unit,
      seller: state.sellerId || 'neeta',
      category: category,
      stock: stock
    });
  }

  showToast(__('item_added_manual'));

  // Clear modal
  document.getElementById('quick-title').value = '';
  document.getElementById('quick-title-hi').value = '';
  document.getElementById('quick-category').value = '';
  document.getElementById('quick-price').value = '';
  document.getElementById('quick-unit').value = 'pcs';
  document.getElementById('quick-stock').value = '10';

  // Close modal
  var modal = document.getElementById('quick-add-modal');
  if (modal) modal.style.display = 'none';

  // Refresh dashboard
  renderSellerDashboard();
}

function getSellerStats() {
  var sellerProds = getSellerProducts();
  return {
    totalProducts: sellerProds.length,
    todayOrders: Math.floor(Math.random() * 5) + 1,
    totalRevenue: sellerProds.reduce(function (sum, p) { return sum + p.price * Math.min(p.stock, 3); }, 0)
  };
}
