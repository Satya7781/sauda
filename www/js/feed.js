function renderCategoryCards() {
  var c = document.getElementById('category-cards');
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="category-card" onclick="navigateTo(\'categories\');selectCategory(\'' + cat.id + '\')">' +
      '<div class="cat-icon" style="background:' + cat.bg + '"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i></div>' +
      '<span class="text-[11px] font-bold">' + getCategoryName(cat) + '</span></div>';
  }).join('');
}

function getUniqueLocalities() {
  var locs = {};
  SELLER_DIRECTORY.forEach(function (d) {
    locs[d.locality] = true;
  });
  return Object.keys(locs).sort();
}

var feedListenersSetup = false;

function setupFeedEventListeners() {
  if (feedListenersSetup) return;
  feedListenersSetup = true;

  document.addEventListener('click', function (e) {
    var locationChip = e.target.closest('.location-chip');
    if (locationChip) {
      var container = document.getElementById('location-chips');
      if (!container) return;
      state.activeLocation = locationChip.dataset.location;
      container.querySelectorAll('.location-chip').forEach(function (x) {
        x.classList.toggle('active', x === locationChip);
      });
      // Re-trigger search if there's an active search query
      var searchInput = document.getElementById('search-input');
      if (searchInput && searchInput.value.trim()) {
        searchInput.dispatchEvent(new Event('input'));
      } else {
        renderFeed();
      }
      return;
    }

    var filterChip = e.target.closest('.filter-chip');
    if (filterChip) {
      var container2 = document.getElementById('filter-chips');
      if (!container2) return;
      state.activeFilter = filterChip.dataset.filter;
      container2.querySelectorAll('.filter-chip').forEach(function (x) {
        x.classList.toggle('active', x === filterChip);
      });
      // Re-trigger search if there's an active search query
      var searchInput = document.getElementById('search-input');
      if (searchInput && searchInput.value.trim()) {
        searchInput.dispatchEvent(new Event('input'));
      } else {
        renderFeed();
      }
      return;
    }
  });
}

function renderLocationChips() {
  var c = document.getElementById('location-chips');
  if (!c) return;
  setupFeedEventListeners();
  var locs = getUniqueLocalities();
  c.innerHTML = '<button class="location-chip active" data-location="all">'+__('sabhi_kshetra')+'</button>' +
    locs.map(function (loc) {
      var count = SELLER_DIRECTORY.filter(function (d) { return d.locality === loc; }).length;
      return '<button class="location-chip" data-location="' + loc + '">' + loc.replace(',', '') + ' <span class="text-[9px] opacity-60">(' + count + ')</span></button>';
    }).join('');
}

function renderFilterChips() {
  var c = document.getElementById('filter-chips');
  if (!c) return;
  setupFeedEventListeners();
  var cats = state.categories.length ? state.categories : (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []);
  c.innerHTML = '<button class="filter-chip active" data-filter="all">'+__('sabhi')+'</button>' +
    cats.map(function (cat) {
      var count = state.productFeed.filter(function (p) { return p.category === cat.id; }).length;
      return '<button class="filter-chip" data-filter="' + cat.id + '" style="color:' + cat.color + '">' +
        '<i class="fa-solid ' + cat.icon + ' mr-1.5" style="font-size:10px"></i>' +
        getCategoryName(cat) +
        (count ? ' <span class="text-[9px] opacity-60">(' + count + ')</span>' : '') +
        '</button>';
    }).join('');
}

// Category → keyword mapping for search parsing
var SEARCH_CATEGORY_KEYWORDS = {
  clothes: ['kapde', 'clothes', 'cloth', 'garment', 'saree', 'kurta', 'dress', 'fashion', 'kapda', 'kapde'],
  sabzi: ['sabzi', 'sabji', 'vegetable', 'veg', 'sabziyan', 'tarkari'],
  dairy: ['dairy', 'doodh', 'milk', 'dahi', 'yogurt', 'paneer', 'cheese'],
  fruit: ['fruit', 'phal', 'fruit', 'aam', 'mango', 'kela', 'banana', 'phal'],
  kirana: ['kirana', 'grocery', 'general', 'ration', 'atta', 'chini', 'groceries', 'kirane'],
  electronics: ['electronics', 'mobile', 'phone', 'earphone', 'charger', 'electronic'],
  beauty: ['beauty', 'salon', 'parlour', 'mehendi', 'facial', 'makeup', 'beauty'],
  services: ['services', 'repair', 'plumber', 'plumbing', 'maid', 'cook', 'service', 'seva'],
};

