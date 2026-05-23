// ============================================================
// UTILITIES — Sauda
// ============================================================

function getCategoryVisual(catId) {
  var cat = CATEGORIES.find(function (c) { return c.id === catId; });
  if (!cat) cat = CATEGORIES[0];
  return { icon: cat.icon, color: cat.color, bg: cat.bg, name: cat.name };
}

function productImageHTML(item, width, height) {
  var v = getCategoryVisual(item.category);
  var initials = (item.title || '').split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
  var size = width || 100;
  var h = height || size;
  var imgFile = PRODUCT_IMAGES[item.id];
  if (imgFile) {
    return '<div class="product-img" style="width:' + size + 'px;min-height:' + h + 'px;flex-shrink:0;position:relative;overflow:hidden;background:' + v.bg + '">' +
      '<img src="images/' + imgFile + '" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div style="display:none;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;background:' + v.bg + '">' +
      '<i class="fa-solid ' + v.icon + '" style="font-size:' + Math.round(size * 0.28) + 'px;color:' + v.color + ';opacity:0.7"></i>' +
      '<span style="font-size:' + Math.round(size * 0.14) + 'px;font-weight:800;color:' + v.color + ';opacity:0.5;font-family:\'Space Grotesk\',sans-serif;letter-spacing:0.5px">' + initials + '</span>' +
      '</div></div>';
  }
  return '<div class="product-img" style="width:' + size + 'px;min-height:' + h + 'px;background:' + v.bg + ';display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;position:relative;overflow:hidden">' +
    '<i class="fa-solid ' + v.icon + '" style="font-size:' + Math.round(size * 0.28) + 'px;color:' + v.color + ';opacity:0.7;position:absolute;top:50%;left:50%;transform:translate(-50%,-60%)"></i>' +
    '<span style="font-size:' + Math.round(size * 0.14) + 'px;font-weight:800;color:' + v.color + ';opacity:0.5;position:absolute;bottom:8px;font-family:\'Space Grotesk\',sans-serif;letter-spacing:0.5px">' + initials + '</span>' +
    '</div>';
}

function productImageHTMLSmall(item) {
  var v = getCategoryVisual(item.category);
  var imgFile = PRODUCT_IMAGES[item.id];
  if (imgFile) {
    return '<div class="product-img-sm" style="width:40px;height:40px;border-radius:10px;overflow:hidden;flex-shrink:0">' +
      '<img src="images/' + imgFile + '" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:' + v.bg + '">' +
      '<i class="fa-solid ' + v.icon + '" style="font-size:16px;color:' + v.color + ';opacity:0.8"></i></div></div>';
  }
  return '<div class="product-img-sm" style="width:40px;height:40px;border-radius:10px;background:' + v.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
    '<i class="fa-solid ' + v.icon + '" style="font-size:16px;color:' + v.color + ';opacity:0.8"></i>' +
    '</div>';
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function showToast(msg, dur) {
  dur = dur || 2500;
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, dur);
}

function toggleSaveSeller(sid) {
  if (!state.savedSellers) state.savedSellers = [];
  var idx = state.savedSellers.indexOf(sid);
  if (idx === -1) {
    state.savedSellers.push(sid);
    showToast(SELLERS[sid].shop + __('saved_tost'));
  } else {
    state.savedSellers.splice(idx, 1);
    showToast(SELLERS[sid].shop + __('removed_saved_tost'));
  }
}

function addNotification(msg, type) {
  if (!state.notifications) state.notifications = [];
  state.notifications.unshift({ msg: msg, type: type || 'info', time: Date.now() });
  updateNotificationBadge();
}

function updateNotificationBadge() {
  var badge = document.getElementById('notif-badge');
  if (badge) {
    var count = state.notifications ? state.notifications.length : 0;
    badge.style.display = count > 0 ? 'block' : 'none';
    badge.textContent = count > 9 ? '9+' : count;
  }
}

function addOrder(product, seller) {
  if (!state.orders) state.orders = [];
  state.orders.unshift({
    id: Date.now(),
    productId: product.id,
    title: product.title,
    titleHi: product.titleHi,
    price: product.price,
    unit: product.unit,
    sellerId: seller.id,
    sellerName: seller.shop,
    status: 'confirmed',
    time: Date.now()
  });
  addNotification(__('sauda_pakka') + ' ' + product.title + ' — ' + seller.shop, 'order');
}

function openNotifications() {
  var notifs = state.notifications || [];
  var sheet = document.getElementById('notif-sheet');
  var items = notifs.length ? notifs.map(function (n) {
    var icon = n.type === 'order' ? 'fa-bag-shopping' : 'fa-bell';
    var color = n.type === 'order' ? 'var(--trust)' : 'var(--accent)';
    var ago = timeAgo(n.time);
    return '<div class="s-card p-3 flex items-center gap-3 mb-2">' +
      '<div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:' + (n.type === 'order' ? 'var(--trust-light)' : 'var(--accent-light)') + '"><i class="fa-solid ' + icon + ' text-sm" style="color:' + color + '"></i></div>' +
      '<div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">' + n.msg + '</p><p class="text-[10px]" style="color:var(--text3)">' + ago + '</p></div></div>';
  }).join('') : '<div class="text-center py-10"><i class="fa-regular fa-bell text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">'+__('koi_notification_nahi')+'</p></div>';

  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">'+__('notifications')+'</h3>' +
    '<button onclick="closeNotifModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' + items + '</div>';

  document.getElementById('notif-modal').classList.add('show');
}

