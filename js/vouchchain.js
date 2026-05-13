// ============================================================
// VOUCHCHAIN MODAL — Sauda
// ============================================================

function openVouchChainModal() {
  var sheet = document.getElementById('vouch-sheet');
  sheet.innerHTML =
    '<div class="p-5">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div><h3 class="text-base font-bold" style="font-family:\'Space Grotesk\',sans-serif">VouchChain</h3><p class="text-[10px]" style="color:var(--text3)">Bharose ka rishta, rating nahi</p></div>' +
    '<button onclick="closeVouchModal()" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg2)"><i class="fa-solid fa-xmark text-sm" style="color:var(--text2)"></i></button>' +
    '</div>' +
    '<div style="position:relative;width:100%;height:360px" id="vouch-graph-wrap"><canvas id="vouch-graph-canvas"></canvas></div>' +
    '<div class="mt-3 space-y-2">' +
    VOUCHES.filter(function (v) { return v.from === 'you'; }).map(function (v) {
      var u = USERS[v.to];
      var connectedSellers = Object.keys(SELLERS).filter(function (sk) { return SELLERS[sk].vouchedBy === v.to; });
      var sid = connectedSellers.length > 0 ? connectedSellers[0] : null;
      var s = sid ? SELLERS[sid] : null;
      return '<div class="s-card p-3 flex items-center gap-3 cursor-pointer"' + (sid ? ' onclick="closeVouchModal();setTimeout(function(){openSellerModal(\'' + sid + '\')},100)"' : '') + '>' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style="background:' + u.color + '15;color:' + u.color + '">' + u.initials + '</div>' +
        '<div class="flex-1 min-w-0"><p class="text-sm font-semibold truncate">' + u.name + '</p><p class="text-[10px] truncate" style="color:var(--text3)">' + v.relation + '</p></div>' +
        (s ? '<div class="vouch-tag text-[8px] flex-shrink-0"><i class="fa-solid fa-arrow-right text-[7px]"></i>' + s.name.split(' ')[0] + '</div>' : '') +
        '</div>';
    }).join('') +
    '</div></div>';

  document.getElementById('vouch-modal').classList.add('show');
  setTimeout(renderVouchGraph, 150);
}

function closeVouchModal() {
  document.getElementById('vouch-modal').classList.remove('show');
}

