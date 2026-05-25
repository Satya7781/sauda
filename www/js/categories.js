// ============================================================
// CATEGORIES VIEW — Sauda
// ============================================================

function renderCategoryGrid() {
  var c = document.getElementById('category-grid');
  c.innerHTML = CATEGORIES.map(function (cat) {
    var isSelected = state.selectedCategory === cat.id;
    var itemCount = state.productFeed.filter(function (p) { return p.category === cat.id; }).length || PRODUCTS.filter(function (p) { return p.category === cat.id; }).length;
    return '<div class="s-card p-4 cursor-pointer flex flex-col items-center gap-3" onclick="selectCategory(\'' + cat.id + '\')" style="' + (isSelected ? 'border-color:' + cat.color + ';background:' + cat.bg : '') + '">' +
      '<div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background:' + cat.bg + '"><i class="fa-solid ' + cat.icon + ' text-xl" style="color:' + cat.color + '"></i></div>' +
      '<div class="text-center"><p class="text-xs font-bold">' + getCategoryName(cat) + '</p></div>' +
      '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background:' + cat.bg + ';color:' + cat.color + '">' + itemCount + __('items_label') + '</span>' +
      '</div>';
  }).join('');
}

function selectCategory(catId) {
  state.selectedCategory = catId;
  var cat = CATEGORIES.find(function (c) { return c.id === catId; });
  var prods = PRODUCTS.filter(function (p) { return p.category === catId; });
  var sellerIds = [];
  prods.forEach(function (p) {
    if (sellerIds.indexOf(p.seller) === -1) sellerIds.push(p.seller);
  });
  var sellersCount = sellerIds.length;

  var cp = document.getElementById('category-products');
  cp.innerHTML =
    '<div class="mt-2 mb-3">' +
    '<div class="flex items-center gap-3 mb-3">' +
    '<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:' + cat.bg + '"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i></div>' +
    '<div><h3 class="text-base font-bold">' + getCategoryName(cat) + '</h3><p class="text-[10px]" style="color:var(--text3)">' + sellersCount + __('sellers_count') + prods.length + __('products_count') + '</p></div>' +
    '</div></div>' +
    prods.map(function (p) {
      var s = SELLERS[p.seller];
      var v = USERS[s.vouchedBy];
      return '<div class="s-card flex overflow-hidden mb-2 cursor-pointer" onclick="openProductDetail(' + p.id + ')">' +
        productImageHTML(p, 80, 100) +
        '<div class="flex-1 p-3 flex flex-col justify-between">' +
        '<div><h4 class="text-sm font-bold truncate">' + getProductTitle(p) + '</h4><p class="text-[10px]" style="color:var(--text2)">' + (state.userLang === 'hi' ? p.titleEn || '' : p.titleHi || '') + ' — ' + p.unit + '</p></div>' +
        '<div class="flex items-center justify-between mt-1.5">' +
        '<span class="text-sm font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
        '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-user-check text-[7px]"></i>' + v.name.split(' ')[0] + '</div>' +
        '</div></div></div>';
    }).join('');
  renderCategoryGrid();
}
