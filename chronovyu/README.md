# CHRONOVYU Native Android

A separate Kotlin + Jetpack Compose app module inside the existing repository. The existing `:app` WebView app and its web assets are preserved; this new module has application ID `com.chronovyu.app`.

## Current working features
- Dashboard with local task, note, and completed focus-session counts.
- Tasks: add, validate, complete, and delete.
- Focus timer: 15/25/50 minute blocks, pause/reset, completion count.
- Knowledge Vault: create/delete local notes.
- Daily reminder scheduling via WorkManager and Android notification permission.
- Android biometric/device-credential prompt.
- JSON backup export via Android Sharesheet.
- Explicit assistant/service status: no fake login or generated AI responses when a backend is missing.
- Preferences DataStore local persistence; core task and note features work offline.

## Open in Android Studio
1. Open the repository root (not only the `chronovyu/` folder), because the root Gradle settings include both `:app` and `:chronovyu`.
2. Use JDK 17 and allow Gradle sync to complete.
3. Run the `chronovyu` run configuration or select module `:chronovyu` and run on an Android 8.0+ device/emulator.
4. CLI build: `./gradlew :chronovyu:assembleDebug`.
5. CLI tests: `./gradlew :chronovyu:testDebugUnitTest`.
6. Debug APK output: `chronovyu/build/outputs/apk/debug/chronovyu-debug.apk`.

## Backend and security boundaries
No backend URL, account service, or AI API credentials were provided or verified. Online AI, real account authentication, and cloud sync are intentionally not implemented. Do not embed a private provider API key in the APK; add a server-side proxy and documented API contract before enabling these features.

Tasks and notes are stored locally using Preferences DataStore. Export is one-way JSON sharing; restore/import and cloud backup are not implemented yet. The current note store is not an encrypted secret vault, so do not save passwords or highly sensitive material. The biometric action invokes Android device authentication but is not yet an app-launch lock gate.

WorkManager periodic work is best-effort and Android may defer reminders for battery optimization. The first reminder is scheduled with an initial one-hour delay; exact alarm-clock timing is not promised.

## Product follow-ups before production
- Verify all modules build in CI and install on a physical device.
- Add encrypted local storage for sensitive vault data, a restore flow with schema validation, and a real app-lock gate if required.
- Add backend API contract, authentication, server-side secret management, account deletion and privacy policy before cloud/AI features.
- Add end-to-end UI tests, crash reporting consent, accessibility review, and release signing configuration.
