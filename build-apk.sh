#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# Sauda APK Build Script
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "🚀 Sauda APK Build Script"
echo "📁 Project: $PROJECT_ROOT"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_step() {
    echo -e "${BLUE}→ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check prerequisites
print_step "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js not found"
    exit 1
fi
print_success "Node.js installed"

if ! command -v npm &> /dev/null; then
    print_error "npm not found"
    exit 1
fi
print_success "npm installed"

if [ ! -d "$PROJECT_ROOT/android" ]; then
    print_error "Android project not found at $PROJECT_ROOT/android"
    exit 1
fi
print_success "Android project found"

# Step 1: Clean previous builds
print_step "Step 1: Cleaning previous builds..."
cd "$PROJECT_ROOT"
rm -rf www
print_success "Cleaned www directory"

# Step 2: Build web assets
print_step "Step 2: Building web assets..."
npm run build:www
if [ $? -eq 0 ]; then
    print_success "Web assets built"
else
    print_error "Failed to build web assets"
    exit 1
fi

# Step 3: Sync Capacitor
print_step "Step 3: Syncing Capacitor..."
npx cap sync android
if [ $? -eq 0 ]; then
    print_success "Capacitor synced"
else
    print_error "Failed to sync Capacitor"
    exit 1
fi

# Step 4: Check Android SDK
print_step "Step 4: Checking Android SDK..."
if [ -z "$ANDROID_HOME" ]; then
    print_warning "ANDROID_HOME not set"
    print_step "Attempting to auto-detect Android SDK..."
    
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        print_success "Found Android SDK at $ANDROID_HOME"
    else
        print_error "Android SDK not found. Please install Android SDK and set ANDROID_HOME"
        exit 1
    fi
else
    print_success "ANDROID_HOME is set to $ANDROID_HOME"
fi

# Verify SDK exists
if [ ! -d "$ANDROID_HOME" ]; then
    print_error "ANDROID_HOME directory not found: $ANDROID_HOME"
    exit 1
fi

# Step 5: Build APK
print_step "Step 5: Building APK..."
cd "$PROJECT_ROOT/android"

# Clean first
print_step "Cleaning gradle..."
./gradlew clean

# Build debug APK
print_step "Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    print_success "APK built successfully!"
else
    print_error "Failed to build APK"
    exit 1
fi

# Step 6: Verify output
print_step "Step 6: Verifying APK..."
APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    print_success "APK created: $APK_PATH ($APK_SIZE)"
else
    print_error "APK not found at expected location"
    exit 1
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ BUILD COMPLETE!${NC}"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "APK Details:"
echo "  📦 Location: $APK_PATH"
echo "  📊 Size: $APK_SIZE"
echo "  🎯 Package: com.sauda.app"
echo "  🏷️  Version: 1.0.0"
echo ""
echo "Next steps:"
echo "  1. Install APK:"
echo "     adb install -r $APK_PATH"
echo ""
echo "  2. View logs:"
echo "     adb logcat | grep sauda"
echo ""
echo "  3. Share with testers:"
echo "     - Download APK file"
echo "     - Send via email or file sharing"
echo "     - Install on Android device"
echo ""
echo "Features included:"
echo "  ✓ Voice search with availability badges"
echo "  ✓ Voice seller listing with AI extraction"
echo "  ✓ Manual listing mode"
echo "  ✓ Backend integration (Render)"
echo "  ✓ Order management"
echo "  ✓ User authentication"
echo "  ✓ Real-time data sync"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