function renderVouchGraph() {
  var wrap = document.getElementById('vouch-graph-wrap');
  if (!wrap) return;
  var canvas = document.getElementById('vouch-graph-canvas');
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W = wrap.clientWidth, H = wrap.clientHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.scale(dpr, dpr);

  var cx = W / 2, cy = H / 2, innerR = Math.min(W, H) * 0.24, outerR = Math.min(W, H) * 0.42;
  var firstDegree = ['priya', 'amit', 'sunita', 'vikram', 'meena'];
  var gNodes = [{ id: 'you', x: cx, y: cy, r: 26, label: 'Aap', color: '#B8680F', degree: 0 }];

  firstDegree.forEach(function (uid, i) {
    var a = (i / firstDegree.length) * Math.PI * 2 - Math.PI / 2;
    gNodes.push({ id: uid, x: cx + Math.cos(a) * innerR, y: cy + Math.sin(a) * innerR, r: 20, label: USERS[uid].name.split(' ')[0], color: USERS[uid].color, degree: 1 });
  });

  Object.values(SELLERS).forEach(function (s) {
    var vn = gNodes.find(function (n) { return n.id === s.vouchedBy; });
    if (!vn) return;
    var a = Math.atan2(vn.y - cy, vn.x - cx);
    gNodes.push({ id: s.id, x: cx + Math.cos(a) * outerR, y: cy + Math.sin(a) * outerR, r: 18, label: s.name.split(' ')[0], color: s.color, degree: 2 });
  });

  var edges = [];
  VOUCHES.forEach(function (v) {
    var f = gNodes.find(function (n) { return n.id === v.from; });
    var t = gNodes.find(function (n) { return n.id === v.to; });
    if (f && t) edges.push({ from: f, to: t });
  });

  var time = 0, hovered = null;

  function getNodeAt(mx, my) {
    for (var i = gNodes.length - 1; i >= 0; i--) {
      var n = gNodes[i];
      if (Math.sqrt((mx - n.x) ** 2 + (my - n.y) ** 2) < n.r + 6) return n;
    }
    return null;
  }

  canvas.onclick = function (e) {
    var r = canvas.getBoundingClientRect();
    var n = getNodeAt(e.clientX - r.left, e.clientY - r.top);
    if (n && n.degree === 2) {
      closeVouchModal();
      setTimeout(function () { openSellerModal(n.id); }, 200);
    } else if (n && n.degree === 1) {
      showToast(USERS[n.id].name + ' — ' + USERS[n.id].relation);
    }
  };

  canvas.onmousemove = function (e) {
    var r = canvas.getBoundingClientRect();
    var n = getNodeAt(e.clientX - r.left, e.clientY - r.top);
    hovered = n;
    canvas.style.cursor = n ? 'pointer' : 'default';
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);
    time += 0.02;

    edges.forEach(function (e) {
      var hl = hovered && (e.from.id === hovered.id || e.to.id === hovered.id);
      ctx.beginPath();
      ctx.moveTo(e.from.x, e.from.y);
      ctx.lineTo(e.to.x, e.to.y);
      ctx.strokeStyle = hl ? 'rgba(13,148,136,0.35)' : 'rgba(0,0,0,0.04)';
      ctx.lineWidth = hl ? 2.5 : 1;
      ctx.stroke();

      var t = ((time * 0.4 + edges.indexOf(e) * 0.25) % 1);
      var px = e.from.x + (e.to.x - e.from.x) * t;
      var py = e.from.y + (e.to.y - e.from.y) * t;
      ctx.beginPath();
      ctx.arc(px, py, hl ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = hl ? '#0D9488' : 'rgba(13,148,136,0.2)';
      ctx.fill();
    });

    gNodes.forEach(function (n) {
      var isH = hovered && hovered.id === n.id;
      var isConn = hovered && edges.some(function (e) {
        return (e.from.id === hovered.id && e.to.id === n.id) || (e.to.id === hovered.id && e.from.id === n.id);
      });
      var dim = hovered && !isH && !isConn;
      ctx.globalAlpha = dim ? 0.25 : 1;

      var gr = ctx.createRadialGradient(n.x, n.y, n.r * 0.3, n.x, n.y, n.r + (isH ? 14 : 6) + Math.sin(time * 2 + gNodes.indexOf(n)) * 1.5);
      gr.addColorStop(0, n.color + '15');
      gr.addColorStop(1, n.color + '00');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + (isH ? 14 : 6) + Math.sin(time * 2 + gNodes.indexOf(n)) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = n.color + (isH ? 'CC' : '40');
      ctx.lineWidth = isH ? 2.5 : 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = n.color;
      var ini = n.degree === 0 ? 'A' : n.label.charAt(0) + ((USERS[n.id] && USERS[n.id].name.split(' ')[1]) || (SELLERS[n.id] && SELLERS[n.id].name.split(' ')[1]) || '').charAt(0);
      ctx.font = 'bold ' + (n.r * 0.5) + "px 'Space Grotesk',sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ini, n.x, n.y);

      ctx.fillStyle = dim ? 'rgba(28,25,23,0.2)' : '#1C1917';
      ctx.font = '600 ' + (n.degree === 0 ? 10 : 9) + "px 'DM Sans',sans-serif";
      ctx.fillText(n.label, n.x, n.y + n.r + 12);

      if (n.degree === 2) {
        ctx.fillStyle = dim ? 'rgba(13,148,136,0.15)' : 'rgba(13,148,136,0.6)';
        ctx.font = "500 7px 'DM Sans',sans-serif";
        ctx.fillText('TAP', n.x, n.y + n.r + 22);
      }
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

document.getElementById('vouch-modal').addEventListener('click', function (e) {
  if (e.target.id === 'vouch-modal') closeVouchModal();
});
