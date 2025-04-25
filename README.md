# Sample Snack app

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).

## ✅ Developer QA & Test Checklist

Before every commit or pull request:

### 🧪 Run Lean Tests

Tests include:
- [x] Supabase login/session logic
- [x] Preferred name fetch + save
- [x] Permissions logic (location, notifications)
- [x] Notification flow safety
- [x] Language switching
- [x] Wait time submission validation

### 🔍 Run Manual QA (5-minute flow)
- [x] Login with real user
- [x] Preferred name shows on landing
- [x] Profile data displays properly
- [x] Welcome modal appears after login
- [x] Language toggle switches text
- [x] Live TSA wait time loads
- [x] No visible layout or rendering issues

### ☁️ CI Status
GitHub Actions will auto-run the test suite on each push or PR to `main`.

