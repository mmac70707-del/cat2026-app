package com.cat2026.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.graphics.toColorInt
import androidx.core.net.toUri
import androidx.webkit.WebViewAssetLoader

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var backButtonHandler: (() -> Boolean)? = null

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            triggerNotificationSetup()
        }
    }

    @Suppress("DEPRECATION")
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.navigationBarColor = "#0D1B2A".toColorInt()
        window.statusBarColor = "#0D1B2A".toColorInt()

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )

            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false

            webChromeClient = WebChromeClient()

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }

                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {
                    val url = request.url.toString()
                    return if (url.startsWith("https://appassets.androidforward.site/") ||
                        url.startsWith("http://localhost")
                    ) {
                        false
                    } else {
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, url.toUri()))
                        } catch (_: Exception) {
                            // Silently ignore if no handler for URL scheme
                        }
                        true
                    }
                }
            }

            addJavascriptInterface(NativeBridge(), "AndroidBridge")
            loadUrl("https://appassets.androidforward.site/assets/public/index.html")
        }

        setContentView(webView)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val handledByJs = backButtonHandler?.invoke() ?: false
                if (!handledByJs) {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            }
        })

        checkNotificationPermission()
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            when {
                ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) == PackageManager.PERMISSION_GRANTED -> {
                    triggerNotificationSetup()
                }
                else -> {
                    requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            }
        } else {
            triggerNotificationSetup()
        }
    }

    private fun triggerNotificationSetup() {
        // DailyReminderWorker.schedule(this)
    }

    @Suppress("UNUSED")
    inner class NativeBridge {
        @JavascriptInterface
        fun registerBackButton() {
            backButtonHandler = {
                var result = false
                runOnUiThread {
                    webView.evaluateJavascript("window.onAndroidBackPressed && window.onAndroidBackPressed()") { value ->
                        result = value == "true"
                    }
                }
                result
            }
        }

        @JavascriptInterface
        fun unregisterBackButton() {
            backButtonHandler = null
        }
    }
}
