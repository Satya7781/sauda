// ============================================================
// BUYER FEED — Sauda
// ============================================================

function renderCategoryCards() {
  var c = document.getElementById('category-cards');
  c.innerHTML = state.categories.map(function (cat) {
    return '<div class="category-card" onclick="navigateTo(\'categories\');selectCategory(\'' + cat.id + '\')">' +
      '<div class="cat-icon" style="background:' + cat.bg + '"><i class="fa-solid ' + cat.icon + '" style="color:' + cat.color + '"></i></div>' +
      '<span class="text-[11px] font-bold">' + cat.name + '</span></div>';
  }).join('');
}

function renderFilterChips() {
  var c = document.getElementById('filter-chips');
  c.innerHTML = '<button class="filter-chip active" data-filter="all">Sabhi</button>' +
    state.categories.map(function (cat) {
      return '<button class="filter-chip" data-filter="' + cat.id + '"><i class="fa-solid ' + cat.icon + ' text-[9px] mr-1" style="color:' + cat.color + '"></i>' + cat.name + '</button>';
    }).join('');

  c.addEventListener('click', function (e) {
    var chip = e.target.closest('.filter-chip');
    if (!chip) return;
    state.activeFilter = chip.dataset.filter;
    c.querySelectorAll('.filter-chip').forEach(function (x) { x.classList.toggle('active', x === chip); });
    renderFeed();
  });
}

function renderFeed() {
  var container = document.getElementById('product-feed');
  var filtered = state.activeFilter === 'all'
    ? state.productFeed
    : state.productFeed.filter(function (p) { return p.category === state.activeFilter; });

  if (!filtered.length) {
    container.innerHTML = '<div class="text-center py-10"><i class="fa-solid fa-box-open text-3xl mb-3" style="color:var(--text3)"></i><p class="text-sm" style="color:var(--text3)">Koi listing nahi mila</p></div>';
    return;
  }

  container.innerHTML = filtered.map(function (p, i) {
    var seller = SELLERS[p.seller];
    var voucher = USERS[seller.vouchedBy];
    var cat = state.categories.find(function (c) { return c.id === p.category; });

    return '<div class="s-card flex overflow-hidden cursor-pointer feed-card" onclick="openProductDetail(' + p.id + ')" role="button" tabindex="0" style="animation-delay:' + (i * 0.06) + 's">' +
      productImageHTML(p, 100, 120) +
      '<div class="flex-1 p-3 flex flex-col justify-between min-w-0">' +
      '<div>' +
      '<div class="flex items-center justify-between mb-1">' +
      '<span class="text-[9px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? cat.name : p.category) + '</span>' +
      (seller.isLive ? '<div class="flex items-center gap-1"><div class="pulse-dot" style="width:5px;height:5px"></div><span class="text-[9px] font-bold" style="color:var(--trust)">LIVE</span></div>' : '') +
      '</div>' +
      '<h4 class="text-sm font-bold leading-tight truncate">' + p.title + '</h4>' +
      '<p class="text-[10px] truncate" style="color:var(--text2)">' + p.titleHi + ' — ' + p.unit + ' — ' + seller.distance + '</p>' +
      '</div>' +
      '<div class="flex items-center justify-between mt-2">' +
      '<span class="text-base font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
      '<div class="vouch-tag"><i class="fa-solid fa-user-check text-[8px]"></i>' + voucher.name.split(' ')[0] + '</div>' +
      '</div></div></div>';
  }).join('');
}

function openGroupDeal() {
  var joined = state.groupDealJoined || false;
  var sheet = document.getElementById('group-deal-sheet');
  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">Group Deal</h3><p class="text-[10px]" style="color:var(--text3)">3 log milke — 20% sasta</p></div>' +
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
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:var(--accent);color:#fff">' + (state.userName || 'Aap').charAt(0) + '</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">' + (state.userName || 'Aap') + '</p><p class="text-[10px]" style="color:var(--text3)">You</p></div>' +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-check text-[7px]"></i>Joined</div></div>'
    : '<div class="s-card p-3 flex items-center gap-3" style="border:1.5px dashed var(--accent);background:var(--accent-light)">' +
    '<div class="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style="background:var(--accent);color:#fff">' + (state.userName || 'Aap').charAt(0) + '</div>' +
    '<div class="flex-1"><p class="text-sm font-medium">' + (state.userName || 'Aap') + ' (You)</p><p class="text-[10px]" style="color:var(--accent)">Tap to join this deal</p></div></div>') +
    '</div>' +

    (joined ?
    '<div class="p-4 rounded-2xl text-center" style="background:var(--trust-light);border:1px solid rgba(13,148,136,0.15)">' +
    '<i class="fa-solid fa-check-circle text-2xl mb-2" style="color:var(--trust)"></i>' +
    '<p class="text-sm font-bold" style="color:var(--trust)">Deal Active!</p>' +
    '<p class="text-[10px]" style="color:var(--text2)">3 log mil gaye — 20% discount laga hai</p></div>'
    : '<button class="btn-primary" onclick="joinGroupDeal()"><i class="fa-solid fa-handshake mr-2"></i>Group Deal Mein Shamil Ho</button>') +
    '</div>';

  document.getElementById('group-deal-modal').classList.add('show');
}

function joinGroupDeal() {
  state.groupDealJoined = true;
  addNotification('Group Deal active! Banarasi Silk Saree — 20% off', 'order');
  closeGroupDealModal();
  openGroupDeal();
  showToast('Group Deal mein shamil ho gaye! 20% sasta!');
}

function closeGroupDealModal() {
  document.getElementById('group-deal-modal').classList.remove('show');
}

document.getElementById('group-deal-modal').addEventListener('click', function (e) {
  if (e.target.id === 'group-deal-modal') closeGroupDealModal();
});

function setupFeedSearch() {
  var searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', async function (e) {
    var q = e.target.value.toLowerCase();
    // Try API first, fallback to mock data
    var products = await API.fetchProducts({ search: q });
    
    if (products.length) {
      state.productFeed = products;
    } else if (q) {
      // Search in mock data
      state.productFeed = PRODUCTS.filter(function(p) {
        return p.title.toLowerCase().includes(q) || 
               (p.titleHi && p.titleHi.toLowerCase().includes(q));
      });
    } else {
      // Reset to full mock data
      state.productFeed = PRODUCTS.map(function(p) {
        return {
          id: p.id,
          title: p.title,
          titleHi: p.titleHi,
          price: p.price,
          unit: p.unit,
          seller: p.seller,
          category: p.category,
          stock: p.stock
        };
      });
    }
    
    if (state.currentView === 'feed') renderFeed();
    if (state.currentView === 'seller-dashboard') renderSellerFeed();
  });
}
