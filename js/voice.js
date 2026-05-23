// ============================================================
// VOICE RECORDING — Sauda
// ============================================================

var recognition = null;
var waveformAnim = null;
var buyerRecognition = null;

function initVoiceSection() {
  var role = state.userRole || 'buyer';
  var sellSection = document.getElementById('voice-seller-section');
  var buySection = document.getElementById('voice-buyer-section');
  if (!sellSection || !buySection) return;
  if (role === 'seller') {
    sellSection.style.display = '';
    buySection.style.display = 'none';
    initVoice();
  } else {
    sellSection.style.display = 'none';
    buySection.style.display = '';
    initBuyerVoice();
  }
}

function initVoice() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    recognition = new SR();
    recognition.lang = state.userLang === 'en' ? 'en-IN' : 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = function (e) {
      var t = '';
      for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      document.getElementById('transcription-text').textContent = t;
    };
    recognition.onend = function () {
      if (state.isRecording) stopRecording();
    };
    recognition.onerror = function () {
      if (state.isRecording) stopRecording();
    };
  }
}

function startRecording() {
  state.isRecording = true;
  var btn = document.getElementById('mic-btn');
  btn.classList.add('recording');
  btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  document.getElementById('mic-hint').textContent = __('sun_raha_hoon');
  document.getElementById('transcription-area').style.display = 'none';
  document.getElementById('ai-status').style.display = 'none';
  document.getElementById('generated-listing').style.display = 'none';
  startWaveform();
  if (recognition) recognition.start();
  else simulateTranscription();
}

function stopRecording() {
  state.isRecording = false;
  var btn = document.getElementById('mic-btn');
  btn.classList.remove('recording');
  btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  document.getElementById('mic-hint').textContent = __('mic_hint');
  stopWaveform();
  var t = document.getElementById('transcription-text').textContent;
  if (t) {
    document.getElementById('transcription-area').style.display = 'block';
    processWithAI(t);
  }
  if (recognition) {
    try { recognition.stop(); } catch (e) { }
  }
}

function simulateTranscription() {
  state.isRecording = true;
  var btn = document.getElementById('mic-btn');
  btn.classList.add('recording');
  btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  document.getElementById('mic-hint').textContent = __('sun_raha_hoon');
  document.getElementById('transcription-area').style.display = 'none';
  document.getElementById('ai-status').style.display = 'none';
  document.getElementById('generated-listing').style.display = 'none';
  startWaveform();
  var demo = 'Banarasi silk saree ₹2500 piece';
  var el = document.getElementById('transcription-text');
  var ci = 0;
  var iv = setInterval(function () {
    if (ci < demo.length) {
      el.textContent = demo.slice(0, ci + 1);
      ci++;
    } else {
      clearInterval(iv);
      setTimeout(function () {
        state.isRecording = false;
        btn.classList.remove('recording');
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        document.getElementById('mic-hint').textContent = __('mic_hint');
        stopWaveform();
        document.getElementById('transcription-area').style.display = 'block';
        processWithAI(demo);
      }, 400);
    }
  }, 70);
}

function processWithAI(t) {
  var st = document.getElementById('ai-status');
  st.style.display = 'block';
  var at = document.getElementById('ai-status-text');
  setTimeout(function () {
    at.innerHTML = __('listing_taiyaar')+'<span class="thinking-dot">.</span><span class="thinking-dot">.</span><span class="thinking-dot">.</span>';
  }, 1200);
  setTimeout(function () {
    st.style.display = 'none';
    showGeneratedListing(t);
  }, 2600);
}

