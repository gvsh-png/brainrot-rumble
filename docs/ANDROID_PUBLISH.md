# Publishing Brainrot Swarm to Google Play (Android)

This project ships as a **Capacitor Android app**. Supabase auth was removed; cloud saves use **Google Play Games Saved Games** on Android. The web build keeps progress **on-device only** (guest mode).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Android Studio](https://developer.android.com/studio) (SDK 34, build-tools, platform-tools)
- A [Google Play Console](https://play.google.com/console) developer account
- JDK 17 (bundled with recent Android Studio)

## Quick commands

```bash
npm install
npm run prepare:www      # copy web assets → www/
npm run cap:sync         # sync www/ + plugins → android/
npm run android:open     # open Android Studio
npm run android:debug    # assemble debug APK (needs SDK)
npm run android:release  # assemble release AAB (needs signing config)
npm test
```

## Install on your phone without a PC

A GitHub Action builds a **debug APK** on every push to `main` / `cursor/*` (or run it manually).

1. On your phone, open GitHub in the browser and sign in
2. Go to **Actions** → **Android Debug APK** → latest green run
3. Scroll to **Artifacts** → download **brainrot-swarm-debug-apk**
4. Open the downloaded `app-debug.apk`
5. If prompted, allow **Install unknown apps** for your browser or Files app
6. Install and launch **Brainrot Swarm**

> **Note:** Google Play Games sign-in still needs Play Console setup (App ID + debug SHA-1). Guest mode works without that.

To trigger a build manually: **Actions** → **Android Debug APK** → **Run workflow**.

## 1. Create the Play Console app

1. Play Console → **Create app**
2. Package name: `gg.brainrot.swarm` (must match `capacitor.config.json` / `android/app/build.gradle`)
3. Category: **Games** → Action / Arcade
4. Content rating, privacy policy URL, and store listing assets (screenshots, feature graphic, 512×512 icon)

## 2. Enable Play Games Services + Saved Games

1. Play Console → your app → **Play Games Services** → **Setup and manage**
2. Create / link a Play Games project
3. **Configuration** → copy the numeric **Application ID**
4. Edit `android/app/src/main/res/values/strings.xml`:

   ```xml
   <string name="game_services_project_id" translatable="false">YOUR_NUMERIC_APP_ID</string>
   ```

5. Under Play Games → **Saved games**, enable **Saved Games (cloud saves)**

## 3. OAuth / SHA-1 credentials

Play Games sign-in requires an Android OAuth client tied to your signing key.

1. Generate a upload/release keystore (keep it safe — losing it blocks updates):

   ```bash
   keytool -genkey -v -keystore brainrot-release.keystore -alias brainrot -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Get SHA-1 fingerprints:

   ```bash
   keytool -list -v -keystore brainrot-release.keystore -alias brainrot
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

3. Play Console → Play Games Services → **Credentials** → add Android credential:
   - Package: `gg.brainrot.swarm`
   - SHA-1: debug + release fingerprints

4. Google Cloud Console (linked from Play Console) → create **OAuth client ID** → type **Android** with the same package + SHA-1.

## 4. Release signing (AAB)

Create `android/keystore.properties` (do **not** commit):

```properties
storeFile=../brainrot-release.keystore
storePassword=***
keyAlias=brainrot
keyPassword=***
```

Add to `android/app/build.gradle` inside `android { }`:

```gradle
def keystorePropsFile = rootProject.file("keystore.properties")
def keystoreProps = new Properties()
if (keystorePropsFile.exists()) {
    keystoreProps.load(new FileInputStream(keystorePropsFile))
    signingConfigs {
        release {
            storeFile file(keystoreProps['storeFile'])
            storePassword keystoreProps['storePassword']
            keyAlias keystoreProps['keyAlias']
            keyPassword keystoreProps['keyPassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Build the bundle:

```bash
npm run android:release
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

Upload the `.aab` in Play Console → **Production** or **Internal testing**.

## 5. Store checklist

| Item | Notes |
|------|--------|
| App name | Brainrot Swarm |
| Package | `gg.brainrot.swarm` |
| Min SDK | 24 (Android 7.0) |
| Target SDK | 34 |
| Orientation | Portrait locked |
| Privacy policy | Required — disclose local + Play Games cloud save data |
| Data safety | Declare “game progress” stored locally and in Play Games cloud |
| Play App Signing | Recommended — enroll when uploading first AAB |

## 6. How saves work now

| Platform | Sign-in | Save location |
|----------|---------|---------------|
| **Android app** | Google Play Games | Play Games Saved Games snapshot + local cache |
| **Web / browser** | Guest only | `localStorage` on device |

Guest progress is **not** migrated when signing into Play Games (same as the old Supabase flow).

## 7. Replacing launcher icons

```bash
node scripts/generate-icons.js
npm run cap:sync
```

For Play Store marketing icon, export a 512×512 PNG from `icons/icon-512.png` or replace the generator in `scripts/generate-icons.js`.

## 8. Troubleshooting

| Problem | Fix |
|---------|-----|
| Play sign-in fails | Check `game_services_project_id`, SHA-1, package name, Saved Games enabled |
| Redirect to old URL | N/A — Supabase removed |
| Blank WebView | Run `npm run cap:sync` after web changes |
| Gradle sync errors | Open Android Studio → SDK Manager → install API 34 |

## Project layout (Android-related)

```
capacitor.config.json    App id, webDir, splash/status bar
scripts/prepare-www.js   Copies static web files → www/
scripts/generate-icons.js
js/play-bridge.js        Google Play Games JS bridge (Android only)
js/native.js             Back button, status bar, wake lock
js/auth.js               Guest + Play Games save orchestration
android/                 Native Android project (commit this)
```