function matchCategoryFromQuery(q) {
  for (var catId in SEARCH_CATEGORY_KEYWORDS) {
    var words = SEARCH_CATEGORY_KEYWORDS[catId];
    for (var w = 0; w < words.length; w++) {
      if (q.indexOf(words[w]) !== -1) return catId;
    }
  }
  return null;
}

function matchLocalityFromQuery(q) {
  var locs = getUniqueLocalities();
  for (var l = 0; l < locs.length; l++) {
    var locParts = locs[l].toLowerCase().split(/[,\s]+/);
    for (var p = 0; p < locParts.length; p++) {
      if (locParts[p].length > 2 && q.indexOf(locParts[p]) !== -1) return locs[l];
    }
  }
  return null;
}

function renderDirectoryCard(entry) {
  var cat = getCategoryRecord(entry.category);
  var osmBadge = '';

  if (entry.osmUrl) {
    osmBadge = '<a href="' + entry.osmUrl + '" target="_blank" rel="noopener" class="text-[8px] font-bold" style="color:#7CB342" onclick="event.stopPropagation()"><i class="fa-solid fa-map"></i> OSM</a>';
  }

  return '<div class="s-card flex overflow-hidden feed-card opacity-75" style="animation-delay:0s;border:1px dashed var(--card-border)" role="button" tabindex="0">' +
    '<div style="width:100px;height:120px;flex-shrink:0;background:var(--bg2);display:flex;align-items:center;justify-content:center">' +
    '<i class="fa-solid ' + (cat ? cat.icon : 'fa-store') + '" style="font-size:28px;color:' + (cat ? cat.color : 'var(--text3)') + ';opacity:0.5"></i>' +
    '</div>' +
    '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
    '<div>' +
    '<div class="flex items-center justify-between mb-1">' +
    '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? getCategoryName(cat) : entry.category) + '</span>' +
    (osmBadge ? '<span>' + osmBadge + '</span>' : '<span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style="background:var(--bg2);color:var(--text3)">'+__('not_registered_tag')+'</span>') +
    '</div>' +
    '<h4 class="text-sm font-bold leading-tight truncate">' + entry.shop + '</h4>' +
    '<p class="text-[10px] truncate" style="color:var(--text2)">' + (entry.address || entry.locality) + '</p>' +
    '</div>' +
    '<div class="flex items-center justify-between mt-1">' +
    '<span class="text-[9px] font-medium" style="color:var(--text3)">'+__('not_listed_yet')+'</span>' +
    '<div class="loc-tag text-[8px]"><i class="fa-solid fa-location-dot"></i>' + entry.locality + '</div>' +
    '</div></div></div>';
}

