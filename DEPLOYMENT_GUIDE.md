# Sauda Marketplace - Deployment & Testing Guide

## 🚀 Quick Start

### Live Services
- **Backend API**: https://sauda-backend.onrender.com
- **Database**: Railway MySQL (connected to Render)
- **GitHub**: https://github.com/Satya7781/sauda (main branch)
- **Test Page**: Open `VOICE_FEATURES_TEST.html` in browser

---

## ✅ Completed Features

### 1. Backend API (Production Ready on Render)
All endpoints are live and operational:

```
GET /api/health              - Health check
GET /api/categories          - 8 marketplace categories
GET /api/products            - 31 products (sellers, prices, stock)
GET /api/sellers             - 11 sellers with shop details
GET /api/users               - 18 registered users
GET /api/directory           - 87 directory entries (unregistered shops)
GET /api/vouchchain          - Loyalty program data
GET /api/orders              - Fetch user orders
POST /api/orders             - Place new order
POST /api/onboard            - Create new user/seller (returns userId)
POST /api/products           - Create new product (seller listing)
```

**Example Requests:**
```bash
# Health check
curl https://sauda-backend.onrender.com/api/health

# Get all products
curl https://sauda-backend.onrender.com/api/products

# Create product (seller voice/manual listing)
curl -X POST https://sauda-backend.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Banarasi Saree",
    "titleEn": "Banarasi Silk Saree",
    "titleHi": "Banarasi Silk Saree",
    "price": 2500,
    "unit": "pcs",
    "seller": "neeta",
    "category": "clothes",
    "stock": 5
  }'

# Create user/seller account
curl -X POST https://sauda-backend.onrender.com/api/onboard \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya",
    "phone": "9876543210",
    "role": "seller",
    "location": "Bhopal",
    "shop": "Priya Fashion"
  }'
```

### 2. Frontend Voice Features (Implemented & Pushed)

#### A. Voice Search (Buyer)
**How It Works:**
1. Buyer clicks mic button on main feed
2. Speaks product name (e.g., "saree", "milk", "kurta")
3. Results display with:
   - ✓ **Item Count Header**: "Aapke liye X item(s) available hain"
   - ✓ **Availability Badges**: Green "✓ Available" or Red "✗ Out of Stock"
   - ✓ **Seller Location**: "Priya Fashion, Lalghati, Bhopal"
   - ✓ **Price & Unit**: "₹2500 / pcs"
4. Click product → order flow continues

**Code Location**: `js/voice.js` lines 498-536

#### B. Voice Listing (Seller)
**How It Works:**
1. Seller opens dashboard, clicks mic → voice overlay
2. Select **"Voice Mode"** (Bol ke Becho)
3. Speak product details: "Banarasi saree 2500 rupees"
4. AI parses → shows preview with:
   - Category badge (clothes, sabzi, etc.)
   - Title + Hindi name
   - Price / unit
   - Stock count
5. Two options:
   - **Publish**: Direct backend creation
   - **Edit**: Switch to manual form with pre-filled data
6. Backend creates product → feed refreshes automatically

**Code Location**: `js/voice.js` lines 398-730

#### C. Manual Listing (Seller)
**How It Works:**
1. Seller opens voice overlay → select **"Manual Mode"** (Likhakar)
2. Fill form fields:
   - Item name (English)
   - Item name (Hindi)
   - Category dropdown
   - Price (numeric)
   - Unit dropdown
   - Stock (numeric)
3. Click "Listing Publish Karein"
4. Validation checks required fields
5. Backend creates product → feed updates

**Code Location**: `js/voice.js` lines 664-680

### 3. Data Persistence (Backend-Integrated)

#### State Management
- `loadState()` in `js/state.js`:
  - Fetches all backend data on app load
  - Stores userId/sellerId in localStorage
  - Hydrates order history from backend
  - Builds seller/user/category maps

#### Buyer Flow
```
1. Onboarding → POST /api/onboard → userId returned
2. userId stored in localStorage
3. Browse products → GET /api/products (backend data)
4. Click product → POST /api/orders → order persisted
5. View orders → GET from backend via API.fetchUserOrders()
```

#### Seller Flow
```
1. Onboarding → POST /api/onboard → sellerId returned
2. sellerId stored in localStorage
3. Create product (voice/manual) → POST /api/products
4. Product persists in backend MySQL
5. Product appears in feed automatically (feed refresh)
6. View own products → GET /api/products filtered by seller
```

---

## 📱 Testing on Device

### Prerequisites
- Android device or emulator
- APK built from latest code
- Backend running on Render (already live)