function showGeneratedListing(t) {
  var ext = extractFromSpeech(t);
  document.getElementById('gen-category').textContent = ext.category.toUpperCase();
  document.getElementById('gen-category').style.background = (CATEGORIES.find(function (c) { return c.id === ext.category; }) || { bg: 'var(--accent-light)' }).bg;
  document.getElementById('gen-category').style.color = (CATEGORIES.find(function (c) { return c.id === ext.category; }) || { color: 'var(--accent)' }).color;
  document.getElementById('gen-title').textContent = ext.title + (ext.titleHi ? ' (' + ext.titleHi + ')' : '');
  document.getElementById('gen-price').textContent = '₹' + ext.price + ' / ' + ext.unit;
  document.getElementById('gen-stock').textContent = ext.stock + __('available');
  document.getElementById('generated-listing').style.display = 'block';
  document.querySelectorAll('.listing-field').forEach(function (f) {
    var d = parseInt(f.dataset.delay) || 0;
    setTimeout(function () { f.classList.add('visible'); }, d + 100);
  });
}

function extractFromSpeech(text) {
  var t = text.toLowerCase();
  var price = 0;
  var pm = t.match(/[₹\s](\d+)/);
  if (pm) price = parseInt(pm[1]);

  var unit = 'pcs';
  if (t.indexOf('gaddi') !== -1 || t.indexOf('bundle') !== -1) unit = 'gaddi';
  else if (t.indexOf('kg') !== -1 || t.indexOf('kilo') !== -1) unit = 'kg';
  else if (t.indexOf('litre') !== -1) unit = 'litre';
  else if (t.indexOf('dozen') !== -1 || t.indexOf('darjan') !== -1) unit = 'dozen';
  else if (t.indexOf('piece') !== -1 || t.indexOf('pcs') !== -1) unit = 'piece';
  else if (t.indexOf('set') !== -1) unit = 'set';
  else if (t.indexOf('session') !== -1) unit = 'session';
  else if (t.indexOf('visit') !== -1) unit = 'visit';

  var title = 'Product';
  var titleHi = '';
  var category = 'kirana';

  if (t.indexOf('saree') !== -1 || t.indexOf('sadi') !== -1) { title = 'Banarasi Silk Saree'; titleHi = 'Banarasi Saree'; category = 'clothes'; price = price || 2500; }
  else if (t.indexOf('kurta') !== -1) { title = 'Cotton Kurta'; titleHi = 'Suthan Kurta'; category = 'clothes'; price = price || 450; }
  else if (t.indexOf('suit') !== -1 || t.indexOf('anarkali') !== -1) { title = 'Anarkali Suit'; titleHi = 'Anarkali Suit'; category = 'clothes'; price = price || 1200; }
  else if (t.indexOf('dupatta') !== -1) { title = 'Designer Dupatta'; titleHi = 'Designar Dupatta'; category = 'clothes'; price = price || 350; }
  else if (t.indexOf('lehenga') !== -1) { title = 'Designer Lehenga'; titleHi = 'Designar Lehenga'; category = 'clothes'; price = price || 3500; }
  else if (t.indexOf('blouse') !== -1 || t.indexOf('stitching') !== -1 || t.indexOf('silai') !== -1) { title = 'Custom Blouse Stitching'; titleHi = 'Blouse Silai'; category = 'clothes'; price = price || 250; }
  else if (t.indexOf('palazzo') !== -1) { title = 'Palazzo Set'; titleHi = 'Palajo Set'; category = 'clothes'; price = price || 600; }
  else if (t.indexOf('palak') !== -1 || t.indexOf('spinach') !== -1) { title = 'Fresh Palak'; titleHi = 'Taza Palak'; category = 'sabzi'; price = price || 20; }
  else if (t.indexOf('gobi') !== -1 || t.indexOf('cabbage') !== -1) { title = 'Gobi'; titleHi = 'Bandh Gobi'; category = 'sabzi'; price = price || 40; }
  else if (t.indexOf('tamatar') !== -1 || t.indexOf('tomato') !== -1) { title = 'Tamatar'; titleHi = 'Desi Tamatar'; category = 'sabzi'; price = price || 30; }
  else if (t.indexOf('doodh') !== -1 || t.indexOf('milk') !== -1) { title = 'Doodh'; titleHi = 'Taza Doodh'; category = 'dairy'; price = price || 60; }
  else if (t.indexOf('dahi') !== -1) { title = 'Dahi'; titleHi = 'Makhan Dahi'; category = 'dairy'; price = price || 50; }
  else if (t.indexOf('paneer') !== -1) { title = 'Paneer'; titleHi = 'Taza Paneer'; category = 'dairy'; price = price || 90; }
  else if (t.indexOf('atta') !== -1 || t.indexOf('flour') !== -1) { title = 'Atta'; titleHi = 'Aashirvaad Atta'; category = 'kirana'; price = price || 45; }
  else if (t.indexOf('aam') !== -1 || t.indexOf('mango') !== -1) { title = 'Aam'; titleHi = 'Ratnagiri Aam'; category = 'fruit'; price = price || 80; }
  else if (t.indexOf('kela') !== -1 || t.indexOf('banana') !== -1) { title = 'Kela'; titleHi = 'Bhuvel Kela'; category = 'fruit'; price = price || 40; }
  else if (t.indexOf('mobile') !== -1 || t.indexOf('cover') !== -1 || t.indexOf('earphone') !== -1) { title = 'Mobile Accessories'; titleHi = 'Mobile Saman'; category = 'electronics'; price = price || 299; }
  else if (t.indexOf('mehendi') !== -1 || t.indexOf('facial') !== -1 || t.indexOf('beauty') !== -1) { title = 'Beauty Service'; titleHi = 'Beauty Seva'; category = 'beauty'; price = price || 300; }
  else if (t.indexOf('repair') !== -1 || t.indexOf('plumbing') !== -1 || t.indexOf('ac') !== -1) { title = 'Repair Service'; titleHi = 'Repair Seva'; category = 'services'; price = price || 500; }
  else {
    var words = text.split(/\s+/).filter(function (w) { return !w.match(/[₹\d]/); });
    if (words.length > 0) title = words.slice(0, 2).join(' ');
  }

  if (!price) price = Math.floor(Math.random() * 500) + 50;
  return { title: title, titleHi: titleHi, price: price, unit: unit, category: category, stock: Math.floor(Math.random() * 25) + 5 };
}

