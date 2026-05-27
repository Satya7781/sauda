var recognition = null;
var buyerRecognition = null;
var sellerWaveformAnim = null;
var buyerWaveformAnim = null;
var voiceOverlayReady = false;

var SPEECH_LANG_MAP = {
  hi: 'hi-IN', en: 'en-IN', mr: 'mr-IN', bn: 'bn-IN', ta: 'ta-IN',
  te: 'te-IN', gu: 'gu-IN', pa: 'pa-IN', kn: 'kn-IN', ml: 'ml-IN',
  or: 'or-IN', ur: 'ur-IN', as: 'as-IN', ks: 'ks-IN', kok: 'kok-IN',
  mai: 'mai-IN', sd: 'sd-IN', ne: 'ne-NP', sa: 'sa-IN', sat: 'sat-IN',
  brx: 'brx-IN', doi: 'doi-IN'
};

function getSpeechLanguageCode() {
  return SPEECH_LANG_MAP[state.userLang] || 'hi-IN';
}

function getVoiceMode() {
  var overlay = document.getElementById('voice-overlay');
  return overlay ? overlay.getAttribute('data-voice-mode') || state.userRole || 'buyer' : state.userRole || 'buyer';
}

function openVoiceOverlay(role) {
  var overlay = document.getElementById('voice-overlay');
  if (!overlay) return;
  var mode = role || state.userRole || 'buyer';
  overlay.setAttribute('data-voice-mode', mode);
  var sellerSection = document.getElementById('voice-ol-seller');
  var buyerSection = document.getElementById('voice-ol-buyer');
  if (sellerSection) sellerSection.style.display = mode === 'seller' ? 'flex' : 'none';
  if (buyerSection) buyerSection.style.display = mode === 'buyer' ? 'flex' : 'none';
  resetVoiceOverlayUI(mode);
  if (mode === 'seller') initVoice();
  else initBuyerVoice();
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeVoiceOverlay() {
  var overlay = document.getElementById('voice-overlay');
  if (!overlay) return;
  if (state.isRecording) {
    var mode = getVoiceMode();
    if (mode === 'seller') stopRecording();
    else stopBuyerRecording();
  }
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  if (recognition) { try { recognition.abort(); } catch(e) {} recognition = null; }
  if (buyerRecognition) { try { buyerRecognition.abort(); } catch(e) {} buyerRecognition = null; }
}

function resetVoiceOverlayUI(mode) {
  state.isRecording = false;
  if (mode === 'seller') {
    var micBtn = document.getElementById('voice-ol-mic-btn');
    if (micBtn) { micBtn.classList.remove('recording'); micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>'; }
    var hintEl = document.getElementById('voice-ol-hint');
    if (hintEl) hintEl.textContent = __('mic_hint');
    var taEl = document.getElementById('voice-ol-ta');
    if (taEl) taEl.style.display = 'none';
    var aiEl = document.getElementById('voice-ol-ai');
    if (aiEl) aiEl.style.display = 'none';
    var genEl = document.getElementById('voice-ol-gen');
    if (genEl) genEl.style.display = 'none';
    var tEl = document.getElementById('voice-ol-tt');
    if (tEl) tEl.textContent = '';
    stopWaveform();
    var modeVoice = document.getElementById('voice-ol-mode');
    var modeManual = document.getElementById('voice-ol-manual');
    if (modeVoice) modeVoice.style.display = 'flex';
    if (modeManual) modeManual.style.display = 'none';
    document.querySelectorAll('.voice-ol-field').forEach(function(f) { f.classList.remove('visible'); });
  } else {
    var micBtn = document.getElementById('voice-ol-buyer-mic-btn');
    if (micBtn) { micBtn.classList.remove('recording'); micBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>'; }
    var hintEl = document.getElementById('voice-ol-buyer-hint');
    if (hintEl) hintEl.textContent = __('mic_hint');
    var taEl = document.getElementById('voice-ol-buyer-ta');
    if (taEl) taEl.style.display = 'none';
    var aiEl = document.getElementById('voice-ol-buyer-ai');
    if (aiEl) aiEl.style.display = 'none';
    var srEl = document.getElementById('voice-ol-buyer-results');
    if (srEl) srEl.style.display = 'none';
    var tEl = document.getElementById('voice-ol-buyer-tt');
    if (tEl) tEl.textContent = '';
    stopBuyerWaveform();
  }
}

function initVoice() {
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
    recognition = null;
  }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    recognition = new SR();
    recognition.lang = getSpeechLanguageCode();
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = function (e) {
      var t = '';
      for (var i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      var el = document.getElementById('voice-ol-tt');
      if (el) el.textContent = t;
    };
    recognition.onend = function () {
      if (state.isRecording) {
        state.isRecording = false;
        stopRecording();
      }
    };
    recognition.onerror = function (e) {
      console.warn('Voice recognition error:', e);
      if (state.isRecording) {
        state.isRecording = false;
        stopRecording();
        var hintEl = document.getElementById('voice-ol-hint');
        if (e.error === 'not-allowed') {
          if (hintEl) hintEl.textContent = __('mic_denied');
        } else if (e.error === 'no-speech') {
          if (hintEl) hintEl.textContent = __('mic_no_speech');
        } else if (e.error === 'aborted') {
          return;
        } else {
          if (hintEl) hintEl.textContent = __('mic_error');
        }
      }
    };
  } else {
    var hintEl = document.getElementById('voice-ol-hint');
    if (hintEl) hintEl.textContent = __('mic_not_supported');
  }
}

function initBuyerVoice() {
  if (buyerRecognition) {
    try { buyerRecognition.abort(); } catch(e) {}
    buyerRecognition = null;
  }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    buyerRecognition = new SR();
    buyerRecognition.lang = getSpeechLanguageCode();
    buyerRecognition.interimResults = true;
    buyerRecognition.continuous = false;
    buyerRecognition.maxAlternatives = 1;
    buyerRecognition.onresult = function (e) {
      var t = '';
      for (var i = 0; i < e.results.length; i++) {
        t += e.results[i][0].transcript;
      }
      var el = document.getElementById('voice-ol-buyer-tt');
      if (el) el.textContent = t;
    };
    buyerRecognition.onend = function () {
      if (state.isRecording) {
        state.isRecording = false;
        stopBuyerRecording();
      }
    };
    buyerRecognition.onerror = function (e) {
      console.warn('Buyer voice recognition error:', e);
      if (state.isRecording) {
        state.isRecording = false;
        stopBuyerRecording();
        var hintEl = document.getElementById('voice-ol-buyer-hint');
        if (e.error === 'not-allowed') {
          if (hintEl) hintEl.textContent = __('mic_denied');
        } else if (e.error === 'no-speech') {
          if (hintEl) hintEl.textContent = __('mic_no_speech');
        } else if (e.error === 'aborted') {
          return;
        } else {
          if (hintEl) hintEl.textContent = __('mic_error');
        }
      }
    };
  } else {
    var hintEl = document.getElementById('voice-ol-buyer-hint');
    if (hintEl) hintEl.textContent = __('mic_not_supported');
  }
}

function startRecording() {
  state.isRecording = true;
  var btn = document.getElementById('voice-ol-mic-btn');
  if (btn) {
    btn.classList.add('recording');
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  }
  var hintEl = document.getElementById('voice-ol-hint');
  if (hintEl) hintEl.textContent = __('sun_raha_hoon');
  var taEl = document.getElementById('voice-ol-ta');
  if (taEl) taEl.style.display = 'none';
  var aiEl = document.getElementById('voice-ol-ai');
  if (aiEl) aiEl.style.display = 'none';
  var genEl = document.getElementById('voice-ol-gen');
  if (genEl) genEl.style.display = 'none';
  var tEl = document.getElementById('voice-ol-tt');
  if (tEl) tEl.textContent = '';
  startWaveform();
  if (recognition) {
    try { recognition.start(); } catch (e) {
      initVoice();
      setTimeout(function() {
        if (recognition) try { recognition.start(); } catch(e2) {}
      }, 100);
    }
  }
}

function stopRecording() {
  state.isRecording = false;
  var btn = document.getElementById('voice-ol-mic-btn');
  if (btn) {
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  }
  var hintEl = document.getElementById('voice-ol-hint');
  if (hintEl) hintEl.textContent = __('mic_hint');
  stopWaveform();
  if (recognition) { try { recognition.stop(); } catch(e) {} }
  var tEl = document.getElementById('voice-ol-tt');
  var t = tEl ? tEl.textContent.trim() : '';
  if (t) {
    var taEl = document.getElementById('voice-ol-ta');
    if (taEl) taEl.style.display = 'block';
    processWithAI(t);
  } else {
    if (hintEl) hintEl.textContent = __('bol_kuchh');
  }
}

function startBuyerRecording() {
  state.isRecording = true;
  var btn = document.getElementById('voice-ol-buyer-mic-btn');
  if (btn) {
    btn.classList.add('recording');
    btn.innerHTML = '<i class="fa-solid fa-stop"></i>';
  }
  var hintEl = document.getElementById('voice-ol-buyer-hint');
  if (hintEl) hintEl.textContent = __('sun_raha_hoon');
  var taEl = document.getElementById('voice-ol-buyer-ta');
  if (taEl) taEl.style.display = 'none';
  var aiEl = document.getElementById('voice-ol-buyer-ai');
  if (aiEl) aiEl.style.display = 'none';
  var srEl = document.getElementById('voice-ol-buyer-results');
  if (srEl) srEl.style.display = 'none';
  var tEl = document.getElementById('voice-ol-buyer-tt');
  if (tEl) tEl.textContent = '';
  startBuyerWaveform();
  if (buyerRecognition) {
    try { buyerRecognition.start(); } catch (e) {
      initBuyerVoice();
      setTimeout(function() {
        if (buyerRecognition) try { buyerRecognition.start(); } catch(e2) {}
      }, 100);
    }
  }
}

function stopBuyerRecording() {
  state.isRecording = false;
  var btn = document.getElementById('voice-ol-buyer-mic-btn');
  if (btn) {
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
  }
  var hintEl = document.getElementById('voice-ol-buyer-hint');
  if (hintEl) hintEl.textContent = __('mic_hint');
  stopBuyerWaveform();
  if (buyerRecognition) { try { buyerRecognition.stop(); } catch(e) {} }
  var tEl = document.getElementById('voice-ol-buyer-tt');
  var t = tEl ? tEl.textContent.trim() : '';
  if (t) {
    var taEl = document.getElementById('voice-ol-buyer-ta');
    if (taEl) taEl.style.display = 'block';
    searchByVoice(t);
  } else {
    if (hintEl) hintEl.textContent = __('bol_kuchh');
  }
}

function processWithAI(t) {
  var st = document.getElementById('voice-ol-ai');
  if (st) st.style.display = 'block';
  var at = document.getElementById('voice-ol-ai-text');
  setTimeout(function () {
    if (at) at.innerHTML = __('listing_taiyaar')+'<span class="thinking-dot">.</span><span class="thinking-dot">.</span><span class="thinking-dot">.</span>';
  }, 1200);
  setTimeout(function () {
    if (st) st.style.display = 'none';
    showGeneratedListing(t);
  }, 2600);
}

function showGeneratedListing(t) {
  var ext = extractFromSpeech(t);
  var catEl = document.getElementById('voice-ol-gen-cat');
  if (catEl) {
    catEl.textContent = ext.category.toUpperCase();
    var catObj = CATEGORIES.find(function (c) { return c.id === ext.category; }) || {};
    catEl.style.background = catObj.bg || 'var(--accent-light)';
    catEl.style.color = catObj.color || 'var(--accent)';
  }
  var titleEl = document.getElementById('voice-ol-gen-title');
  if (titleEl) titleEl.textContent = ext.title + (ext.titleHi ? ' (' + ext.titleHi + ')' : '');
  var priceEl = document.getElementById('voice-ol-gen-price');
  if (priceEl) priceEl.textContent = '\u20B9' + ext.price + ' / ' + ext.unit;
  var stockEl = document.getElementById('voice-ol-gen-stock');
  if (stockEl) stockEl.textContent = ext.stock + __('available');
  var genEl = document.getElementById('voice-ol-gen');
  if (genEl) genEl.style.display = 'block';
  document.querySelectorAll('.voice-ol-field').forEach(function (f) {
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
  var titleEn = '';
  var titleHi = '';
  var category = 'kirana';
  if (t.indexOf('saree') !== -1 || t.indexOf('sadi') !== -1) { title = 'Banarasi Silk Saree'; titleEn = 'Banarasi Silk Saree'; titleHi = 'Banarasi Saree'; category = 'clothes'; price = price || 2500; }
  else if (t.indexOf('kurta') !== -1) { title = 'Cotton Kurta'; titleEn = 'Cotton Kurta'; titleHi = 'Suthan Kurta'; category = 'clothes'; price = price || 450; }
  else if (t.indexOf('suit') !== -1 || t.indexOf('anarkali') !== -1) { title = 'Anarkali Suit'; titleEn = 'Anarkali Suit'; titleHi = 'Anarkali Suit'; category = 'clothes'; price = price || 1200; }
  else if (t.indexOf('dupatta') !== -1) { title = 'Designer Dupatta'; titleEn = 'Designer Dupatta'; titleHi = 'Designar Dupatta'; category = 'clothes'; price = price || 350; }
  else if (t.indexOf('lehenga') !== -1) { title = 'Designer Lehenga'; titleEn = 'Designer Lehenga'; titleHi = 'Designar Lehenga'; category = 'clothes'; price = price || 3500; }
  else if (t.indexOf('blouse') !== -1 || t.indexOf('stitching') !== -1 || t.indexOf('silai') !== -1) { title = 'Custom Blouse Stitching'; titleEn = 'Custom Blouse Stitching'; titleHi = 'Blouse Silai'; category = 'clothes'; price = price || 250; }
  else if (t.indexOf('palazzo') !== -1) { title = 'Palazzo Set'; titleEn = 'Palazzo Set'; titleHi = 'Palajo Set'; category = 'clothes'; price = price || 600; }
  else if (t.indexOf('palak') !== -1 || t.indexOf('spinach') !== -1) { title = 'Fresh Palak'; titleEn = 'Fresh Spinach'; titleHi = 'Taza Palak'; category = 'sabzi'; price = price || 20; }
  else if (t.indexOf('gobi') !== -1 || t.indexOf('cabbage') !== -1) { title = 'Gobi'; titleEn = 'Cauliflower'; titleHi = 'Bandh Gobi'; category = 'sabzi'; price = price || 40; }
  else if (t.indexOf('tamatar') !== -1 || t.indexOf('tomato') !== -1) { title = 'Tamatar'; titleEn = 'Tomatoes'; titleHi = 'Desi Tamatar'; category = 'sabzi'; price = price || 30; }
  else if (t.indexOf('doodh') !== -1 || t.indexOf('milk') !== -1) { title = 'Doodh'; titleEn = 'Milk'; titleHi = 'Taza Doodh'; category = 'dairy'; price = price || 60; }
  else if (t.indexOf('dahi') !== -1) { title = 'Dahi'; titleEn = 'Yogurt'; titleHi = 'Makhan Dahi'; category = 'dairy'; price = price || 50; }
  else if (t.indexOf('paneer') !== -1) { title = 'Paneer'; titleEn = 'Paneer'; titleHi = 'Taza Paneer'; category = 'dairy'; price = price || 90; }
  else if (t.indexOf('atta') !== -1 || t.indexOf('flour') !== -1) { title = 'Atta'; titleEn = 'Aashirvaad Atta'; titleHi = 'Aashirvaad Atta'; category = 'kirana'; price = price || 45; }
  else if (t.indexOf('aam') !== -1 || t.indexOf('mango') !== -1) { title = 'Aam'; titleEn = 'Mango'; titleHi = 'Ratnagiri Aam'; category = 'fruit'; price = price || 80; }
  else if (t.indexOf('kela') !== -1 || t.indexOf('banana') !== -1) { title = 'Kela'; titleEn = 'Banana'; titleHi = 'Bhuvel Kela'; category = 'fruit'; price = price || 40; }
  else if (t.indexOf('mobile') !== -1 || t.indexOf('cover') !== -1 || t.indexOf('earphone') !== -1) { title = 'Mobile Accessories'; titleEn = 'Mobile Accessories'; titleHi = 'Mobile Saman'; category = 'electronics'; price = price || 299; }
  else if (t.indexOf('mehendi') !== -1 || t.indexOf('facial') !== -1 || t.indexOf('beauty') !== -1) { title = 'Beauty Service'; titleEn = 'Beauty Service'; titleHi = 'Beauty Seva'; category = 'beauty'; price = price || 300; }
  else if (t.indexOf('repair') !== -1 || t.indexOf('plumbing') !== -1 || t.indexOf('ac') !== -1) { title = 'Repair Service'; titleEn = 'Repair Service'; titleHi = 'Repair Seva'; category = 'services'; price = price || 500; }
  else {
    var words = text.split(/\s+/).filter(function (w) { return !w.match(/[₹\d]/); });
    if (words.length > 0) title = words.slice(0, 2).join(' ');
  }
  if (!price) price = Math.floor(Math.random() * 500) + 50;
  return { title: title, titleEn: titleEn || title, titleHi: titleHi, price: price, unit: unit, category: category, stock: Math.floor(Math.random() * 25) + 5 };
}

function searchByVoice(text) {
  var st = document.getElementById('voice-ol-buyer-ai');
  if (st) st.style.display = 'block';
  setTimeout(function () {
    if (st) st.style.display = 'none';
    var results = filterProductsByText(text);
    showVoiceSearchResults(results, text);
  }, 1200);
}

function filterProductsByText(text) {
  var t = text.toLowerCase();
  var fullFeed = state._originalFeed && state._originalFeed.length ? state._originalFeed : (state.productFeed && state.productFeed.length ? state.productFeed : (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []));
  return fullFeed.filter(function (p) {
    var title = (p.title || '').toLowerCase();
    var titleHi = (p.titleHi || '').toLowerCase();
    var cat = (p.category || '').toLowerCase();
    return title.indexOf(t) !== -1 || titleHi.indexOf(t) !== -1 || cat.indexOf(t) !== -1 || t.indexOf(cat) !== -1;
  });
}

function showVoiceSearchResults(products, query) {
  var container = document.getElementById('voice-ol-buyer-list');
  var section = document.getElementById('voice-ol-buyer-results');
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
      return '<div class="s-card p-4 mb-3 flex items-center gap-4" onclick="closeVoiceOverlay();openProductDetail(\'' + p.id + '\')">' +
        '<div class="w-14 h-14 rounded-xl flex items-center justify-center text-lg" style="background:var(--accent-light);color:var(--accent)"><i class="fa-solid ' + icon + '"></i></div>' +
        '<div class="flex-1 min-w-0"><p class="text-sm font-bold truncate">' + getProductTitle(p) + '</p>' +
        '<p class="text-xs" style="color:var(--text3)">' + sellerName + '</p></div>' +
        '<div class="text-right"><p class="text-base font-extrabold" style="color:var(--accent);font-family:\'Space Grotesk\',sans-serif">\u20B9' + p.price + '</p>' +
        '<p class="text-[10px]" style="color:var(--text3)">' + (p.unit || 'pcs') + '</p></div></div>';
    }).join('');
  }
  section.style.display = 'block';
}