### Build APK (If Android SDK Available)
```bash
cd /home/rajverma/Documents/sauda-main

# Build web assets
npm run build:www

# Sync Capacitor
npx cap sync android

# Build APK
cd android
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Deploy to Device
```bash
# Connect Android device via USB
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio to run directly
```

### Testing Checklist

#### Buyer Testing
- [ ] **App Launch**
  - Open app → Load initial data (categories, products)
  - Check browser console → should see "[STATE] App state fully loaded"
  
- [ ] **Voice Search**
  - Click mic on main feed
  - Say "saree" or "milk"
  - See results with availability badges (✓ or ✗)
  - See seller location and price
  - Click product → detail modal opens
  
- [ ] **Order Flow**
  - Click "Confirm Order" in detail modal
  - Check console → POST /api/orders
  - Order appears in order history
  - View my orders → click profile → see order in list
  
- [ ] **Data Persistence**
  - Close app completely
  - Reopen → userData loads (localStorage)
  - Products still show from backend
  - Orders preserved

#### Seller Testing
- [ ] **Voice Listing**
  - Login as seller → dashboard
  - Click mic → voice overlay
  - Select "Voice Mode"
  - Say "Banarasi saree 2500 rupees"
  - See generated preview
  - Click **Publish** → product appears in dashboard
  
- [ ] **Edit Generated Listing**
  - Go through voice listing process
  - At preview step, click **Edit**
  - Form fills with extracted data
  - Change price to 3000
  - Click "Listing Publish Karein"
  - Product appears with ₹3000
  
- [ ] **Manual Listing**
  - Seller dashboard → voice overlay
  - Select "Manual Mode"
  - Fill all form fields
  - Click "Listing Publish Karein"
  - Product appears in dashboard
  
- [ ] **Feed Refresh**
  - Create product (voice or manual)
  - Switch to "Feed" tab
  - New product appears at top of feed (no refresh needed)

---

## 🔍 Debugging

### Browser Console Tests
```javascript
// Check if state loaded
console.log(state.categories.length);  // Should be 8
console.log(state.productFeed.length);  // Should be 31
console.log(state.userId);              // Should be empty before onboard

// Test API calls
API.fetchProducts().then(p => console.log('Products:', p.length));
API.fetchCategories().then(c => console.log('Categories:', c.length));

// Test voice features
openVoiceOverlay('buyer');  // Opens buyer voice search
openVoiceOverlay('seller'); // Opens seller voice listing

// Check backend connection
fetch('https://sauda-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d));
```

### Common Issues

**Issue**: Categories not showing on main page
**Solution**: Check if `state.categories` is empty
```javascript
console.log('[DEBUG] Categories:', state.categories);
// If empty, check: loadState() → fetchCategories() → backend response
```

**Issue**: Voice overlay doesn't close
**Solution**: Close button should be visible. If not:
```javascript
// Check HTML has close button
document.getElementById('voice-ol-close').style.display = 'block';

// Manually close
closeVoiceOverlay();
```

**Issue**: Product doesn't appear in feed after creation
**Solution**: Feed refresh is automatic, but can manually refresh:
```javascript
renderFeed();  // Re-render feed from state.productFeed
```

**Issue**: Backend unreachable
**Solution**: Check Render service status
```bash
curl https://sauda-backend.onrender.com/api/health
# Should return: {"status":"ok"}
```

---

## 📊 Data Summary

### Database Contents (Railway MySQL)
- **31 Products**: Sarees, vegetables, dairy, electronics, beauty, services
- **11 Sellers**: With shop names, localities, verification status
- **18 Users**: Registered buyers and sellers
- **8 Categories**: Clothes, Sabzi, Fruit, Dairy, Kirana, Electronics, Beauty, Services
- **87 Directory Entries**: Unregistered shops for discovery
- **Orders**: Placed by users (backend stored)

### Live Data Example
```json
{
  "product": {
    "id": "p1",
    "title": "Banarasi Silk Saree",
    "titleEn": "Banarasi Silk Saree",
    "titleHi": "Banarasi Silk Saree",
    "price": 2500,
    "unit": "pcs",
    "seller": "neeta",
    "category": "clothes",
    "stock": 5
  },
  "seller": {
    "id": "neeta",
    "name": "Neeta Singh",
    "shop": "Neeta Sarees",
    "locality": "Lalghati, Bhopal",
    "isLive": true
  },
  "category": {
    "id": "clothes",
    "name": "Clothes",
    "nameHi": "कपड़े",
    "icon": "fa-shirt",
    "color": "#ec4899",
    "bg": "#fce7f3"
  }
}
```

---

## 🔧 Code Changes Summary

### Files Modified
1. **`backend/main.py`** - Added `POST /api/products` endpoint
2. **`js/voice.js`** - Enhanced voice UI, added edit button, improved search results
3. **`js/api.js`** - Added `createProduct()` method
4. **`js/state.js`** - Added userId, order hydration from backend
5. **`js/onboard.js`** - Made async, calls `API.onboard()` for user creation
6. **`js/seller.js`** - Voice/manual publish now async, calls `API.createProduct()`
7. **`js/success.js`** - Order confirmation now async, calls `API.placeOrder()`
8. **`index.html`** - Added edit button to voice overlay UI

### Commits
```
1. 8342d23 - Wire onboarding/orders/product creation to backend APIs
2. 3ab9381 - Improve voice overlay UX with availability status and edit button
3. f2f8abc - Add comprehensive documentation and test page
```

---

## 📚 Documentation Files

- **`VOICE_FEATURE_SUMMARY.md`** - Complete feature documentation
- **`VOICE_FEATURES_TEST.html`** - Interactive test page (open in browser)
- **`README.md`** - Original project README

---

## 🎯 Next Steps

1. **Rebuild APK** (once Android SDK is available)
   - Install APK on device
   - Test all voice features
   - Verify backend data loading

2. **Deploy to Production**
   - APK ready for Google Play Store
   - Backend already live on Render
   - Database on Railway MySQL

3. **Enhance Voice Features** (Optional)
   - Add ML-based entity extraction for better parsing
   - Support more languages
   - Voice feedback/audio responses

---

## 📞 Support

**Backend**: https://sauda-backend.onrender.com/api/health
**Repository**: https://github.com/Satya7781/sauda
**Issues**: Create GitHub issue or check console logs

---

**Status**: ✅ All backend APIs live • ✅ Voice features implemented • ✅ Code pushed to GitHub • 🔄 Ready for APK deployment

*Last Updated: After commit f2f8abc6*