// ============================================================
// BUYER VOICE SEARCH
// ============================================================

function initBuyerVoice() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    buyerRecognition = new SR();
    buyerRecognition.lang = 'hi-IN';
    buyerRecognition.interimResults = true;
    buyerRecognition.continuous = false;
    buyerRecognition.maxAlternatives = 1;
    buyerRecognition.onresult = function (e) {
      var t = '';
      for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      document.getElementById('buyer-transcription-text').textContent = t;
    };
    buyerRecognition.onend = function () {
      if (state.isRecording) stopBuyerRecording();
    };
    buyerRecognition.onerror = function () {
      if (state.isRecording) stopBuyerRecording();
    };
  }
}

function startBuyerRecording() {
  state.isRecording = true;
  var btn = document.getElementById('buyer-mic-btn');
  btn.classList.add('recording');
  btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  document.getElementById('buyer-mic-hint').textContent = __('sun_raha_hoon');
  document.getElementById('buyer-transcription-area').style.display = 'none';
  document.getElementById('buyer-ai-status').style.display = 'none';
  document.getElementById('buyer-search-results').style.display = 'none';
  startBuyerWaveform();
  if (buyerRecognition) buyerRecognition.start();
  else simulateBuyerTranscription();
}

function stopBuyerRecording() {
  state.isRecording = false;
  var btn = document.getElementById('buyer-mic-btn');
  btn.classList.remove('recording');
  btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  document.getElementById('buyer-mic-hint').textContent = __('mic_hint');
  stopBuyerWaveform();
  var t = document.getElementById('buyer-transcription-text').textContent;
  if (t) {
    document.getElementById('buyer-transcription-area').style.display = 'block';
    searchByVoice(t);
  }
  if (buyerRecognition) {
    try { buyerRecognition.stop(); } catch (e) { }
  }
}