function closeNotifModal() {
  document.getElementById('notif-modal').classList.remove('show');
}

function timeAgo(ts) {
  var diff = Date.now() - ts;
  if (diff < 60000) return __('abhi');
  if (diff < 3600000) return Math.floor(diff / 60000) + __('min_pehle');
  if (diff < 86400000) return Math.floor(diff / 3600000) + __('ghante_pehle');
  return Math.floor(diff / 86400000) + __('din_pehle');
}

document.getElementById('notif-modal').addEventListener('click', function (e) {
  if (e.target.id === 'notif-modal') closeNotifModal();
});

function openOrderHistory() {
  var orders = state.orders || [];
  var sheet = document.getElementById('order-sheet');
  var items = orders.length ? orders.map(function (o) {
    var cat = CATEGORIES.find(function (c) { return c.id === PRODUCTS.find(function (p) { return p.id === o.productId; }); });
    var prod = PRODUCTS.find(function (p) { return p.id === o.productId; }) || o;
    var catObj = prod ? CATEGORIES.find(function (c) { return c.id === prod.category; }) : null;
    var statusColor = o.status === 'confirmed' ? 'var(--trust)' : o.status === 'delivered' ? '#0D9488' : 'var(--accent)';
    var statusBg = o.status === 'confirmed' ? 'var(--trust-light)' : o.status === 'delivered' ? '#ECFDF5' : 'var(--accent-light)';
    var ago = timeAgo(o.time);
    return '<div class="s-card p-3 flex items-center gap-3 mb-2">' +
      (catObj ? '<div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:' + catObj.bg + '"><i class="fa-solid ' + catObj.icon + '" style="color:' + catObj.color + ';font-size:14px"></i></div>' : '<div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background:var(--bg2)"><i class="fa-solid fa-bag-shopping" style="color:var(--text3);font-size:14px"></i></div>') +
      '<div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">' + o.title + '</p><p class="text-[10px]" style="color:var(--text3)">' + o.sellerName + ' — ' + ago + '</p></div>' +
      '<div class="text-right flex-shrink-0"><p class="text-sm font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + o.price + '</p>' +
      '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded" style="background:' + statusBg + ';color:' + statusColor + '">'+__('confirmed')+'</span></div></div>';
  }).join('') : '<div class="text-center py-10"><i class="fa-solid fa-bag-shopping text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">'+__('koi_order_nahi')+'</p><p class="text-xs mt-1" style="color:var(--text3)">'+__('pehla_sauda')+'</p></div>';

  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">'+__('my_orders')+'</h3><p class="text-[10px]" style="color:var(--text3)">' + orders.length + __('items_label')+'</p></div>' +
    '<button onclick="closeOrderModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' + items + '</div>';

  document.getElementById('order-modal').classList.add('show');
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.remove('show');
}

function openSavedSellers() {
  var saved = state.savedSellers || [];
  var sheet = document.getElementById('saved-sheet');
  var items = saved.length ? saved.map(function (sid) {
    var s = SELLERS[sid];
    if (!s) return '';
    var v = USERS[s.vouchedBy];
    var ts = Math.min(95, 30 + (s.aadhaarVerified ? 15 : 0) + s.yearsActive * 3 + s.trustedNeighbors * 1.2);
    return '<div class="s-card p-3 flex items-center gap-3 mb-2 cursor-pointer" onclick="closeSavedModal();setTimeout(function(){openSellerModal(\'' + sid + '\')},200)">' +
      '<div class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" style="background:' + s.color + '15;color:' + s.color + '">' + s.initials + '</div>' +
      '<div class="flex-1 min-w-0"><p class="text-sm font-bold truncate">' + s.shop + '</p><p class="text-[10px]" style="color:var(--text2)">' + s.name + ' — ' + s.distance + '</p></div>' +
      '<div class="text-right"><div class="trust-ring" style="width:36px;height:36px"><svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" fill="none" stroke="#EDE5D5" stroke-width="3"/><circle cx="18" cy="18" r="14" fill="none" stroke="var(--trust)" stroke-width="3" stroke-dasharray="' + (2 * Math.PI * 14) + '" stroke-dashoffset="' + (2 * Math.PI * 14 * (1 - ts / 100)) + '" stroke-linecap="round"/></svg><div class="score" style="font-size:9px">' + Math.round(ts) + '</div></div></div></div>';
  }).join('') : '<div class="text-center py-10"><i class="fa-regular fa-heart text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">'+__('koi_seller_nahi')+'</p><p class="text-xs mt-1" style="color:var(--text3)">'+__('heart_icon_hint')+'</p></div>';

  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">'+__('saved_sellers')+'</h3><p class="text-[10px]" style="color:var(--text3)">' + saved.length + __('saved_tost')+'</p></div>' +
    '<button onclick="closeSavedModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' + items + '</div>';

  document.getElementById('saved-modal').classList.add('show');
}

function closeSavedModal() {
  document.getElementById('saved-modal').classList.remove('show');
}

document.getElementById('order-modal').addEventListener('click', function (e) {
  if (e.target.id === 'order-modal') closeOrderModal();
});

document.getElementById('saved-modal').addEventListener('click', function (e) {
  if (e.target.id === 'saved-modal') closeSavedModal();
});
