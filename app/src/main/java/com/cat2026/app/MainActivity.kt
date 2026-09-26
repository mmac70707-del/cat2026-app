package com.cat2026.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
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
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.core.graphics.toColorInt
import androidx.core.net.toUri
import androidx.webkit.WebViewAssetLoader
import java.util.concurrent.Executor

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var backButtonHandler: (() -> Boolean)? = null
    private lateinit var biometricExecutor: Executor

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) triggerNotificationSetup()
    }

    @Suppress("DEPRECATION")
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.navigationBarColor = "#0D1B2A".toColorInt()
        window.statusBarColor = "#0D1B2A".toColorInt()
        biometricExecutor = ContextCompat.getMainExecutor(this)

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
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                    assetLoader.shouldInterceptRequest(request.url)

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val url = request.url.toString()
                    return if (url.startsWith("https://appassets.androidforward.site/") || url.startsWith("http://localhost")) {
                        false
                    } else {
                        try { startActivity(Intent(Intent.ACTION_VIEW, url.toUri())) } catch (_: Exception) {}
                        true
                    }
                }
            }

            addJavascriptInterface(NativeBridge(), "AndroidNativeHost")
        }

        setContentView(webView)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val handledByJs = backButtonHandler?.invoke() ?: false
                if (!handledByJs) {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        authenticateForAppUnlock()
        checkNotificationPermission()
    }

    private fun loadAppAfterUnlock() {
        webView.loadUrl("https://appassets.androidforward.site/assets/public/index.html")
        webView.postDelayed({
            webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('jarvis:unlocked'))", null)
        }, 250)
    }

    private fun authenticateForAppUnlock() {
        val manager = BiometricManager.from(this)
        val authenticators = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            BiometricManager.Authenticators.BIOMETRIC_WEAK or BiometricManager.Authenticators.DEVICE_CREDENTIAL
        } else {
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        }

        if (manager.canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            loadAppAfterUnlock()
            return
        }

        val prompt = BiometricPrompt(this, biometricExecutor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                loadAppAfterUnlock()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                // Keep the app closed behind the system prompt. User can retry by relaunching.
                webView.loadDataWithBaseURL(null,
                    "<html><body style='background:#0A0F1E;color:#F5A623;font-family:sans-serif;text-align:center;padding:60px'><h2>JARVIS LOCKED</h2><p>Authenticate with your device biometric or credential to continue.</p></body></html>",
                    "text/html", "UTF-8", null)
            }
        })

        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle("JARVIS Secure Unlock")
            .setSubtitle("Authenticate to open CAT 2026 Command System")
            .setDescription("Face or fingerprint can be used when enrolled on this device.")
            .setAllowedAuthenticators(authenticators)
            .build()

        prompt.authenticate(info)
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            triggerNotificationSetup()
        }
    }

    private fun triggerNotificationSetup() {
        // Intentionally left for the user-controlled Settings flow.
    }

    private fun launchNativeAction(action: String) {
        try {
            when (action.lowercase()) {
                "browser" -> startActivity(Intent(Intent.ACTION_VIEW, "https://www.google.com".toUri()))
                "camera" -> startActivity(Intent("android.media.action.IMAGE_CAPTURE"))
                "settings" -> startActivity(Intent(Settings.ACTION_SETTINGS))
                "wifi" -> startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
                "bluetooth" -> startActivity(Intent(Settings.ACTION_BLUETOOTH_SETTINGS))
                "calendar" -> startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_CALENDAR))
                "clock" -> startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_CLOCK))
                "phone" -> startActivity(Intent(Intent.ACTION_DIAL))
                "messages" -> startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_MESSAGING))
                "whatsapp" -> {
                    val launch = packageManager.getLaunchIntentForPackage("com.whatsapp")
                    if (launch != null) startActivity(launch)
                }
                "youtube" -> startActivity(Intent(Intent.ACTION_VIEW, "https://www.youtube.com".toUri()))
                else -> {}
            }
        } catch (_: Exception) {}
    }

    inner class NativeBridge {
        @JavascriptInterface fun registerBackButton() {
            backButtonHandler = {
                webView.evaluateJavascript("window.onAndroidBackPressed && window.onAndroidBackPressed()", null)
                true
            }
        }

        @JavascriptInterface fun unregisterBackButton() { backButtonHandler = null }

        @JavascriptInterface fun requestNotificationPermission() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                runOnUiThread {
                    requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                }
            }
        }

        @JavascriptInterface fun setNotificationsEnabled(enabled: Boolean) {
            if (enabled) triggerNotificationSetup()
        }

        @JavascriptInterface fun authenticateBiometric() {
            runOnUiThread { authenticateForAppUnlock() }
        }

        @JavascriptInterface fun launchNativeAction(action: String) {
            runOnUiThread { launchNativeAction(action) }
        }

        @JavascriptInterface fun getDeviceCapabilities(): String {
            val manager = BiometricManager.from(this@MainActivity)
            val biometricReady = manager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) == BiometricManager.BIOMETRIC_SUCCESS
            return "{\"biometric\":$biometricReady,\"camera\":true,\"nativeIntents\":true,\"secureUnlock\":true}"
        }
    }
}