function simulateBuyerTranscription() {
  state.isRecording = true;
  var btn = document.getElementById('buyer-mic-btn');
  btn.classList.add('recording');
  btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  document.getElementById('buyer-mic-hint').textContent = __('sun_raha_hoon');
  document.getElementById('buyer-transcription-area').style.display = 'none';
  document.getElementById('buyer-ai-status').style.display = 'none';
  document.getElementById('buyer-search-results').style.display = 'none';
  startBuyerWaveform();
  var demo = 'Banarasi silk saree';
  var el = document.getElementById('buyer-transcription-text');
  var ci = 0;
  var iv = setInterval(function () {
    if (ci < demo.length) {
      el.textContent = demo.slice(0, ci + 1);
      ci++;
    } else {
      clearInterval(iv);
      setTimeout(function () {
        state.isRecording = false;
        btn.classList.remove('recording');
        btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        document.getElementById('buyer-mic-hint').textContent = __('mic_hint');
        stopBuyerWaveform();
        document.getElementById('buyer-transcription-area').style.display = 'block';
        searchByVoice(demo);
      }, 400);
    }
  }, 70);
}

function searchByVoice(text) {
  var st = document.getElementById('buyer-ai-status');
  st.style.display = 'block';
  setTimeout(function () {
    st.style.display = 'none';
    var results = filterProductsByText(text);
    showVoiceSearchResults(results, text);
  }, 1200);
}

function filterProductsByText(text) {
  var t = text.toLowerCase();
  var all = state.productFeed.length ? state.productFeed : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
  return all.filter(function (p) {
    var title = (p.title || '').toLowerCase();
    var titleHi = (p.titleHi || '').toLowerCase();
    var cat = (p.category || '').toLowerCase();
    return title.indexOf(t) !== -1 || titleHi.indexOf(t) !== -1 || cat.indexOf(t) !== -1 || t.indexOf(cat) !== -1;
  });
}

function showVoiceSearchResults(products, query) {
  var container = document.getElementById('buyer-results-list');
  var section = document.getElementById('buyer-search-results');
  if (!container || !section) return;
  if (products.length === 0) {
    container.innerHTML = '<div class="p-6 text-center"><p class="text-sm" style="color:var(--text3)">' + __('koi_listing_nahi') + '</p></div>';
  } else {
    container.innerHTML = products.map(function (p) {
      var sellerName = 'Seller';
      if (typeof SELLERS !== 'undefined' && SELLERS[p.seller]) sellerName = SELLERS[p.seller].name || p.seller;
      var catObj = typeof CATEGORIES !== 'undefined' ? CATEGORIES.find(function (c) { return c.id === p.category; }) : null;
      var icon = catObj ? catObj.icon : 'fa-solid fa-box';
      var color = catObj ? catObj.color : 'var(--accent)';
      return '<div class="s-card p-4 mb-3 flex items-center gap-4" onclick="openProductDetail(\'' + p.id + '\')">' +
        '<div class="w-14 h-14 rounded-xl flex items-center justify-center text-lg" style="background:var(--accent-light);color:var(--accent)"><i class="fa-solid ' + icon + '"></i></div>' +
        '<div class="flex-1 min-w-0"><p class="text-sm font-bold truncate">' + p.title + '</p>' +
        '<p class="text-xs" style="color:var(--text3)">' + sellerName + '</p></div>' +
        '<div class="text-right"><p class="text-base font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">₹' + p.price + '</p>' +
        '<p class="text-[10px]" style="color:var(--text3)">' + (p.unit || 'pcs') + '</p></div></div>';
    }).join('');
  }
  section.style.display = 'block';
}

