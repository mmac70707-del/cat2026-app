# CAT 2026 — ProGuard / R8 rules
#
# CRITICAL: the JS <-> native bridge (window.AndroidNativeHost) depends
# on @JavascriptInterface-annotated methods being reachable BY NAME from
# JavaScript. R8's default minification renames and can strip unused-
# looking methods — WebView calls them reflectively, so R8 can't see
# that they're used, and will silently break the back button, resume
# event, and notification bridge in release builds if this rule is
# removed. Debug builds are unaffected (no minification), so this bug
# only ever appears in `bundleRelease` output — test release builds
# specifically, not just debug.
-keepclassmembers class com.cat2026.app.MainActivity$AndroidBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface

# WorkManager Worker subclasses are instantiated via reflection by
# their class name — keep them and their constructors.
-keep class com.cat2026.app.notifications.MorningMissionWorker { <init>(...); }
-keep class com.cat2026.app.notifications.EveningErrorLogWorker { <init>(...); }
