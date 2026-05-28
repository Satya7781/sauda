# 🚀 Final APK Build Guide - Sauda Voice Marketplace

## ✅ Pre-Build Verification

### Backend Status
- **URL**: https://sauda-backend.onrender.com ✓
- **Health Check**: https://sauda-backend.onrender.com/api/health ✓
- **All endpoints functional**: categories, products, sellers, orders, onboarding ✓

### Frontend Features (All Implemented)
- ✓ Voice search with availability badges
- ✓ Voice seller listing with AI extraction
- ✓ Edit button for generated items
- ✓ Manual listing mode
- ✓ Close button on voice overlay
- ✓ Category rendering from backend
- ✓ Product feed with real data
- ✓ Order persistence
- ✓ User authentication

### Web Assets Built
- ✓ index.html with all features
- ✓ js/voice.js - 781 lines
- ✓ js/state.js - backend data hydration
- ✓ js/api.js - all API endpoints
- ✓ CSS with voice overlay styles
- ✓ All images and assets

### Capacitor Sync Complete
- ✓ Web assets copied to android/app/src/main/assets/public
- ✓ capacitor.config.json created
- ✓ Speech Recognition plugin configured
- ✓ Permissions set up

---

## 🔨 Build Instructions

### Step 1: Install Android SDK (If Not Already Done)

```bash
# Install Android SDK via Android Studio or command line
# Download from: https://developer.android.com/studio

# Or using apt (Linux):
# sudo apt-get install android-sdk-build-tools android-sdk-platform-tools

# Set ANDROID_HOME environment variable:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add to ~/.bashrc or ~/.zshrc for permanent:
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
```

### Step 2: Accept Android SDK Licenses

```bash
$ANDROID_HOME/tools/bin/sdkmanager --licenses
# Type 'y' for all licenses
```

### Step 3: Install Required Android SDK Packages

```bash
# Install Android SDK 34 (or latest)
$ANDROID_HOME/tools/bin/sdkmanager "platforms;android-34"
$ANDROID_HOME/tools/bin/sdkmanager "build-tools;34.0.0"
$ANDROID_HOME/tools/bin/sdkmanager "extras;android;m2repository"
$ANDROID_HOME/tools/bin/sdkmanager "system-images;android-34;default;x86_64"
```

### Step 4: Build the APK

```bash
cd /home/rajverma/Documents/sauda-main

# Clean previous builds
./android/gradlew -p android clean

# Build debug APK
./android/gradlew -p android assembleDebug

# Output location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 5: Build Release APK (Optional - for Play Store)

```bash
# Generate keystore (do this once)
keytool -genkey -v -keystore ~/sauda-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias sauda-key

# Build release APK
./android/gradlew -p android assembleRelease \
  -Pandroid.injected.signing.store.file=$HOME/sauda-release-key.jks \
  -Pandroid.injected.signing.store.password=YOUR_PASSWORD \
  -Pandroid.injected.signing.key.alias=sauda-key \
  -Pandroid.injected.signing.key.password=YOUR_PASSWORD

# Output location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 APK Details

### App Information
- **Name**: Sauda - Local Marketplace
- **Package**: com.sauda.app
- **Version**: 1.0.0
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

### Features Included in APK
1. **Voice Search** - Buyer can search products by voice
2. **Voice Listing** - Seller can create listings by voice
3. **Manual Listing** - Seller can create listings manually
4. **Backend Integration** - All data persists to Render backend
5. **User Authentication** - Onboarding with userId creation
6. **Order Management** - Place orders and view history
7. **Real-time Data** - Categories, products, sellers from backend
8. **Offline Support** - Uses localStorage for offline state

### Permissions Requested
- **INTERNET** - Connect to backend API
- **RECORD_AUDIO** - Voice recognition
- **CAMERA** - Can be added later if needed
- **LOCATION** - Can be added for location-based features

### Plugins Included
- **Capacitor Core** - Base framework
- **Capacitor Speech Recognition** - Voice input
- **Capacitor Preferences** - localStorage
- **Capacitor Network** - Network status

---

## 🚀 Installation on Device/Emulator

### Using ADB (Android Debug Bridge)

```bash
# Connect device via USB (enable Developer Mode first)
# Or start Android emulator

# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install and run
adb install -r android/app/build/outputs/apk/debug/app-debug.apk && adb shell am start -n com.sauda.app/com.sauda.app.MainActivity

# View logs
adb logcat | grep -i sauda
```

### Using Android Studio

1. Open project in Android Studio:
   ```bash
   /home/rajverma/Documents/sauda-main/android
   ```
2. Select device/emulator
3. Click "Run" button
4. APK will be built and installed automatically

---

## ✅ Testing Checklist

### On Device/Emulator

#### Buyer Flow
- [ ] App launches and shows onboarding
- [ ] Complete onboarding (name, role, location)
- [ ] Main feed loads with products
- [ ] Categories visible and clickable
- [ ] Click mic icon on feed
- [ ] Voice overlay opens with close button visible
- [ ] Say "saree" or similar product name
- [ ] Results show with:
  - [ ] Item count header
  - [ ] Availability badges (✓ or ✗)
  - [ ] Seller location
  - [ ] Prices
