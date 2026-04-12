# 🛡️ X-Toolkit — Ethical Cybersecurity Suite

**React Native + Expo** — Runs on **Android (APK)** and **Web (via IP address)**.

---

## 📁 Project Structure

```
X-Toolkit/
├── App.tsx                          ← Entry point
├── app.json                         ← Expo config (name, icon, permissions)
├── babel.config.js                  ← Babel + Reanimated plugin
├── eas.json                         ← EAS Build config (APK + AAB)
├── tsconfig.json                    ← TypeScript config
├── package.json                     ← Dependencies
│
└── src/
    ├── theme/
    │   └── index.ts                 ← Colors, spacing, fonts (cyberpunk palette)
    │
    ├── store/
    │   └── useAppStore.ts           ← Zustand global state (scan history, apps)
    │
    ├── services/
    │   ├── DNSService.ts            ← DNS lookup via Cloudflare DoH
    │   ├── URLScannerService.ts     ← URL heuristic + Google Safe Browsing
    │   └── DeviceScanService.ts     ← Installed app scan + device info
    │
    ├── data/
    │   ├── terminalCommands.ts      ← Simulated shell command handlers
    │   ├── commandLibrary.ts        ← Nmap, Kali, networking reference
    │   └── learningContent.ts       ← Security education articles
    │
    ├── components/
    │   ├── CyberCard.tsx            ← Dark card with optional accent border
    │   ├── CyberButton.tsx          ← Themed button (primary/secondary/danger)
    │   ├── StatusBadge.tsx          ← Safe/Warning/Danger pill
    │   └── ScreenHeader.tsx         ← Page header with title + divider
    │
    ├── navigation/
    │   └── AppNavigator.tsx         ← Bottom tabs + stack navigators
    │
    └── screens/
        ├── HomeScreen.tsx           ← Dashboard with all tool shortcuts
        ├── DNSCheckerScreen.tsx     ← DNS record lookup (A, AAAA, MX, TXT…)
        ├── URLScannerScreen.tsx     ← Phishing/malware URL detection
        ├── APKScannerScreen.tsx     ← Sideloaded app risk detection
        ├── DeviceScanScreen.tsx     ← Full device permission audit
        ├── SystemInfoScreen.tsx     ← IP, network, device specs
        ├── LearningHubScreen.tsx    ← Security education hub
        ├── TerminalScreen.tsx       ← Educational Linux-like terminal
        ├── CodeEditorScreen.tsx     ← Code viewer with starter snippets
        └── CommandLibraryScreen.tsx ← Searchable security command reference
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- For Android: Expo Go app on your phone, OR Android Studio emulator

### 1. Install Dependencies
```bash
cd X-Toolkit
npm install
```

### 2. Start Development Server
```bash
# Start Expo dev server
npx expo start

# Then:
#   Press 'a' → open Android emulator
#   Press 'w' → open in web browser (accessible by IP on local network)
#   Scan QR code → open in Expo Go on your phone
```

### 3. Access via Web (IP Address)
When running `npx expo start --web`, your app is available at:
```
http://<YOUR_LOCAL_IP>:19006
```
Find your IP with `ip addr show` or `ifconfig`. Anyone on the same WiFi network can access it.

---

## 📦 Build APK (Android)

### Method 1: EAS Build (Cloud — Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account (free)
eas login

# Build APK (preview profile = .apk output)
eas build --platform android --profile preview

# Download the APK from the link EAS provides
# Install on phone: adb install x-toolkit.apk
```

### Method 2: Local Build (Termux / Linux)
```bash
# Requires Android SDK + Java 21 installed
npx expo run:android

# Or generate native project first:
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
# APK output: android/app/build/outputs/apk/release/app-release.apk
```

### Method 3: Gitpod (Cloud IDE — no local install)
1. Push project to GitHub
2. Open `https://gitpod.io/#https://github.com/YOUR_USERNAME/x-toolkit`
3. Run `npm install && eas build --platform android --profile preview`

---

## 🌐 Web Deployment (Access by IP)

```bash
# Build web bundle
npx expo export --platform web

# Serve locally (any machine on your network can access it)
npx serve dist --listen 0.0.0.0:3000

# Or use Python's built-in server:
cd dist && python3 -m http.server 3000 --bind 0.0.0.0

# Access from any device on same WiFi:
# http://192.168.x.x:3000
```

---

## ⚙️ Configuration

### Add Google Safe Browsing API (optional, improves URL scanning)
1. Get a free API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable "Safe Browsing API"
3. Set key in `src/services/URLScannerService.ts`:
   ```ts
   const SAFE_BROWSING_KEY = 'YOUR_KEY_HERE';
   ```

### Android Permissions
Declared in `app.json` under `android.permissions`:
- `INTERNET` — Required for DNS lookup and URL scanning
- `ACCESS_NETWORK_STATE` — Check connectivity
- `ACCESS_WIFI_STATE` — Get IP address
- `QUERY_ALL_PACKAGES` — List installed apps (APK scanner)
- `RECEIVE_BOOT_COMPLETED` — Background notifications

---

## 🛡️ Features

| Feature | Description | Status |
|---------|-------------|--------|
| DNS Checker | A, AAAA, MX, TXT, NS, CNAME via Cloudflare DoH | ✅ |
| URL Scanner | Heuristic + Google Safe Browsing API | ✅ |
| APK Scanner | Sideload detection + permission risk analysis | ✅ |
| Device Scan | Full app inventory with permission audit | ✅ |
| System Info | IP, device specs, network info | ✅ |
| Learning Hub | 5 security education articles | ✅ |
| Terminal | Simulated Linux shell (educational) | ✅ |
| Code Editor | Syntax-highlighted snippets, editable | ✅ |
| Command Library | 60+ commands: Nmap, Kali, Networking, Recon | ✅ |
| Dark Mode | Cyberpunk dark theme (CyberGreen + CyberCyan) | ✅ |
| Scan History | Zustand global state, persists per session | ✅ |

---

## ⚠️ Ethical Use

This toolkit is built for **educational and ethical use only**.

- ✅ Scanning your own devices and networks
- ✅ Authorized penetration testing (with written permission)
- ✅ Learning cybersecurity concepts
- ✅ Bug bounty programs (within defined scope)
- ❌ Testing systems you don't own
- ❌ Unauthorized access to any system or network

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 51 |
| Language | TypeScript |
| State | Zustand |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| HTTP | Axios |
| DNS | Cloudflare DNS-over-HTTPS |
| Device Info | expo-device, expo-network |
| Build | EAS Build (cloud APK) |
| Web | Expo web (Metro bundler) |

---

## 👤 Author

**Xora** — xoradev404@gmail.com  
GitHub: [https://github.com/website404S/x-cybertoolkit](https://github.com/website404S/x-cybertoolkit)
