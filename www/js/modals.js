// ============================================================
// PRODUCT DETAIL MODAL — Sauda
// ============================================================

function openProductDetail(pid) {
  var p = PRODUCTS.find(function (pr) { return pr.id == pid; });
  if (!p) p = state.productFeed.find(function (pr) { return pr.id == pid; });
  if (!p) return;
  var s = SELLERS[p.seller];
  var v = USERS[s.vouchedBy];
  var cat = CATEGORIES.find(function (c) { return c.id === p.category; });
  var ts = Math.min(95, 30 + (s.aadhaarVerified ? 15 : 0) + s.yearsActive * 3 + s.trustedNeighbors * 1.2);

  document.getElementById('product-sheet').innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<button onclick="closeProductModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)" aria-label="Close"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '<span class="text-[10px] font-extrabold uppercase tracking-wider" style="color:' + (cat ? cat.color : 'var(--text3)') + '">' + (cat ? cat.name : p.category) + '</span>' +
    '<button onclick="toggleSaveSeller(\'' + p.seller + '\')" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)" aria-label="Save"><i class="' + (state.savedSellers && state.savedSellers.indexOf(p.seller) !== -1 ? 'fa-solid' : 'fa-regular') + ' fa-heart text-sm" style="color:var(--danger)"></i></button>' +
    '</div>' +

    '<div class="flex items-center justify-center mb-5" style="height:160px">' +
    (PRODUCT_IMAGES[p.id] ?
      '<div class="product-img" style="width:140px;height:140px;border-radius:24px;overflow:hidden;position:relative">' +
      '<img src="images/' + PRODUCT_IMAGES[p.id] + '" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div style="display:none;width:100%;height:100%;flex-direction:column;align-items:center;justify-content:center;background:' + (cat ? cat.bg : 'var(--bg2)') + '">' +
      '<i class="fa-solid ' + (cat ? cat.icon : 'fa-box') + '" style="font-size:48px;color:' + (cat ? cat.color : 'var(--text3)') + ';opacity:0.6"></i></div></div>'
      :
      '<div class="product-img" style="width:140px;height:140px;border-radius:24px;background:' + (cat ? cat.bg : 'var(--bg2)') + ';display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden">' +
      '<i class="fa-solid ' + (cat ? cat.icon : 'fa-box') + '" style="font-size:48px;color:' + (cat ? cat.color : 'var(--text3)') + ';opacity:0.6"></i>' +
      '</div>') +
    '</div>' +

    '<h2 class="text-xl font-extrabold mb-1" style="font-family:\'Space Grotesk\',sans-serif">' + p.title + '</h2>' +
    '<p class="text-sm mb-3" style="color:var(--text2)">' + p.titleHi + '</p>' +

    '<div class="flex items-baseline gap-2 mb-4">' +
    '<span class="text-2xl font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
    '<span class="text-sm" style="color:var(--text3)">/ ' + p.unit + '</span>' +
    (s.isLive ? '<div class="flex items-center gap-1 ml-auto"><div class="pulse-dot" style="width:5px;height:5px"></div><span class="text-[10px] font-bold" style="color:var(--trust)">'+__('live')+'</span></div>' : '') +
    '</div>' +

    '<div class="s-card p-4 mb-3 flex items-center gap-3 cursor-pointer" onclick="closeProductModal();setTimeout(function(){openSellerModal(\'' + p.seller + '\')},200)">' +
    '<div class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold" style="background:' + s.color + '15;color:' + s.color + '">' + s.initials + '</div>' +
    '<div class="flex-1 min-w-0">' +
    '<p class="text-sm font-bold truncate">' + s.shop + '</p>' +
    '<p class="text-[10px]" style="color:var(--text2)">' + s.name + ' — ' + s.distance + '</p>' +
    '</div>' +
    '<div class="trust-ring" style="width:44px;height:44px"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="#EDE5D5" stroke-width="3"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--trust)" stroke-width="3" stroke-dasharray="' + (2 * Math.PI * 18) + '" stroke-dashoffset="' + (2 * Math.PI * 18 * (1 - ts / 100)) + '" stroke-linecap="round"/></svg><div class="score" style="font-size:11px">' + Math.round(ts) + '</div></div>' +
    '</div>' +

    '<div class="p-3 rounded-xl mb-4 flex items-center gap-2" style="background:var(--trust-light);border:1px solid rgba(13,148,136,0.12)">' +
    '<i class="fa-solid fa-user-check text-xs" style="color:var(--trust)"></i>' +
    '<p class="text-xs" style="color:var(--trust)"><strong>' + v.name + '</strong> ' + __('ne_vouch_kiya') + ' — ' + s.vouchRelation + '</p>' +
    '</div>' +

    '<div class="flex items-center gap-2 mb-4 text-xs" style="color:var(--text3)">' +
    '<span><i class="fa-solid fa-boxes-stacked mr-1"></i>' + p.stock + __('available') + '</span>' +
    '<span class="mx-1">•</span>' +
    '<span><i class="fa-solid fa-location-dot mr-1"></i>' + s.distance + '</span>' +
    '</div>' +

    '<div class="flex items-center justify-between p-3 rounded-xl mb-4" style="background:var(--bg2);border:1px solid var(--card-border)">' +
    '<span class="text-xs font-bold" style="color:var(--text2)">Quantity</span>' +
    '<div class="flex items-center gap-3">' +
    '<button class="qty-btn" onclick="changeQty(' + p.id + ',-1)" style="width:32px;height:32px;border-radius:10px;border:none;background:var(--card);cursor:pointer;font-size:16px;font-weight:bold;color:var(--text2);display:flex;align-items:center;justify-content:center;line-height:1">−</button>' +
    '<span class="text-base font-extrabold" style="min-width:24px;text-align:center;color:var(--text);font-family:\'Space Grotesk\',sans-serif" id="qty-display-' + p.id + '">1</span>' +
    '<button class="qty-btn" onclick="changeQty(' + p.id + ',1)" style="width:32px;height:32px;border-radius:10px;border:none;background:var(--accent);cursor:pointer;font-size:16px;font-weight:bold;color:#fff;display:flex;align-items:center;justify-content:center;line-height:1">+</button>' +
    '</div>' +
    '</div>' +

    '<div class="flex items-center justify-between mb-4">' +
    '<span class="text-xs font-bold" style="color:var(--text2)">Total</span>' +
    '<span class="text-xl font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif" id="total-display-' + p.id + '">₹' + p.price + '</span>' +
    '</div>' +

    '<button class="btn-primary" onclick="confirmOrder(' + p.id + ')">' +
    '<i class="fa-solid fa-handshake mr-2"></i>' + __('sauda_karein') +
    '</button>' +
    '</div>';

  document.getElementById('product-modal').classList.add('show');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('show');
}