function startWaveform() {
  var canvas = document.getElementById('voice-ol-wave');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  var w = rect.width || 200;
  var h = rect.height || 200;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  var cx = w / 2, cy = h / 2, bars = 48;
  var barData = new Float32Array(bars);
  var time = 0;
  function draw() {
    if (!state.isRecording) return;
    ctx.clearRect(0, 0, w, h);
    time += 0.05;
    for (var i = 0; i < bars; i++) {
      var a = (i / bars) * Math.PI * 2 - Math.PI / 2;
      var noise = Math.sin(time * 3 + i * 0.5) * 0.3 + Math.sin(time * 7 + i * 1.2) * 0.2 + Math.random() * 0.3;
      barData[i] += (Math.max(0.05, Math.abs(noise)) - barData[i]) * 0.3;
      var ir = 30;
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
    var grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 40);
    grad.addColorStop(0, 'rgba(184,104,15,0.05)');
    grad.addColorStop(1, 'rgba(184,104,15,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    sellerWaveformAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopWaveform() {
  if (sellerWaveformAnim) cancelAnimationFrame(sellerWaveformAnim);
  var c = document.getElementById('voice-ol-wave');
  if (c) {
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
  }
}

function startBuyerWaveform() {
  var canvas = document.getElementById('voice-ol-buyer-wave');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var rect = canvas.getBoundingClientRect();
  var w = rect.width || 200;
  var h = rect.height || 200;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  var cx = w / 2, cy = h / 2, bars = 48;
  var barData = new Float32Array(bars);
  var time = 0;
  function draw() {
    if (!state.isRecording) return;
    ctx.clearRect(0, 0, w, h);
    time += 0.05;
    for (var i = 0; i < bars; i++) {
      var a = (i / bars) * Math.PI * 2 - Math.PI / 2;
      var noise = Math.sin(time * 3 + i * 0.5) * 0.3 + Math.sin(time * 7 + i * 1.2) * 0.2 + Math.random() * 0.3;
      barData[i] += (Math.max(0.05, Math.abs(noise)) - barData[i]) * 0.3;
      var ir = 30;
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
    var grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 40);
    grad.addColorStop(0, 'rgba(0,150,200,0.05)');
    grad.addColorStop(1, 'rgba(0,150,200,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    buyerWaveformAnim = requestAnimationFrame(draw);
  }
  draw();
}

function stopBuyerWaveform() {
  if (buyerWaveformAnim) cancelAnimationFrame(buyerWaveformAnim);
  var c = document.getElementById('voice-ol-buyer-wave');
  if (c) {
    var ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
  }
}

function switchMode(mode) {
  var voiceMode = document.getElementById('voice-ol-mode');
  var manualMode = document.getElementById('voice-ol-manual');
  var voiceBtn = document.getElementById('voice-ol-mode-btn');
  var manualBtn = document.getElementById('voice-ol-manual-btn');
  if (mode === 'voice') {
    if (voiceMode) voiceMode.style.display = 'flex';
    if (manualMode) manualMode.style.display = 'none';
    if (voiceBtn) { voiceBtn.style.background = 'var(--accent-light)'; voiceBtn.style.color = 'var(--accent)'; voiceBtn.style.borderColor = 'var(--accent)'; }
    if (manualBtn) { manualBtn.style.background = 'var(--card)'; manualBtn.style.color = 'var(--text2)'; manualBtn.style.borderColor = 'transparent'; }
  } else {
    if (voiceMode) voiceMode.style.display = 'none';
    if (manualMode) manualMode.style.display = 'flex';
    if (manualBtn) { manualBtn.style.background = 'var(--accent-light)'; manualBtn.style.color = 'var(--accent)'; manualBtn.style.borderColor = 'var(--accent)'; }
    if (voiceBtn) { voiceBtn.style.background = 'var(--card)'; voiceBtn.style.color = 'var(--text2)'; voiceBtn.style.borderColor = 'transparent'; }
  }
}

function handlePublishManual() {
  var title = document.getElementById('voice-ol-manual-title').value.trim();
  var titleHi = document.getElementById('voice-ol-manual-title-hi').value.trim();
  var category = document.getElementById('voice-ol-manual-cat').value;
  var price = parseInt(document.getElementById('voice-ol-manual-price').value) || 0;
  var unit = document.getElementById('voice-ol-manual-unit').value;
  var stock = parseInt(document.getElementById('voice-ol-manual-stock').value) || 10;
  if (!title || !category || !price) {
    showToast(__('kripya_sab_details'));
    return;
  }
  publishProductItem({
    title: title, titleHi: titleHi, price: price, unit: unit, category: category, stock: stock
  });
  document.getElementById('voice-ol-manual-title').value = '';
  document.getElementById('voice-ol-manual-title-hi').value = '';
  document.getElementById('voice-ol-manual-cat').value = '';
  document.getElementById('voice-ol-manual-price').value = '';
  document.getElementById('voice-ol-manual-unit').value = 'pcs';
  document.getElementById('voice-ol-manual-stock').value = '10';
}

function publishProductItem(itemData) {
  state.productFeed.unshift({
    id: Date.now(), title: itemData.title, titleEn: itemData.titleEn || itemData.title,
    titleHi: itemData.titleHi || '', price: itemData.price, unit: itemData.unit,
    seller: state.sellerId || 'neeta', category: itemData.category, stock: itemData.stock
  });
  showToast(__('item_published'));
  closeVoiceOverlay();
  setTimeout(function () {
    navigateTo(state.userRole === 'seller' ? 'seller-dashboard' : 'feed');
  }, 600);
  if (state.currentView === 'seller-dashboard') renderSellerDashboard();
  else renderFeed();
}

function initVoiceSection() {
  if (!voiceOverlayReady) {
    setupVoiceOverlayEvents();
    voiceOverlayReady = true;
  }
}

function setupVoiceOverlayEvents() {
  var closeBtn = document.getElementById('voice-ol-close');
  if (closeBtn) closeBtn.addEventListener('click', closeVoiceOverlay);

  var overlay = document.getElementById('voice-overlay');
  if (overlay) overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeVoiceOverlay();
  });

  var micBtn = document.getElementById('voice-ol-mic-btn');
  if (micBtn) micBtn.addEventListener('click', function () {
    state.isRecording ? stopRecording() : startRecording();
  });

  var publishBtn = document.getElementById('voice-ol-publish-btn');
  if (publishBtn) publishBtn.addEventListener('click', function () {
    var titleEl = document.getElementById('voice-ol-gen-title');
    var priceEl = document.getElementById('voice-ol-gen-price');
    var catEl = document.getElementById('voice-ol-gen-cat');
    var title = titleEl ? titleEl.textContent : '';
    var priceText = priceEl ? priceEl.textContent : '';
    var category = catEl ? catEl.textContent.toLowerCase() : '';
    var pm = priceText.match(/₹(\d+)\s*\/\s*(\w+)/);
    var price = pm ? parseInt(pm[1]) : 0;
    var unit = pm ? pm[2] : 'pcs';
    publishProductItem({
      title: title.split(' (')[0], titleEn: title.split(' (')[0],
      titleHi: title.indexOf('(') !== -1 ? (title.match(/\(([^)]+)\)/) || [])[1] || '' : '',
      price: price, unit: unit, category: category, stock: 25
    });
  });

  var buyerMicBtn = document.getElementById('voice-ol-buyer-mic-btn');
  if (buyerMicBtn) buyerMicBtn.addEventListener('click', function () {
    state.isRecording ? stopBuyerRecording() : startBuyerRecording();
  });

  var modeVoiceBtn = document.getElementById('voice-ol-mode-btn');
  if (modeVoiceBtn) modeVoiceBtn.addEventListener('click', function () { switchMode('voice'); });

  var modeManualBtn = document.getElementById('voice-ol-manual-btn');
  if (modeManualBtn) modeManualBtn.addEventListener('click', function () { switchMode('manual'); });

  var publishManualBtn = document.getElementById('voice-ol-publish-manual-btn');
  if (publishManualBtn) publishManualBtn.addEventListener('click', handlePublishManual);
}
