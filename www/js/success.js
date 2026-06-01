// ============================================================
// SUCCESS MODAL — Sauda
// ============================================================

async function confirmOrder(pid) {
  var qtyEl = document.getElementById('qty-display-' + pid);
  var qty = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;

  closeSellerModal();
  closeProductModal();
  var prod = PRODUCTS.find(function (p) { return p.id == pid; });
  if (!prod) prod = state.productFeed.find(function (p) { return p.id == pid; });
  if (!prod) return;

  var seller = getSellerRecord(prod.seller);
  var total = prod.price * qty;

  try {
    if (state.userId) {
      await API.placeOrder(prod.id, state.userId);
    }
  } catch (e) {
    console.warn('Order persistence failed, keeping local order only:', e);
  }

  addOrder(prod, seller, qty, total);

  document.getElementById('success-product-title').textContent = (qty > 1 ? qty + 'x ' : '') + prod.title;
  document.getElementById('success-seller-name').textContent = seller.shop;
  document.getElementById('success-price').textContent = '\u20B9' + total;
  var v = getCategoryVisual(prod.category);
  var imgEl = document.getElementById('success-product-img');
  var imgFile = PRODUCT_IMAGES[prod.id];
  if (imgFile) {
    imgEl.style.background = '';
    imgEl.innerHTML = '<img src="images/' + imgFile + '" style="width:100%;height:100%;object-fit:cover;border-radius:12px;display:block" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
      '<div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:' + v.bg + ';border-radius:12px"><i class="fa-solid ' + v.icon + '" style="font-size:24px;color:' + v.color + ';opacity:0.8"></i></div>';
  } else {
    imgEl.style.backgroundImage = '';
    imgEl.style.background = v.bg;
    imgEl.innerHTML = '<i class="fa-solid ' + v.icon + '" style="font-size:24px;color:' + v.color + ';opacity:0.8"></i>';
  }

  document.getElementById('success-modal').classList.add('show');

  setTimeout(function () {
    document.getElementById('success-icon-wrap').style.transform = 'scale(1.15) rotate(5deg)';
    document.getElementById('success-icon-wrap').style.opacity = '1';
    setTimeout(function () {
      document.getElementById('success-icon-wrap').style.transform = 'scale(1) rotate(0deg)';
    }, 250);
  }, 50);

  setTimeout(function () { document.getElementById('success-title').style.opacity = '1'; }, 100);
  setTimeout(function () { document.getElementById('success-title').style.transform = 'translateY(0)'; }, 100);

  setTimeout(function () { document.querySelector('#success-modal p').style.opacity = '1'; }, 200);
  setTimeout(function () { document.querySelector('#success-modal p').style.transform = 'translateY(0)'; }, 200);

  setTimeout(function () { document.getElementById('success-card').style.opacity = '1'; }, 300);
  setTimeout(function () { document.getElementById('success-card').style.transform = 'translateY(0)'; }, 300);

  setTimeout(function () { document.getElementById('success-btn').style.opacity = '1'; }, 400);
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.remove('show');
  setTimeout(function () {
    document.getElementById('success-icon-wrap').style.transform = 'scale(0)';
    document.getElementById('success-icon-wrap').style.opacity = '0';
    ['success-title', 'success-card', 'success-btn'].forEach(function (id) {
      document.getElementById(id).style.opacity = '0';
      if (id !== 'success-btn') document.getElementById(id).style.transform = 'translateY(10px)';
    });
    document.querySelector('#success-modal p').style.opacity = '0';
    document.querySelector('#success-modal p').style.transform = 'translateY(10px)';
  }, 200);
}