document.getElementById('product-modal').addEventListener('click', function (e) {
  if (e.target.id === 'product-modal') closeProductModal();
});

// ============================================================
// SELLER MODAL — Sauda
// ============================================================

function openSellerModal(sid) {
  state.selectedSeller = sid;
  var s = SELLERS[sid];
  var v = USERS[s.vouchedBy];
  var ts = Math.min(95, 30 + (s.aadhaarVerified ? 15 : 0) + s.yearsActive * 3 + s.trustedNeighbors * 1.2);
  var cat = CATEGORIES.find(function (c) { return c.id === s.category; });
  var prods = PRODUCTS.filter(function (p) { return p.seller === sid; });

  document.getElementById('seller-sheet').innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div class="flex items-center gap-3">' +
    '<div class="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold" style="background:' + s.color + '15;color:' + s.color + '">' + s.initials + '</div>' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">' + s.shop + '</h3><p class="text-[11px]" style="color:var(--text2)">' + s.name + ' — ' + s.locality + ' — ' + s.distance + '</p></div>' +
    '</div>' +
    '<button onclick="closeSellerModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)" aria-label="Close"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' +

    '<div class="s-card p-4 mb-3">' +
    '<div class="flex items-center gap-4">' +
    '<div class="trust-ring"><svg width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="30" fill="none" stroke="#EDE5D5" stroke-width="5"/><circle cx="36" cy="36" r="30" fill="none" stroke="var(--trust)" stroke-width="5" stroke-dasharray="' + (2 * Math.PI * 30) + '" stroke-dashoffset="' + (2 * Math.PI * 30 * (1 - ts / 100)) + '" stroke-linecap="round" style="transition:stroke-dashoffset 1s ease"/></svg><div class="score">' + Math.round(ts) + '</div></div>' +
    '<div class="flex-1"><p class="text-sm font-bold mb-1.5">Trust Score</p><div class="flex flex-wrap gap-1.5">' +
    (s.aadhaarVerified ? '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-shield-halved text-[7px]"></i>Aadhaar</div>' : '') +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-clock text-[7px]"></i>' + s.yearsActive + __('saal') + '</div>' +
    '<div class="vouch-tag text-[9px]"><i class="fa-solid fa-people-group text-[7px]"></i>' + s.trustedNeighbors + __('neighbors') + '</div>' +
    (s.isLive ? '<div class="vouch-tag text-[9px]" style="background:var(--accent-light);color:var(--accent)"><i class="fa-solid fa-circle text-[5px]"></i>Live Now</div>' : '') +
    '</div></div></div></div>' +

    '<div class="p-4 rounded-2xl mb-3" style="background:var(--trust-light);border:1.5px solid rgba(13,148,136,0.12)">' +
    '<p class="text-[9px] font-extrabold uppercase tracking-wider mb-3" style="color:var(--trust)">' + __('vouchchain_trust_path') + '</p>' +
    '<canvas id="trust-path-canvas" width="350" height="160"></canvas>' +
    '<div class="mt-3 p-3 rounded-xl" style="background:rgba(13,148,136,0.06)">' +
    '<p class="text-xs" style="color:var(--trust)"><i class="fa-solid fa-link mr-1"></i><strong>' + v.name + '</strong> (' + v.relation + ') ' + __('ne_vouch_kiya') + '</p>' +
    '<p class="text-[10px] mt-1" style="color:var(--text3)">' + s.vouchRelation + '</p>' +
    '</div></div>' +

    '<p class="text-[10px] font-extrabold uppercase tracking-wider mb-2" style="color:var(--text3)">' + __('listings_header') + ' (' + prods.length + ')</p>' +
    '<div class="space-y-2 mb-4">' +
    prods.map(function (p) {
      return '<div class="flex items-center gap-3 p-3 rounded-xl" style="background:var(--bg2);border:1px solid var(--card-border)">' +
        productImageHTMLSmall(p) +
        '<div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">' + p.title + '</p><p class="text-[10px]" style="color:var(--text3)">' + p.titleHi + ' — ' + p.unit + '</p></div>' +
        '<span class="text-sm font-extrabold flex-shrink-0" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</span>' +
        '<button class="px-3 py-1.5 rounded-lg text-xs font-bold" style="background:var(--trust-light);color:var(--trust);border:none;cursor:pointer" onclick="confirmOrder(\'' + p.id + '\')">' + __('sauda') + '</button>' +
        '</div>';
    }).join('') +
    '</div></div>';

  document.getElementById('seller-modal').classList.add('show');
  setTimeout(function () { animateTrustPath(sid); }, 300);
}

