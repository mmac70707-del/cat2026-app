package com.cat2026.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.cat2026.app.notifications.EveningErrorLogWorker
import com.cat2026.app.notifications.MorningMissionWorker
import com.cat2026.app.notifications.ReminderSchedule
import com.cat2026.app.notifications.initialDelayMillisFor
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

    // Must be registered unconditionally before the Activity reaches
    // STARTED — a class-property initializer runs during construction,
    // which satisfies that requirement correctly.
    private val notificationPermissionLauncher: ActivityResultLauncher<String> =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) scheduleReminders() else cancelReminders()
        }

    inner class AndroidBridge {
        @JavascriptInterface
        fun exitApp() {
            finish()
        }

        // JS bridge calls arrive on a background thread — permission
        // requests and WorkManager scheduling both need to happen
        // safely regardless of thread, so this hops to the UI thread.
        @JavascriptInterface
        fun requestNotificationPermission() {
            runOnUiThread {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    val already = ContextCompat.checkSelfPermission(
                        this@MainActivity, Manifest.permission.POST_NOTIFICATIONS
                    ) == PackageManager.PERMISSION_GRANTED
                    if (already) scheduleReminders()
                    else notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                } else {
                    // Pre-Android 13 never required a runtime prompt for notifications.
                    scheduleReminders()
                }
            }
        }

        @JavascriptInterface
        fun setNotificationsEnabled(enabled: Boolean) {
            runOnUiThread {
                if (enabled) requestNotificationPermission() else cancelReminders()
            }
        }
    }

    private fun scheduleReminders() {
        val wm = WorkManager.getInstance(applicationContext)

        val morning = PeriodicWorkRequestBuilder<MorningMissionWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(initialDelayMillisFor(9, 0), TimeUnit.MILLISECONDS)
            .build()
        wm.enqueueUniquePeriodicWork(
            ReminderSchedule.MORNING_WORK_NAME, ExistingPeriodicWorkPolicy.UPDATE, morning
        )

        val evening = PeriodicWorkRequestBuilder<EveningErrorLogWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(initialDelayMillisFor(21, 0), TimeUnit.MILLISECONDS)
            .build()
        wm.enqueueUniquePeriodicWork(
            ReminderSchedule.EVENING_WORK_NAME, ExistingPeriodicWorkPolicy.UPDATE, evening
        )
    }

    private fun cancelReminders() {
        val wm = WorkManager.getInstance(applicationContext)
        wm.cancelUniqueWork(ReminderSchedule.MORNING_WORK_NAME)
        wm.cancelUniqueWork(ReminderSchedule.EVENING_WORK_NAME)
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        ReminderSchedule.createChannel(applicationContext)

        window.statusBarColor = Color.parseColor("#0A0F1E")
        window.navigationBarColor = Color.parseColor("#0A0F1E")
        @Suppress("DEPRECATION")
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_VISIBLE

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/public/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#0A0F1E"))

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
                useWideViewPort = true
                loadWithOverviewMode = true
                setSupportZoom(false)
                builtInZoomControls = false
                displayZoomControls = false
                cacheMode = WebSettings.LOAD_DEFAULT
            }

            addJavascriptInterface(AndroidBridge(), "AndroidNativeHost")

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    val url = request.url
                    val path = url.path ?: ""

                    if (path == "/" || path == "/index.html") {
                        val newUri = Uri.parse("https://appassets.androidplatform.net/assets/public/index.html")
                        return assetLoader.shouldInterceptRequest(newUri)
                    }

                    if (!path.startsWith("/assets/public/")) {
                        val relativePath = path.removePrefix("/")
                        val newUri = Uri.parse("https://appassets.androidplatform.net/assets/public/$relativePath")
                        val response = assetLoader.shouldInterceptRequest(newUri)
                        if (response != null) return response
                    }

                    return assetLoader.shouldInterceptRequest(url)
                }
            }

            webChromeClient = WebChromeClient()

            loadUrl("https://appassets.androidplatform.net/assets/public/index.html")
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::webView.isInitialized) {
                    webView.evaluateJavascript("window.dispatchEvent(new Event('android:backbutton'))", null)
                } else {
                    finish()
                }
            }
        })

        setContent {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(androidx.compose.ui.graphics.Color(0xFF0A0F1E))
            ) {
                AndroidView(
                    factory = { webView },
                    modifier = Modifier.fillMaxSize()
                )
            }
        }
    }

    // Mirrors the back-button bridge pattern: dispatch a real DOM
    // event the web app already listens for (useCountdown / usePhase
    // / useTodayTasks all handle `cat2026:resume`), so state is fresh
    // the instant the app comes back to the foreground rather than
    // stale until the next timer tick.
    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.evaluateJavascript("window.dispatchEvent(new Event('cat2026:resume'))", null)
        }
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.destroy()
        }
        super.onDestroy()
    }
}
