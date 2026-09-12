# CAT 2026 — Stage 5: Capacitor Android Packaging

**Read this first: `## Environment Notice` below explains exactly what
was prepared here vs. what you must run yourself, and why.**

---

## Environment Notice

The Stage 4 React app was built and validated in a sandboxed
container with **no network access** and **no Android SDK / Gradle /
Android Studio installed**. This is a hard infrastructural limit, not
a shortcut:

- `npm install` inside this container returns `403 Forbidden` —
  cannot reach the npm registry.
- No `ANDROID_HOME`, no Gradle, no Android Studio exist here.
- No physical or virtual Android device exists here.

So the honest split is:

| Can be done here (and was) | Must be done on your machine |
|---|---|
| Write `capacitor.config.ts` | `npm install` (needs network) |
| Add Capacitor deps to `package.json` | `npx cap add android` (needs network — downloads the Android template) |
| Write native-bridge integration code (status bar, splash, back button, resume) | Open project in Android Studio |
| Generate real app icon + splash PNGs | Run Image Asset Studio to produce mipmap densities |
| Write this exact command sequence | Build debug APK, run on device/emulator |
| Write the persistence/device test checklist | Actually execute those tests on a phone |
| Explain signing safely | Generate your own keystore, build AAB |

Nothing below is a placeholder — every file is real, complete code.
The commands are exact and in the right order. What's missing is
purely *execution*, which requires your local machine's network and
Android tooling.

---

## Step 1 — Install dependencies

```bash
cd cat2026
npm install
```

This installs the Capacitor packages already declared in
`package.json`:
- `@capacitor/core`, `@capacitor/android`, `@capacitor/cli`
- `@capacitor/app` (back button, app state)
- `@capacitor/status-bar`, `@capacitor/splash-screen`

## Step 2 — Verify the web build still works

```bash
npm run build
```

Must complete with no TypeScript errors. This is the same build
Stage 4 already validated by static analysis; running it for real
with the actual TypeScript compiler is your first live checkpoint.

## Step 3 — Add the Android platform

```bash
npx cap add android
```

This downloads Capacitor's Android template and creates a full
Android Studio project at `./android/`. Requires network.

## Step 4 — Copy Android assets into the new project

The `android/` folder won't exist until Step 3 finishes. Once it
does, copy the pre-generated icon/splash sources in:

```bash
mkdir -p android/app/src/main/res/drawable
cp android-assets/splash-source-1242x2436.png android/app/src/main/res/drawable/splash.png
```

Then in Android Studio: **File → New → Image Asset**
- Icon type: *Launcher Icons (Adaptive and Legacy)*
- Foreground: `android-assets/adaptive-icon-foreground-1024.png`
- Background: `android-assets/adaptive-icon-background-1024.png`
- This auto-generates every mipmap density (`mdpi` → `xxxhdpi`)
  correctly — don't hand-copy PNGs into `mipmap-*` folders yourself.

For the Play Store listing icon (not the app icon — the one shown in
the Play Console listing page), use `android-assets/playstore-icon-512.png`
directly at listing-setup time.

## Step 5 — Sync web build into Android

```bash
npm run build
npx cap sync android
```

Run this every time you change React code. `cap sync` copies the
fresh `dist/` output into `android/app/src/main/assets/public/` and
updates native dependencies.

## Step 6 — Open in Android Studio

```bash
npx cap open android
```