function renderFeed() {
  var container = document.getElementById('product-feed');
  var query = (document.getElementById('search-input') && document.getElementById('search-input').value.toLowerCase().trim()) || '';
  var isSearching = !!query;

  // If searching, use search results (already set by setupFeedSearch)
  if (isSearching) {
    var results = state._searchResults || { products: [], directory: [] };

    if (!results.products.length && !results.directory.length) {
      container.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-box-open text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">'+__('koi_listing_nahi')+'</p></div>';
      return;
    }

    var html = [];

    // Show matched products (registered sellers with items)
    if (results.products.length) {
      var i = 0;
      results.products.forEach(function (p) {
        var seller = getSellerRecord(p.seller);
        var voucher = getUserRecord(seller.vouchedBy);
        var cat = getCategoryRecord(p.category);
        html.push('<div class="s-card flex overflow-hidden cursor-pointer feed-card" onclick="openProductDetail(' + p.id + ')" role="button" tabindex="0" style="animation-delay:' + (i * 0.06) + 's">' +
          productImageHTML(p, 100, 120) +
          '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
          '<div>' +
          '<div class="flex items-center justify-between mb-1">' +
      '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? getCategoryName(cat) : p.category) + '</span>' +
          (seller.isLive ? '<div class="flex items-center gap-1"><div class="pulse-dot" style="width:5px;height:5px"></div><span class="text-[9px] font-bold" style="color:var(--trust)">'+__('live')+'</span></div>' : '') +
          '</div>' +
          '<h4 class="text-sm font-bold leading-tight truncate">' + getProductTitle(p) + '</h4>' +
      '<p class="text-[10px] truncate" style="color:var(--text2)">' + (state.userLang === 'en' ? p.titleHi || '' : p.titleEn || '') + ' — ' + p.unit + ' — ' + seller.distance + '</p>' +
          '</div>' +
          '<div class="flex items-center justify-between mt-2">' +
          '<span class="text-base font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
          '<div class="flex items-center gap-1">' +
          '<div class="vouch-tag"><i class="fa-solid fa-user-check text-[8px]"></i>' + voucher.name.split(' ')[0] + '</div>' +
          '<div class="loc-tag text-[8px]"><i class="fa-solid fa-location-dot"></i>' + seller.locality + '</div>' +
          '</div>' +
          '</div></div></div>');
        i++;
      });
    }

    // Show directory entries (unregistered shops matching the search)
    if (results.directory.length) {
      if (results.products.length) {
        html.push('<div class="mt-4 mb-2"><p class="text-[10px] font-bold uppercase tracking-wider" style="color:var(--text3)">'+__('more_shops_in_area')+'</p></div>');
      }
      results.directory.forEach(function (entry) {
        html.push(renderDirectoryCard(entry));
      });
    }

    container.innerHTML = html.join('');
    return;
  }

  // ── Normal (non-search) feed ──
  var filtered = state.productFeed;

  if (state.activeFilter !== 'all') {
    filtered = filtered.filter(function (p) { return p.category === state.activeFilter; });
  }

  if (state.activeLocation && state.activeLocation !== 'all') {
    filtered = filtered.filter(function (p) { return getSellerRecord(p.seller).locality === state.activeLocation; });
  }

  if (!filtered.length) {
    container.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-box-open text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">'+__('koi_listing_nahi')+'</p></div>';
    return;
  }

  container.innerHTML = filtered.map(function (p, i) {
    var seller = getSellerRecord(p.seller);
    var voucher = getUserRecord(seller.vouchedBy);
    var cat = getCategoryRecord(p.category);

    return '<div class="s-card flex overflow-hidden cursor-pointer feed-card" onclick="openProductDetail(' + p.id + ')" role="button" tabindex="0" style="animation-delay:' + (i * 0.06) + 's">' +
      productImageHTML(p, 100, 120) +
      '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
      '<div>' +
      '<div class="flex items-center justify-between mb-1">' +
      '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? getCategoryName(cat) : p.category) + '</span>' +
      (seller.isLive ? '<div class="flex items-center gap-1"><div class="pulse-dot" style="width:5px;height:5px"></div><span class="text-[9px] font-bold" style="color:var(--trust)">'+__('live')+'</span></div>' : '') +
      '</div>' +
      '<h4 class="text-sm font-bold leading-tight truncate">' + getProductTitle(p) + '</h4>' +
      '<p class="text-[10px] truncate" style="color:var(--text2)">' + (state.userLang === 'en' ? p.titleHi || '' : p.titleEn || '') + ' — ' + p.unit + ' — ' + seller.distance + '</p>' +
      '</div>' +
      '<div class="flex items-center justify-between mt-2">' +
      '<span class="text-base font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
      '<div class="flex items-center gap-1">' +
      '<div class="vouch-tag"><i class="fa-solid fa-user-check text-[8px]"></i>' + voucher.name.split(' ')[0] + '</div>' +
      '<div class="loc-tag text-[8px]"><i class="fa-solid fa-location-dot"></i>' + seller.locality + '</div>' +
      '</div>' +
      '</div></div></div>';
  }).join('');
}

