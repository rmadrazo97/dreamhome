# Dream Home - iOS Build & Distribution Guide

## App Information

- **App Name:** Dream Home Guatemala
- **Bundle ID:** gt.com.dreamhome
- **Apple ID:** 1615334469
- **Current Version:** 2.1
- **Development Team:** Alejandro Madrazo (WZ43D29S4L)
- **Platform:** iOS (arm64)

## Build History

| Date | Version | Build | Status | Notes |
|------|---------|-------|--------|-------|
| 11/11/2025 | 2.1 | 2.1 | Uploaded | Fixed NSLocationAlwaysAndWhenInUseUsageDescription warning |
| 11/11/2025 | 2.1 | 2.1 | Uploaded with warnings | Missing NSLocationAlwaysAndWhenInUseUsageDescription |
| 14/02/2023 | 2.0 | 2.0 | Uploaded with warnings | Previous version |
| 10/04/2022 | 1.4 | 1.4 | Uploaded to Apple | - |

## Environment Setup

### Prerequisites
- **Node.js:** v18.13.0 (requires special configuration)
- **React Native:** 0.65.1
- **CocoaPods:** Latest
- **Xcode:** Latest version
- **macOS:** Darwin 24.6.0

### Known Issues & Solutions

#### 1. Module Name Mismatch Crash (CRITICAL)
**Problem:** App crashes immediately on launch in Release builds (TestFlight/App Store) with error: `facebook::react::RCTNativeModule::invoke` and `RCTFatal`.

**Error in Xcode Crashes:**
```
dreamhome: facebook::react::RCTNativeModule::invoke(unsigned int, folly::dynamic&&)
RCTFatal
CoreFoundation __exceptionPreprocess
```

**Root Cause:** The module name in `AppDelegate.m` didn't match the registered app name in `app.json`:
- `app.json` registers: `"dreamhomeapp"`
- `AppDelegate.m` was trying to load: `@"dreamhome"`

**Solution:** Updated `ios/listingApp/AppDelegate.m` line 36:
```objc
// WRONG (causes crash):
moduleName:@"dreamhome"

// CORRECT:
moduleName:@"dreamhomeapp"
```

**Important:** This crash only appears in Release builds, NOT in Debug builds, making it hard to catch during development.

#### 2. Node.js 18 Compatibility Issue
**Problem:** React Native 0.65.1 is incompatible with Node.js 18's OpenSSL implementation.

**Error:**
```
Error: error:0308010C:digital envelope routines::unsupported
```

**Solution:** Set the `NODE_OPTIONS` environment variable with legacy OpenSSL provider:
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

**Fixed in Xcode Build Script:**
The build script in `ios/dreamhome.xcodeproj/project.pbxproj` has been updated to include:
```bash
unset VSCODE_INSPECTOR_OPTIONS
export NODE_OPTIONS=--openssl-legacy-provider
```

#### 2. VS Code/Cursor Debugger Interference
**Problem:** VS Code/Cursor sets `NODE_OPTIONS` and `VSCODE_INSPECTOR_OPTIONS` environment variables that interfere with React Native's CLI during `pod install` and builds.

**Error:**
```
Error: Cannot find module '/Users/.../node_modules/@react-native-community/cli/build/bin.js
Debugger listening on ws://127.0.0.1:...
```

