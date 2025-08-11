# Firebase Setup Guide for Captura App

## Prerequisites
- macOS 14.5+ (Sequoia) and Xcode 16.2+ for iOS development
- Firebase project created at [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `captura` (or your preferred name)
4. Enable Google Analytics (recommended)
5. Choose Analytics account or create new one
6. Click "Create project"

## Step 2: Add Android App

1. In Firebase Console, click the Android icon (+ Add app)
2. Android package name: `com.captura.app`
3. App nickname: `Captura Android`
4. Debug signing certificate SHA-1 (optional for now)
5. Click "Register app"
6. Download `google-services.json`
7. Replace the placeholder `google-services.json` in your project root

## Step 3: Add iOS App

1. In Firebase Console, click the iOS icon (+ Add app)
2. iOS bundle ID: `com.captura.app`
3. App nickname: `Captura iOS`
4. App Store ID (optional)
5. Click "Register app"
6. Download `GoogleService-Info.plist`
7. Replace the placeholder `GoogleService-Info.plist` in your project root

## Step 4: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Anonymous" authentication
3. Click "Save"

## Step 5: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Click "Done"

## Step 6: Enable Storage

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Click "Done"

## Step 7: Build and Test

1. Clean and rebuild your project:
   ```bash
   npx expo prebuild --clean
   ```

2. For iOS:
   ```bash
   cd ios && pod install && cd ..
   npx expo run:ios
   ```

3. For Android:
   ```bash
   npx expo run:android
   ```

## Step 8: Verify Installation

1. Open the app
2. You should see a "Firebase Test" section on the home screen
3. Try signing in anonymously
4. Check Firebase Console for new users and analytics events

## Security Rules (Important!)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"RNFBAppModule not found"**
   - Uninstall previous development build
   - Run `npx expo prebuild --clean`
   - Rebuild with `npx expo run:ios` or `npx expo run:android`

2. **iOS Build Errors**
   - Ensure Xcode 16.2+ is installed
   - Check that `useFrameworks: "static"` is set in app.json
   - Run `cd ios && pod install --repo-update`

3. **Android Build Errors**
   - Verify `google-services.json` is in the correct location
   - Check that package name matches in `app.json`

4. **Firebase Connection Issues**
   - Verify configuration files are correct
   - Check internet connection
   - Ensure Firebase project is active

## Next Steps

After successful Firebase setup:

1. Implement user authentication flows
2. Create Firestore collections for territories
3. Set up real-time listeners for multiplayer features
4. Implement offline persistence
5. Add proper security rules
6. Set up analytics tracking

## Support

- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
- [Expo Documentation](https://docs.expo.dev/)