Let Gradle finish its first sync (can take several minutes the first
time — it's downloading Gradle wrapper + Android build tools).

## Step 7 — Run on a device

- Plug in a physical phone with **USB debugging enabled**
  (Settings → About Phone → tap Build Number ×7 → Developer Options →
  USB Debugging), or start an emulator from Android Studio's Device
  Manager.
- Click the green ▶ Run button in Android Studio, select your device.
- This builds and installs a **debug APK** automatically.

---

## Native behaviour that was wired in (Stage 5 code changes)

These are real changes to the Stage 4 source, not just config:

- **`src/services/native.ts`** (new) — safe wrappers around Capacitor
  plugins. Every function checks `Capacitor.isNativePlatform()` first,
  so this code is a no-op in the browser and doesn't touch the
  existing Stage 4 web behaviour at all.
- **Status bar / splash** — wired into `src/main.tsx`. Dark status
  bar matching the app's navy theme; splash hides after first paint.
- **Android back button** — wired into `src/app/App.tsx`. On a
  sub-page (Errors/Repair/Retest/Mocks/Schedule/Vision/Syllabus/
  Settings) it behaves exactly like the on-screen "← Back" button.
  On a main tab (Today/Week/Mastery/Phases/More) it exits the app,
  matching standard Android expectations.
- **App resume (foreground)** — `native.ts` dispatches a
  `cat2026:resume` window event when Android reports the app became
  active again. `useCountdown`, `usePhase`, and `useTodayTasks` all
  listen for this event (alongside the web's existing
  `visibilitychange`/`focus` handling), so the countdown, phase
  banner, and task list are correct the instant the app reopens —
  not stale until the next timer tick, which matters because Android
  throttles JS timers while backgrounded.

No other Stage 4 behaviour, UI, or data logic was changed.

---

## Persistence Test Protocol (run these yourself on-device)

IndexedDB inside a Capacitor Android WebView persists to the app's
private storage the same way it does in Chrome — but this must be
verified on a real device, not assumed:

**Test 1 — Task persistence**
1. Open the app → Today tab → tap ▶ Start on the QA block → tap ✓ Done.
2. Force-close the app (swipe away from Recent Apps).
3. Reopen. QA block must still show ✓ Done.

**Test 2 — Error → Repair → Retest cycle**
1. More → Error Log → log a C1 error with topic/reason/method filled in.
2. More → Repair → mark it Repaired.
3. More → Retest → mark it Passed.
4. Force-close and reopen. The error's Repair status must read DONE
   and Retest status must read PASSED (check via More → Error Log →
   Recent Errors).

**Test 3 — Daily score**
1. Today tab → fill in DONE logger (study/screen/accuracy) → submit.
2. Force-close and reopen → Week tab → the entry must appear under
   "Weekly Performance."

**Test 4 — Device-level**
- Rotate the phone — layout should not crash or lose state (this app
  is intentionally portrait-oriented; verify it doesn't visually
  break in landscape rather than expecting a landscape redesign).
- Lock screen, wait 30+ seconds, unlock — countdown/phase should be
  correct immediately, not stale.
- Press hardware Back from a sub-page — should return to More, not
  exit the app.
- Press hardware Back from a main tab — should exit the app.
- Reboot the phone entirely, reopen the app — all Test 1–3 data must
  still be present (this is the real IndexedDB-survives-reboot test;
  force-close alone doesn't fully prove it).

None of these four tests can be run inside this sandboxed container —
there is no device. Run them yourself and treat this list as your
Stage 5 acceptance checklist.

---

## Signing (for release AAB — do this only after debug testing passes)

**Never commit a keystore or its passwords to git.** Add to
`.gitignore`:
```
android/*.keystore
android/*.jks
android/key.properties
```

Generate a keystore locally (one-time, keep it forever):
```bash
keytool -genkey -v -keystore cat2026-release.keystore \
  -alias cat2026 -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted for passwords — store them in a password manager,
not in any file that gets committed. Create `android/key.properties`
(gitignored) with:
```
storeFile=../cat2026-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=cat2026
keyPassword=YOUR_KEY_PASSWORD
```

**Back up the keystore file itself somewhere safe outside the repo.**
If you lose it, you can never update this app on Google Play again
under the same listing — Google cannot recover or reset it for you.

Reference `key.properties` from `android/app/build.gradle`'s
`signingConfigs` block (Android Studio's Build → Generate Signed
Bundle wizard can do this for you interactively instead of hand-editing
Gradle, which is the safer path if you're doing this for the first
time).

## Generating the release AAB

Once debug testing has fully passed:

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

An AAB existing is not the same as Play Store readiness — see the
Final Report below for what's still outstanding after this.
