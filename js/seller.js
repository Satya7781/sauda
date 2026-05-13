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
  var seller = SELLERS[sellerId];
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
    '<span class="text-[10px] font-bold" style="color:var(--trust)">LIVE</span>' +
    '</div>' +
    '</div>' +
    '<div class="grid grid-cols-3 gap-3">' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-2xl font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">' + totalProducts + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">Listings</p>' +
    '</div>' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-2xl font-extrabold" style="color:var(--trust)">' + todayOrders + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">Aaj Orders</p>' +
    '</div>' +
    '<div class="text-center p-3 rounded-xl" style="background:rgba(255,255,255,0.7)">' +
    '<p class="text-sm font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + totalRevenue + '</p>' +
    '<p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">Revenue</p>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="flex items-center justify-between px-1 mb-2">' +
    '<p class="text-xs font-bold uppercase tracking-wider" style="color:var(--text3)">Meri Listings</p>' +
    '<button class="text-[10px] font-bold px-3 py-1.5 rounded-full" style="background:var(--seller-accent-light);color:var(--seller-accent);border:none;cursor:pointer" onclick="navigateTo(\'voice\')"><i class="fa-solid fa-plus mr-1"></i>Naya Listing</button>' +
    '</div>' +

    '<div class="space-y-2" id="seller-feed">' +
    sellerProds.map(function (p) {
      var cat = CATEGORIES.find(function (c) { return c.id === p.category; });
      return '<div class="s-card flex overflow-hidden">' +
        productImageHTML(p, 80, 100) +
        '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
        '<div>' +
        '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? cat.name : p.category) + '</span>' +
        '<h4 class="text-sm font-bold leading-tight truncate">' + p.title + '</h4>' +
        '<p class="text-[10px] truncate" style="color:var(--text2)">' + p.titleHi + ' — ' + p.unit + '</p>' +
        '</div>' +
        '<div class="flex items-center justify-between mt-2">' +
        '<span class="text-base font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
        '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:var(--trust-light);color:var(--trust)">' + p.stock + ' in stock</span>' +
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
    var cat = CATEGORIES.find(function (c) { return c.id === p.category; });
    return '<div class="s-card flex overflow-hidden">' +
      productImageHTML(p, 80, 100) +
      '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
      '<div>' +
      '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? cat.name : p.category) + '</span>' +
      '<h4 class="text-sm font-bold leading-tight truncate">' + p.title + '</h4>' +
      '<p class="text-[10px] truncate" style="color:var(--text2)">' + p.titleHi + ' — ' + p.unit + '</p>' +
      '</div>' +
      '<div class="flex items-center justify-between mt-2">' +
      '<span class="text-base font-extrabold" style="color:var(--seller-accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
      '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:var(--trust-light);color:var(--trust)">' + p.stock + ' in stock</span>' +
      '</div>' +
      '</div></div>';
  }).join('');
}

function getSellerStats() {
  var sellerProds = getSellerProducts();
  return {
    totalProducts: sellerProds.length,
    todayOrders: Math.floor(Math.random() * 5) + 1,
    totalRevenue: sellerProds.reduce(function (sum, p) { return sum + p.price * Math.min(p.stock, 3); }, 0)
  };
}