**Solution:**
- Run `pod install` in a clean terminal (not the IDE's integrated terminal)
- OR unset the variables before running:
```bash
unset NODE_OPTIONS
unset VSCODE_INSPECTOR_OPTIONS
cd ios && pod install
```

#### 3. Ruby FFI Architecture Mismatch
**Problem:** System Ruby running in x86_64 mode with arm64 gems.

**Error:**
```
dlopen(...ffi-1.16.3/lib/ffi_c.bundle...): mach-o file, but is an incompatible architecture (have 'arm64', need 'x86_64')
```

**Solution:** If needed, run:
```bash
sudo gem pristine ffi --version 1.16.3
```

## Build Process

### 1. Install Dependencies

```bash
# From project root
cd /Users/amadrazo/Desktop/dreamhome

# Install npm packages
npm install

# Install CocoaPods (in a clean terminal, not IDE terminal)
cd ios
pod install
```

### 2. Manual Bundle Creation (if needed)

If the Xcode build fails to create the JavaScript bundle:

```bash
cd /Users/amadrazo/Desktop/dreamhome

# Create bundle manually with legacy OpenSSL
export NODE_OPTIONS=--openssl-legacy-provider
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios/
```

### 3. Open Project in Xcode

**IMPORTANT:** Always open the workspace, not the project file:

```bash
open ios/dreamhome.xcworkspace
```

### 4. Configure Code Signing

1. Select `dreamhome` project in navigator
2. Select `dreamhome` target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select Team: Alejandro Madrazo
6. Verify Bundle ID: `gt.com.dreamhome`

### 5. Update Version Numbers

Before archiving, update version in Xcode:
1. Select `dreamhome` target
2. Go to "General" tab
3. Update:
   - **Version** (MARKETING_VERSION): e.g., 2.1
   - **Build** (CURRENT_PROJECT_VERSION): e.g., 2.1

**Note:** Build version must be higher than any previously uploaded build.

### 6. Create Archive

1. Select destination: "Any iOS Device (arm64)"
2. Menu: **Product** → **Clean Build Folder** (Cmd+Shift+K)
3. Menu: **Product** → **Archive**
4. Wait for build to complete

### 7. Distribute to App Store

1. Xcode Organizer will open automatically
2. Select the archive
3. Click **"Distribute App"**
4. Select **"App Store Connect"**
5. Select **"Upload"**
6. Options:
   - ✅ Upload symbols
   - ✅ Manage version and build number
7. Let Xcode manage signing automatically
8. Review and **"Upload"**

## Required Info.plist Permissions

The following privacy permissions are configured in `ios/listingApp/Info.plist`:

```xml
<!-- Camera -->
<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) would like to use your camera</string>

<!-- Location - Always and When In Use -->
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Your location is required for showing listings near you and providing location-based services</string>

<!-- Location - When In Use -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>Your location is required for showing listings near you</string>

<!-- Microphone -->
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) would like to use your microphone (for videos)</string>

<!-- Photo Library Add -->
<key>NSPhotoLibraryAddUsageDescription</key>
<string>$(PRODUCT_NAME) would like to save photos to your photo gallery</string>

<!-- Photo Library -->
<key>NSPhotoLibraryUsageDescription</key>
<string>$(PRODUCT_NAME) would like access to your photo gallery to change your profile picture</string>
```

**Note:** `NSLocationAlwaysAndWhenInUseUsageDescription` was added on 11/11/2025 to fix Apple warning ITMS-90683.

## App Store Connect

### App Details
- **URL:** https://appstoreconnect.apple.com
- **App Apple ID:** 1615334469
- **Bundle ID:** gt.com.dreamhome

### Required Assets
- **Screenshots:**
  - iPhone 6.7" (1290 x 2796)
  - iPhone 6.5" (1242 x 2688)
  - iPhone 5.5" (1242 x 2208)
- **App Description**
- **Keywords**
- **Support URL**
- **Privacy Policy URL** (if collecting user data)
- **Category:** Utilities (or update as needed)

### Review Questions
- **Export Compliance:** Encryption usage
- **IDFA:** Advertising identifier usage
- **Content Rights:** Confirmation

## Common Build Errors & Solutions

### Error: "main.jsbundle does not exist"
**Cause:** JavaScript bundle wasn't created during build.

**Solution:**
1. Create bundle manually (see section 2 above)
2. Or ensure build script has correct `NODE_OPTIONS` set

### Error: "pod install fails with JSON parse error"
**Cause:** Debugger environment variables from IDE.

**Solution:**
Run in system Terminal app (not IDE terminal):
```bash
unset NODE_OPTIONS
unset VSCODE_INSPECTOR_OPTIONS
cd /Users/amadrazo/Desktop/dreamhome/ios
pod install
```

### Error: "Code signing error"
**Cause:** Invalid or missing provisioning profile.

**Solution:**
1. In Xcode, go to Signing & Capabilities
2. Uncheck "Automatically manage signing"
3. Re-check "Automatically manage signing"
4. Select your team
5. Clean build folder and try again

## Project Structure

```
dreamhome/
├── ios/
│   ├── dreamhome.xcworkspace    ← Always open this
│   ├── dreamhome.xcodeproj/
│   ├── listingApp/              ← Main app code
│   │   ├── Info.plist          ← Privacy permissions
│   │   ├── Images.xcassets/    ← App icons
│   │   └── AppDelegate.m
│   ├── Podfile                  ← CocoaPods dependencies
│   └── Pods/                    ← Generated by pod install
├── android/
├── node_modules/
├── package.json
└── index.js                     ← React Native entry point
```

## Useful Commands

```bash
# Install dependencies
npm install
cd ios && pod install

# Clean everything and reinstall
rm -rf node_modules ios/Pods
npm install
cd ios && pod install

# Create JavaScript bundle manually
export NODE_OPTIONS=--openssl-legacy-provider
npx react-native bundle \
  --entry-file index.js \
  --platform ios \
  --dev false \
  --bundle-output ios/main.jsbundle \
  --assets-dest ios/

# Open workspace
open ios/dreamhome.xcworkspace

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/dreamhome-*
```

## Next Steps for Future Updates

1. **For next version (e.g., 2.2):**
   - Update version in Xcode: General tab → Version & Build
   - Follow build process above
   - Increment version must be higher than previous

2. **Consider upgrading:**
   - React Native to latest version (currently on 0.65.1)
   - Node.js compatibility (currently requires legacy OpenSSL)
   - Dependencies with security vulnerabilities (run `npm audit`)

3. **Testing:**
   - Test on physical devices before uploading
   - Use TestFlight for beta testing
   - Verify all permissions work correctly

## Troubleshooting Tips

1. **Always use a clean terminal** for `pod install` (not IDE terminal)
2. **Clean build folder** before archiving (Cmd+Shift+K)
3. **Check App Store Connect** for existing version numbers before building
4. **Wait 5-10 minutes** after upload for build to process
5. **Read Apple emails** carefully for warnings and requirements

## References

- [React Native Documentation](https://reactnative.dev/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [CocoaPods](https://cocoapods.org/)
- [Apple Developer Portal](https://developer.apple.com/)

---

**Last Updated:** November 11, 2025
**Maintained By:** Alejandro Madrazo