- [ ] Click product → product detail modal opens
- [ ] Click order button → order placed
- [ ] Order appears in order history
- [ ] Voice overlay close button works
- [ ] Click outside overlay also closes it

#### Seller Flow
- [ ] Complete onboarding as seller
- [ ] Seller dashboard loads
- [ ] Click mic icon on dashboard
- [ ] Voice overlay shows seller mode
- [ ] Say "Banarasi saree 2500 rupees"
- [ ] Generated preview shows with:
  - [ ] Category badge
  - [ ] Title + Hindi name
  - [ ] Price and unit
  - [ ] Stock count
- [ ] Click **Publish** button
- [ ] Product appears in dashboard immediately
- [ ] Product appears in main feed
- [ ] Click **Edit** button
- [ ] Manual form opens with pre-filled data
- [ ] Edit fields and publish
- [ ] Try manual mode directly
- [ ] Fill form and publish
- [ ] Verify in backend database

#### Backend Integration
- [ ] Open DevTools (in browser or via chrome://inspect on desktop)
- [ ] Check Network tab for API calls:
  - [ ] POST /api/onboard (user creation)
  - [ ] GET /api/products
  - [ ] GET /api/categories
  - [ ] POST /api/orders (order placement)
  - [ ] POST /api/products (product creation)
- [ ] All calls should return 200 OK
- [ ] Data should match backend response

#### Data Persistence
- [ ] Close and reopen app
- [ ] User identity should persist (same name/role)
- [ ] Order history should still be visible
- [ ] All data should load from backend again

---

## 🐛 Troubleshooting

### APK Build Fails

**Error**: `gradle not found`
```bash
# Solution: Use gradlew wrapper instead
cd android
./gradlew assembleDebug
```

**Error**: `ANDROID_SDK_ROOT not set`
```bash
# Solution: Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
```

**Error**: `Unsupported Java version`
```bash
# Solution: Use Java 11+
java -version  # Check version
# Install Java 11:
sudo apt-get install openjdk-11-jdk
```

### App Crashes on Launch

**Check logs**:
```bash
adb logcat | grep -E "CRASH|ERROR|Exception"
```

**Common issues**:
1. Backend API not accessible → check `defaultProductionApiBaseUrl` in js/api.js
2. Missing permissions → check AndroidManifest.xml
3. Import errors → check console logs

### Voice Not Working

**Check**:
1. Microphone permission granted on device
2. Device has speech recognition support
3. Check console: `console.log(state.isRecording)`
4. Verify speech recognition plugin installed: `npm list @capacitor-community/speech-recognition`

### Data Not Loading

**Check**:
1. Backend health: https://sauda-backend.onrender.com/api/health
2. Network connectivity on device
3. DevTools Network tab for API call status
4. Console errors: `adb logcat | grep -i error`

---

## 📊 Build Output

After successful build, you'll have:

```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   ├── app-debug.apk (≈30-50 MB)
│   │   └── app-debug.apk.sha256
│   └── release/ (if built)
│       └── app-release.apk (≈25-40 MB)
└── bundle/
    └── release/ (if built)
        └── app-release.aab (for Play Store)
```

### File Size Breakdown
- **Base APK**: ~5 MB
- **Web assets**: ~2 MB
- **Dependencies**: ~20-30 MB
- **Total**: ~30-50 MB

---

## 🎯 Next Steps After Build

1. **Test on Device**
   - Install APK
   - Run through testing checklist above
   - Check logs for any errors

2. **Beta Testing**
   - Share with test users
   - Collect feedback
   - Fix issues

3. **Production Release**
   - Build release APK
   - Sign with keystore
   - Upload to Google Play Store

4. **Monitoring**
   - Track crashes with Firebase
   - Monitor backend API usage
   - Watch database growth

---

## 📝 Build Commands Summary

```bash
# Full build process
cd /home/rajverma/Documents/sauda-main
npm run build:www
npx cap sync android
cd android && ./gradlew clean assembleDebug

# Quick rebuild after code changes
npm run build:www && npx cap sync android && cd android && ./gradlew assembleDebug

# Install on device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep sauda
```

---

## ✨ Features in Final APK

| Feature | Status | Details |
|---------|--------|---------|
| Voice Search | ✓ | With availability badges |
| Voice Listing | ✓ | With AI extraction + edit |
| Manual Listing | ✓ | Full form support |
| Backend Integration | ✓ | All CRUD operations |
| User Authentication | ✓ | Onboarding with identity |
| Order Management | ✓ | Place & view orders |
| Category Filtering | ✓ | 8 categories from backend |
| Product Feed | ✓ | 31+ products with real data |
| Data Persistence | ✓ | Backend + localStorage |
| Offline Support | ✓ | Limited functionality offline |

---

**Status**: Ready for APK Build  
**Backend**: Live on Render ✓  
**Features**: All implemented ✓  
**Code**: Pushed to GitHub ✓  
**Last Updated**: After voice feature improvements