function closeSellerModal() {
  document.getElementById('seller-modal').classList.remove('show');
  state.selectedSeller = null;
}

function animateTrustPath(sid) {
  var canvas = document.getElementById('trust-path-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);
  var W = canvas.clientWidth, H = canvas.clientHeight;
  var s = SELLERS[sid], v = USERS[s.vouchedBy];

  var nodes = [
    { x: W * 0.15, y: H * 0.5, label: 'Aap', sub: 'You', color: '#B8680F', r: 22 },
    { x: W * 0.5, y: H * 0.5, label: v.name.split(' ')[0], sub: v.relation.split('—')[0].trim(), color: v.color, r: 20 },
    { x: W * 0.85, y: H * 0.5, label: s.name.split(' ')[0], sub: s.shop.length > 14 ? s.shop.slice(0, 14) + '...' : s.shop, color: s.color, r: 20 },
  ];

  var progress = 0;
  var dur = 2200;
  var start = performance.now();

  function draw(now) {
    progress = Math.min(1, (now - start) / dur);
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < 2; i++) {
      var ss = i * 0.5, se = (i + 1) * 0.5;
      var sp = Math.max(0, Math.min(1, (progress - ss) / (se - ss + 0.01)));
      if (sp > 0) {
        var f = nodes[i], t = nodes[i + 1];
        var ex = f.x + (t.x - f.x) * sp, ey = f.y + (t.y - f.y) * sp;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = 'rgba(13,148,136,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = 'rgba(13,148,136,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        if (sp < 1) {
          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#0D9488';
          ctx.shadowColor = '#0D9488';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    nodes.forEach(function (n, i) {
      var ns = i * 0.2, np = Math.max(0, Math.min(1, (progress - ns) / 0.35));
      if (np <= 0) return;
      var sc = 0.6 + 0.4 * easeOut(np), al = np;
      ctx.globalAlpha = al;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * sc + 8, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '10';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * sc, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = n.color + '50';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = n.color;
      ctx.font = 'bold ' + Math.round(10 * sc) + "px 'Space Grotesk',sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label.charAt(0) + (n.label.split(' ')[1] || '').charAt(0), n.x, n.y);
      ctx.fillStyle = '#1C1917';
      ctx.font = '600 ' + Math.round(10 * sc) + "px 'DM Sans',sans-serif";
      ctx.fillText(n.label, n.x, n.y + n.r * sc + 14);
      ctx.fillStyle = '#A8A29E';
      ctx.font = Math.round(8 * sc) + "px 'DM Sans',sans-serif";
      var sub = n.sub.length > 16 ? n.sub.slice(0, 16) + '..' : n.sub;
      ctx.fillText(sub, n.x, n.y + n.r * sc + 26);
      ctx.globalAlpha = 1;
    });

    if (progress < 1) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

document.getElementById('seller-modal').addEventListener('click', function (e) {
  if (e.target.id === 'seller-modal') closeSellerModal();
});

function changeQty(pid, delta) {
  var display = document.getElementById('qty-display-' + pid);
  if (!display) return;
  var qty = parseInt(display.textContent) || 1;
  qty += delta;
  var prod = PRODUCTS.find(function (p) { return p.id == pid; });
  if (!prod) prod = state.productFeed.find(function (p) { return p.id == pid; });
  if (!prod) return;
  if (qty < 1) qty = 1;
  if (qty > prod.stock) qty = prod.stock;
  display.textContent = qty;
  var total = document.getElementById('total-display-' + pid);
  if (total) total.textContent = '\u20B9' + (prod.price * qty);
}