function openGroupDeal() {
  var joined = state.groupDealJoined || false;
  var sheet = document.getElementById('group-deal-sheet');
  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">'+__('group_deal')+'</h3><p class="text-[10px]" style="color:var(--text3)">'+__('group_deal_sub')+'</p></div>' +
    '<button onclick="closeGroupDealModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' +
    '<div class="s-card p-4 mb-4 flex items-center gap-3">' +
    '<div class="product-img" style="width:56px;height:56px;border-radius:14px;overflow:hidden;flex-shrink:0;background:#FFF1F2">' +
    (PRODUCT_IMAGES[11] ? '<img src="images/' + PRODUCT_IMAGES[11] + '" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy">' : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center"><i class="fa-solid fa-shirt" style="font-size:24px;color:#BE123C;opacity:0.7"></i></div>') +
    '</div>' +
    '<div class="flex-1 min-w-0"><p class="text-sm font-bold truncate">Banarasi Silk Saree</p><p class="text-[10px]" style="color:var(--text2)">Laxmi Saree Center — 250m</p>' +
    '<div class="flex items-center gap-2 mt-1"><span class="text-sm font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹2,000</span><span class="text-xs line-through" style="color:var(--text3)">₹2,500</span><span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background:#FEF3C7;color:#92400E">20% OFF</span></div></div></div>' +
    '<p class="text-[10px] font-extrabold uppercase tracking-wider mb-3" style="color:var(--text3)">JOINED — ' + (joined ? '3' : '2') + '/3</p>' +
    '<div class="space-y-2 mb-4">' +
    '<div class="s-card p-3 flex items-center gap-3">' +
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:#EC4899;color:#fff">PS</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">Priya Sharma</p><p class="text-[10px]" style="color:var(--text3)">Padosan — 5 saal</p></div>' +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-check text-[7px]"></i>Joined</div></div>' +
    '<div class="s-card p-3 flex items-center gap-3">' +
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:#3B82F6;color:#fff">AV</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">Amit Verma</p><p class="text-[10px]" style="color:var(--text3)">Colleague — 3 saal</p></div>' +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-check text-[7px]"></i>Joined</div></div>' +
    (joined ? '<div class="s-card p-3 flex items-center gap-3">' +
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:var(--accent);color:#fff">' + (state.userName || __('you')).charAt(0) + '</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">' + (state.userName || __('you')) + '</p><p class="text-[10px]" style="color:var(--text3)">'+__('you')+'</p></div>' +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-check text-[7px]"></i>Joined</div></div>'
    : '<div class="s-card p-3 flex items-center gap-3" style="border:1.5px dashed var(--accent);background:var(--accent-light)">' +
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:var(--accent);color:#fff">' + (state.userName || __('you')).charAt(0) + '</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">' + (state.userName || __('you')) + ' (' + __('you') + ')</p><p class="text-[10px]" style="color:var(--accent)">'+__('tap_to_join_deal')+'</p></div></div>') +
    '</div>' +
    (joined ?
    '<div class="p-4 rounded-2xl text-center" style="background:var(--trust-light);border:1px solid rgba(13,148,136,0.15)">' +
    '<i class="fa-solid fa-check-circle text-2xl mb-2" style="color:var(--trust)"></i>' +
    '<p class="text-sm font-bold" style="color:var(--trust)">'+__('deal_active')+'</p>' +
    '<p class="text-[10px]" style="color:var(--text2)">'+__('three_log_mil_gaye')+'</p></div>'
    : '<button class="btn-primary" onclick="joinGroupDeal()"><i class="fa-solid fa-handshake mr-2"></i>'+__('group_deal_join')+'</button>') +
    '</div>';

  document.getElementById('group-deal-modal').classList.add('show');
}

function joinGroupDeal() {
  state.groupDealJoined = true;
  addNotification(__('group_deal_joined_notif'), 'order');
  closeGroupDealModal();
  openGroupDeal();
  showToast(__('group_deal_joined_toast'));
}

function closeGroupDealModal() {
  document.getElementById('group-deal-modal').classList.remove('show');
}

document.getElementById('group-deal-modal').addEventListener('click', function (e) {
  if (e.target.id === 'group-deal-modal') closeGroupDealModal();
});

function getFullProductFeed() {
  if (state._originalFeed && state._originalFeed.length) return state._originalFeed;
  return PRODUCTS.map(function (p) {
    return {
      id: p.id, title: p.title, titleEn: p.titleEn, titleHi: p.titleHi,
      price: p.price, unit: p.unit, seller: p.seller,
      category: p.category, stock: p.stock
    };
  });
}

function applyActiveFilters(products) {
  if (state.activeFilter && state.activeFilter !== 'all') {
    products = products.filter(function (p) { return p.category === state.activeFilter; });
  }
  if (state.activeLocation && state.activeLocation !== 'all') {
    products = products.filter(function (p) { return SELLERS[p.seller] && SELLERS[p.seller].locality === state.activeLocation; });
  }
  return products;
}

function setupFeedSearch() {
  var searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', async function (e) {
    var q = e.target.value.toLowerCase().trim();

    if (!q) {
      state.productFeed = applyActiveFilters(getFullProductFeed());
      state._searchResults = null;
      if (state.currentView === 'feed') renderFeed();
      if (state.currentView === 'seller-dashboard') renderSellerFeed();
      return;
    }

    // Always search from the full product feed
    var fullFeed = getFullProductFeed();

    // ── Try backend API first for product search ──
    var apiProducts = await API.fetchProducts({ search: q });
    
    // Determine which product source to search
    var productSource;
    if (apiProducts.length) {
      productSource = apiProducts;
    } else {
      productSource = fullFeed;
    }

    // ── Parse query for category + location ──
    var matchedCategory = matchCategoryFromQuery(q);
    var matchedLocality = matchLocalityFromQuery(q);

    // Respect active location chip when searching
    var activeLoc = (state.activeLocation && state.activeLocation !== 'all') ? state.activeLocation : null;

    // Search products matching the query
    var matchedProducts = productSource.filter(function (p) {
      var seller = SELLERS[p.seller];
      if (!seller) return false;

      // Filter by active location chip (if set)
      if (activeLoc && seller.locality !== activeLoc) return false;

      // Filter by location parsed from query (if any)
      if (matchedLocality && seller.locality !== matchedLocality) return false;

      // Match text query against title, seller name, shop name, or locality
      var matchesTitle = p.title.toLowerCase().includes(q) ||
        (p.titleHi && p.titleHi.toLowerCase().includes(q));
      var matchesSeller =
        seller.shop.toLowerCase().includes(q) ||
        seller.locality.toLowerCase().includes(q) ||
        seller.name.toLowerCase().includes(q);
      var matchesCategoryHint = matchedCategory ? p.category === matchedCategory : false;
      var matchesLocalityHint = matchedLocality && seller ? seller.locality === matchedLocality : false;

      if (matchesTitle || matchesSeller) return true;
      if (matchedCategory && matchedLocality && matchesCategoryHint && matchesLocalityHint) return true;
      return false;
    });

    // ── Try backend directory API ──
    var apiDirectory = await API.fetchDirectory({ search: q });
    var directorySource;
    if (apiDirectory.length) {
      directorySource = apiDirectory;
    } else {
      directorySource = SELLER_DIRECTORY;
    }

    // Search directory for unregistered shops matching the query
    var matchedDirectory = directorySource.filter(function (d) {
      if (d.registered) return false;

      // Filter by active location chip
      if (activeLoc && d.locality !== activeLoc) return false;
      // Filter by location parsed from query
      if (matchedLocality && d.locality !== matchedLocality) return false;

      var shopMatch = (d.shop || '').toLowerCase().includes(q);
      var locMatch = (d.locality || '').toLowerCase().includes(q);

      var catMatch = matchedCategory ? d.category === matchedCategory : false;
      var locHintMatch = matchedLocality ? d.locality === matchedLocality : false;

      if (shopMatch || locMatch) return true;
      if (matchedCategory && matchedLocality && catMatch && locHintMatch) return true;
      if (matchedCategory && catMatch) return true;
      if (matchedLocality && locHintMatch) return true;
      return false;
    });

    // ── Try Nominatim (OpenStreetMap) for real-time shop discovery ──
    var osmPlaces = await API.fetchPlaces(q);

    // Filter out OSM results that are already in our products or directory
    var knownShops = {};
    matchedProducts.forEach(function (p) { knownShops[SELLERS[p.seller].shop.toLowerCase()] = true; });
    matchedDirectory.forEach(function (d) { knownShops[d.shop.toLowerCase()] = true; });

    var newOsmPlaces = [];
    osmPlaces.forEach(function (op) {
      var name = op.shop.toLowerCase();
      if (!knownShops[name] && !knownShops[name.replace(/[^a-z0-9]/g, '')]) {
        var isDuplicate = false;
        for (var ks in knownShops) {
          if (name.indexOf(ks) !== -1 || ks.indexOf(name) !== -1) { isDuplicate = true; break; }
        }
        if (!isDuplicate) {
          if (!activeLoc || (op.locality && op.locality.toLowerCase().indexOf(activeLoc.toLowerCase()) !== -1)) {
            newOsmPlaces.push(op);
          }
        }
      }
    });

    var mergedDirectory = matchedDirectory.concat(newOsmPlaces);

    // Store search results separately — don't override productFeed
    state._searchResults = { products: matchedProducts, directory: mergedDirectory };

    renderFeed();
  });
}