function startBuyerWaveform() {
  var canvas = document.getElementById('buyer-waveform');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  canvas.width = 300 * dpr;
  canvas.height = 300 * dpr;
  ctx.scale(dpr, dpr);
  var cx = 150, cy = 150, bars = 64;
  var barData = new Float32Array(bars);
  var time = 0;
  function draw() {
    if (!state.isRecording) return;
    ctx.clearRect(0, 0, 300, 300);
    time += 0.05;
    for (var i = 0; i < bars; i++) {
      var a = (i / bars) * Math.PI * 2 - Math.PI / 2;
      var noise = Math.sin(time * 3 + i * 0.5) * 0.3 + Math.sin(time * 7 + i * 1.2) * 0.2 + Math.random() * 0.3;
      barData[i] += (Math.max(0.05, Math.abs(noise)) - barData[i]) * 0.3;
      var ir = 52;
      var or = ir + barData[i] * 38;
      var x1 = cx + Math.cos(a) * ir;
      var y1 = cy + Math.sin(a) * ir;
      var x2 = cx + Math.cos(a) * or;
      var y2 = cy + Math.sin(a) * or;
      var al = 0.15 + barData[i] * 0.85;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(0,150,200,' + al.toFixed(2) + ')';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    var grad = ctx.createRadialGradient(cx, cy, 36, cx, cy, 60);
    grad.addColorStop(0, 'rgba(0,150,200,0.05)');
    grad.addColorStop(1, 'rgba(0,150,200,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    waveformAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopBuyerWaveform() {
  if (waveformAnim) cancelAnimationFrame(waveformAnim);
  var c = document.getElementById('buyer-waveform');
  if (!c) return;
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 300, 300);
}

function startWaveform() {
  var canvas = document.getElementById('waveform-canvas');
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  canvas.width = 300 * dpr;
  canvas.height = 300 * dpr;
  ctx.scale(dpr, dpr);
  var cx = 150, cy = 150, bars = 64;
  var barData = new Float32Array(bars);
  var time = 0;

  function draw() {
    if (!state.isRecording) return;
    ctx.clearRect(0, 0, 300, 300);
    time += 0.05;
    for (var i = 0; i < bars; i++) {
      var a = (i / bars) * Math.PI * 2 - Math.PI / 2;
      var noise = Math.sin(time * 3 + i * 0.5) * 0.3 + Math.sin(time * 7 + i * 1.2) * 0.2 + Math.random() * 0.3;
      barData[i] += (Math.max(0.05, Math.abs(noise)) - barData[i]) * 0.3;
      var ir = 52;
      var or = ir + barData[i] * 38;
      var x1 = cx + Math.cos(a) * ir;
      var y1 = cy + Math.sin(a) * ir;
      var x2 = cx + Math.cos(a) * or;
      var y2 = cy + Math.sin(a) * or;
      var al = 0.15 + barData[i] * 0.85;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(184,104,15,' + al.toFixed(2) + ')';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    var grad = ctx.createRadialGradient(cx, cy, 36, cx, cy, 60);
    grad.addColorStop(0, 'rgba(184,104,15,0.05)');
    grad.addColorStop(1, 'rgba(184,104,15,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    waveformAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopWaveform() {
  if (waveformAnim) cancelAnimationFrame(waveformAnim);
  var c = document.getElementById('waveform-canvas');
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 300, 300);
}

document.getElementById('mic-btn').addEventListener('click', function () {
  state.isRecording ? stopRecording() : startRecording();
});

document.getElementById('demo-voice-btn').addEventListener('click', simulateTranscription);

// Buyer voice listeners
var buyerMicBtn = document.getElementById('buyer-mic-btn');
if (buyerMicBtn) buyerMicBtn.addEventListener('click', function () {
  state.isRecording ? stopBuyerRecording() : startBuyerRecording();
});

var buyerDemoBtn = document.getElementById('buyer-demo-btn');
if (buyerDemoBtn) buyerDemoBtn.addEventListener('click', simulateBuyerTranscription);

document.getElementById('publish-btn').addEventListener('click', function () {
  var title = document.getElementById('gen-title').textContent;
  var priceText = document.getElementById('gen-price').textContent;
  var category = document.getElementById('gen-category').textContent.toLowerCase();
  var pm = priceText.match(/₹(\d+)\s*\/\s*(\w+)/);
  var price = pm ? parseInt(pm[1]) : 0;
  var unit = pm ? pm[2] : 'pcs';
  publishProductItem({
    title: title.split(' (')[0],
    titleHi: title.indexOf('(') !== -1 ? (title.match(/\(([^)]+)\)/) || [])[1] || '' : '',
    price: price,
    unit: unit,
    category: category,
    stock: 25
  });
});

// ============================================================
// MANUAL FORM HANDLING
// ============================================================

function switchMode(mode) {
  if (mode === 'voice') {
    document.getElementById('voice-mode').style.display = 'flex';
    document.getElementById('manual-mode').style.display = 'none';
    document.getElementById('mode-voice-btn').style.background = 'var(--accent-light)';
    document.getElementById('mode-voice-btn').style.color = 'var(--accent)';
    document.getElementById('mode-voice-btn').style.borderColor = 'var(--accent)';
    document.getElementById('mode-manual-btn').style.background = 'var(--card)';
    document.getElementById('mode-manual-btn').style.color = 'var(--text2)';
    document.getElementById('mode-manual-btn').style.borderColor = 'transparent';
  } else {
    document.getElementById('voice-mode').style.display = 'none';
    document.getElementById('manual-mode').style.display = 'flex';
    document.getElementById('mode-manual-btn').style.background = 'var(--accent-light)';
    document.getElementById('mode-manual-btn').style.color = 'var(--accent)';
    document.getElementById('mode-manual-btn').style.borderColor = 'var(--accent)';
    document.getElementById('mode-voice-btn').style.background = 'var(--card)';
    document.getElementById('mode-voice-btn').style.color = 'var(--text2)';
    document.getElementById('mode-voice-btn').style.borderColor = 'transparent';
  }
}

document.getElementById('publish-manual-btn').addEventListener('click', function () {
  var title = document.getElementById('manual-title').value.trim();
  var titleHi = document.getElementById('manual-title-hi').value.trim();
  var category = document.getElementById('manual-category').value;
  var price = parseInt(document.getElementById('manual-price').value) || 0;
  var unit = document.getElementById('manual-unit').value;
  var stock = parseInt(document.getElementById('manual-stock').value) || 10;

  if (!title || !category || !price) {
    showToast(__('kripya_sab_details'));
    return;
  }

  publishProductItem({
    title: title,
    titleHi: titleHi,
    price: price,
    unit: unit,
    category: category,
    stock: stock
  });

  // Clear form
  document.getElementById('manual-title').value = '';
  document.getElementById('manual-title-hi').value = '';
  document.getElementById('manual-category').value = '';
  document.getElementById('manual-price').value = '';
  document.getElementById('manual-unit').value = 'pcs';
  document.getElementById('manual-stock').value = '10';
});

// Publish product to feed
function publishProductItem(itemData) {
  state.productFeed.unshift({
    id: Date.now(),
    title: itemData.title,
    titleHi: itemData.titleHi || '',
    price: itemData.price,
    unit: itemData.unit,
    seller: state.sellerId || 'neeta',
    category: itemData.category,
    stock: itemData.stock
  });
  showToast(__('item_published'));
  document.getElementById('generated-listing').style.display = 'none';
  document.getElementById('transcription-area').style.display = 'none';
  document.getElementById('ai-status').style.display = 'none';
  document.getElementById('transcription-text').textContent = '';
  document.querySelectorAll('.listing-field').forEach(function (f) { f.classList.remove('visible'); });
  setTimeout(function () {
    navigateTo(state.userRole === 'seller' ? 'seller-dashboard' : 'feed');
  }, 600);
  if (state.currentView === 'seller-dashboard') renderSellerDashboard();
  else renderFeed();
}
