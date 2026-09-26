package com.cat2026.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.ViewGroup
import android.view.WindowManager
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
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import java.util.concurrent.Executor
import javax.crypto.KeyGenerator
import javax.crypto.Mac
import javax.crypto.SecretKey
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var biometricExecutor: Executor
    private var backButtonHandler: (() -> Boolean)? = null
    private var nativeUnlocked = false
    private val prefs by lazy { getSharedPreferences("jarvis_security", MODE_PRIVATE) }

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) triggerNotificationSetup()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.navigationBarColor = "#03070A".toColorInt()
        window.statusBarColor = "#03070A".toColorInt()
        window.addFlags(WindowManager.LayoutParams.FLAG_SECURE)
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
            settings.allowFileAccessFromFileURLs = false
            settings.allowUniversalAccessFromFileURLs = false
            settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW
            settings.safeBrowsingEnabled = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            settings.setSupportMultipleWindows(false)
            webChromeClient = WebChromeClient()

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                    assetLoader.shouldInterceptRequest(request.url)

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    if (!request.isForMainFrame) return false
                    val url = request.url.toString()
                    val trusted = url.startsWith("https://appassets.androidforward.site/")
                    val debug = BuildConfig.DEBUG && url.startsWith("http://localhost")

                    return if (trusted || debug) {
                        false
                    } else {
                        try { startActivity(Intent(Intent.ACTION_VIEW, request.url)) } catch (_: Exception) {}
                        true
                    }
                }
            }

            addJavascriptInterface(NativeBridge(), "AndroidNativeHost")
        }

        setContentView(webView)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val handled = backButtonHandler?.invoke() ?: false
                if (!handled) {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        showJarvisSecurityGate()
        checkNotificationPermission()
    }

    private fun hasJarvisPin(): Boolean =
        prefs.getBoolean("pin_configured", false) &&
        !prefs.getString("pin_digest", null).isNullOrBlank()

    private fun getOrCreateJarvisKey(): SecretKey? {
        return try {
            val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
            val alias = "JARVIS_PIN_HMAC_KEY"

            if (!keyStore.containsAlias(alias)) {
                val generator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_HMAC_SHA256,
                    "AndroidKeyStore"
                )
                generator.init(
                    KeyGenParameterSpec.Builder(
                        alias,
                        KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
                    ).build()
                )
                generator.generateKey()
            }

            keyStore.getKey(alias, null) as? SecretKey
        } catch (_: Exception) {
            null
        }
    }

    private fun pinDigest(pin: String): String? {
        return try {
            val key = getOrCreateJarvisKey() ?: return null
            val mac = Mac.getInstance("HmacSHA256")
            mac.init(key)
            mac.doFinal(pin.toByteArray(StandardCharsets.UTF_8))
                .joinToString("") { "%02x".format(it) }
        } catch (_: Exception) {
            null
        }
    }

    private fun setJarvisPin(pin: String): Boolean {
        if (hasJarvisPin()) return false
        if (!pin.matches(Regex("\\d{6}"))) return false
        val digest = pinDigest(pin) ?: return false

        prefs.edit()
            .putString("pin_digest", digest)
            .putBoolean("pin_configured", true)
            .apply()

        return true
    }

    private fun isNativeRateLimited(): Boolean =
        System.currentTimeMillis() < prefs.getLong("pin_lock_until", 0L)

    private fun clearNativeFailures() {
        prefs.edit().remove("pin_failures").remove("pin_lock_until").apply()
    }

    private fun recordNativeFailure() {
        val attempts = prefs.getInt("pin_failures", 0) + 1
        val cooldownMs = minOf(15 * 60_000L, 1000L * (1L shl minOf(attempts - 1, 10)))
        prefs.edit()
            .putInt("pin_failures", attempts)
            .putLong("pin_lock_until", System.currentTimeMillis() + cooldownMs)
            .apply()
    }

    private fun verifyJarvisPin(pin: String): Boolean {
        if (!pin.matches(Regex("\\d{6}"))) return false
        if (isNativeRateLimited()) return false

        val expected = prefs.getString("pin_digest", null) ?: return false
        val actual = pinDigest(pin) ?: return false
        val valid = java.security.MessageDigest.isEqual(
            expected.toByteArray(StandardCharsets.UTF_8),
            actual.toByteArray(StandardCharsets.UTF_8)
        )

        if (valid) clearNativeFailures() else recordNativeFailure()
        return valid
    }

    private fun showJarvisSecurityGate() {
        val hasPin = hasJarvisPin()

        val titleText = if (hasPin) "WELCOME BACK, ASHISH" else "INITIAL JARVIS SETUP"
        val subtitleText = if (hasPin) {
            "Enter your 6-digit JARVIS PIN or use biometric unlock."
        } else {
            "Create your private 6-digit JARVIS PIN for this device."
        }
        val buttonText = if (hasPin) "UNLOCK JARVIS" else "CREATE SECURE PIN"
        val messageText = if (hasPin) {
            "JARVIS is locked. Verify your identity to continue."
        } else {
            "Create a 6-digit PIN, confirm it once, then JARVIS will unlock."
        }
        val confirmHtml = if (!hasPin) {
            """<input id="confirm" class="confirm" inputmode="numeric" maxlength="6" type="password" autocomplete="off" placeholder="CONFIRM PIN">"""
        } else {
            ""
        }
        val confirmCheck = if (!hasPin) {
            """const confirmPin=document.getElementById('confirm').value;if(pin!==confirmPin){setMsg('PINs do not match. Re-enter both.');return}"""
        } else {
            ""
        }
        val submitLogic = if (!hasPin) {
            """const saved=AndroidNativeHost.setJarvisPin(pin);if(saved){setMsg('PIN saved securely. Opening JARVIS...');setTimeout(()=>AndroidNativeHost.unlockApp(),300)}else{setMsg('PIN could not be saved. Try again.')}"""
        } else {
            """const ok=AndroidNativeHost.verifyJarvisPin(pin);if(ok){setMsg('Identity verified. Opening JARVIS...');setTimeout(()=>AndroidNativeHost.unlockApp(),250)}else{document.getElementById('pin').value='';setMsg('Incorrect PIN. Try again.')}"""
        }

        val page = """
        <!doctype html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
          <style>
            *{box-sizing:border-box}
            body{margin:0;min-height:100vh;background:radial-gradient(circle at 50% 15%,#173a63 0,#091423 44%,#04080e 100%);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center}
            .gate{width:min(430px,92vw);padding:30px 22px 24px;border:1px solid rgba(245,166,35,.65);border-radius:24px;background:rgba(8,15,27,.94);box-shadow:0 0 50px rgba(245,166,35,.15),inset 0 0 28px rgba(255,255,255,.02);text-align:center}
            .orb{width:92px;height:92px;margin:0 auto 16px;border-radius:50%;border:2px solid #F5A623;box-shadow:0 0 30px rgba(245,166,35,.7),inset 0 0 24px rgba(245,166,35,.12);display:grid;place-items:center}
            .ring{width:62px;height:62px;border-radius:50%;border:1px solid rgba(147,197,253,.55);display:grid;place-items:center;color:#93C5FD;font-size:18px}
            h1{font-size:22px;letter-spacing:1px;margin:10px 0 6px;color:#F5A623}
            .sub{font-size:12px;color:#A5B4C7;line-height:1.5;margin:0 auto 18px;max-width:345px}
            .status{font-size:10px;letter-spacing:1.6px;color:#6EE7B7;margin-bottom:12px}
            input{width:100%;padding:15px;border-radius:12px;border:1px solid #34445A;background:#0F1A2B;color:#fff;text-align:center;font-size:23px;letter-spacing:9px;outline:none}
            .confirm{margin-top:10px}
            button{width:100%;padding:14px;margin-top:12px;border:0;border-radius:12px;font-weight:900;cursor:pointer}
            .primary{background:#F5A623;color:#08101D}
            .bio{background:#19283B;color:#fff;border:1px solid #3D5069}
            .msg{min-height:34px;margin-top:10px;font-size:12px;color:#CBD5E1;line-height:1.45}
            .footer{margin-top:14px;font-size:10px;color:#64748B}
          </style>
        </head>
        <body>
          <main class="gate">
            <div class="orb"><div class="ring">◉</div></div>
            <div class="status">JARVIS SECURITY LAYER • LOCAL DEVICE</div>
            <h1>${titleText}</h1>
            <p class="sub">${subtitleText}</p>

            <input id="pin" inputmode="numeric" maxlength="6" type="password" autocomplete="off" placeholder="••••••">
            ${confirmHtml}

            <button class="primary" onclick="submitPin()">${buttonText}</button>
            <button class="bio" onclick="bio()">◉ USE FACE / FINGERPRINT</button>

            <div id="msg" class="msg">${messageText}</div>
            <div class="footer">CAT 2026 • JARVIS Personal Command System</div>
          </main>

          <script>
            function setMsg(t){document.getElementById('msg').textContent=t}
            function submitPin(){
              const pin=document.getElementById('pin').value;
              if(!/^\d{6}$/.test(pin)){setMsg('PIN must be exactly 6 digits.');return}
              ${confirmCheck}
              ${submitLogic}
            }
            function bio(){AndroidNativeHost.authenticateBiometric()}
          </script>
        </body>
        </html>
        """.trimIndent()

        webView.loadDataWithBaseURL(
            "https://appassets.androidforward.site/",
            page,
            "text/html",
            "UTF-8",
            null
        )
    }

    private fun loadAppAfterUnlock() {
        if (!nativeUnlocked) return
        webView.loadUrl("https://appassets.androidforward.site/assets/public/index.html")
        webView.postDelayed({
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('jarvis:unlocked'))",
                null
            )
        }, 300)
    }

    private fun authenticateBiometricInternal() {
        val manager = BiometricManager.from(this)
        val authenticators = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
        } else {
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        }

        if (manager.canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            runOnUiThread {
                webView.evaluateJavascript(
                    "document.getElementById('msg')&&(document.getElementById('msg').textContent='Biometric unlock is unavailable. Use the JARVIS PIN.')",
                    null
                )
            }
            return
        }

        val prompt = BiometricPrompt(
            this,
            biometricExecutor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    nativeUnlocked = true
                    clearNativeFailures()
                    loadAppAfterUnlock()
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    runOnUiThread {
                        webView.evaluateJavascript(
                            "document.getElementById('msg')&&(document.getElementById('msg').textContent='Biometric cancelled. You can still use the PIN.')",
                            null
                        )
                    }
                }
            }
        )

        val info = BiometricPrompt.PromptInfo.Builder()
            .setTitle("JARVIS Secure Unlock")
            .setSubtitle("Verify your identity")
            .setDescription("Use supported face/fingerprint or your Android device credential.")
            .setAllowedAuthenticators(authenticators)
            .build()

        prompt.authenticate(info)
    }

    private fun checkNotificationPermission() {
        if (!nativeUnlocked) return

        if (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            triggerNotificationSetup()
        }
    }

    private fun triggerNotificationSetup() {}

    private fun launchNativeAction(action: String) {
        if (!nativeUnlocked) return
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
                "whatsapp" -> packageManager.getLaunchIntentForPackage("com.whatsapp")?.let { startActivity(it) }
                "youtube" -> startActivity(Intent(Intent.ACTION_VIEW, "https://www.youtube.com".toUri()))
            }
        } catch (_: Exception) {}
    }

    inner class NativeBridge {
        @JavascriptInterface
        fun exitApp() {
            finishAndRemoveTask()
        }

        @JavascriptInterface
        fun registerBackButton() {
            backButtonHandler = {
                webView.evaluateJavascript(
                    "window.onAndroidBackPressed && window.onAndroidBackPressed()",
                    null
                )
                true
            }
        }

        @JavascriptInterface
        fun unregisterBackButton() {
            backButtonHandler = null
        }

        @JavascriptInterface
        fun requestNotificationPermission() {
            if (!nativeUnlocked) return
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                runOnUiThread {
                    requestNotificationPermissionLauncher.launch(
                        Manifest.permission.POST_NOTIFICATIONS
                    )
                }
            }
        }

        @JavascriptInterface
        fun setNotificationsEnabled(enabled: Boolean) {
            if (!nativeUnlocked) return
            if (enabled) triggerNotificationSetup()
        }

        @JavascriptInterface
        fun authenticateBiometric() {
            runOnUiThread { authenticateBiometricInternal() }
        }

        @JavascriptInterface
        fun setJarvisPin(pin: String): Boolean {
            val saved = this@MainActivity.setJarvisPin(pin)
            if (saved) nativeUnlocked = true
            return saved
        }

        @JavascriptInterface
        fun verifyJarvisPin(pin: String): Boolean {
            if (isNativeRateLimited()) return false
            val verified = this@MainActivity.verifyJarvisPin(pin)
            if (verified) nativeUnlocked = true
            return verified
        }

        @JavascriptInterface
        fun unlockApp() {
            runOnUiThread { loadAppAfterUnlock() }
        }

        @JavascriptInterface
        fun launchNativeAction(action: String) {
            runOnUiThread { launchNativeAction(action) }
        }

        @JavascriptInterface
        fun getDeviceCapabilities(): String {
            val biometricReady =
                BiometricManager.from(this@MainActivity)
                    .canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) ==
                    BiometricManager.BIOMETRIC_SUCCESS

            return "{"biometric":$biometricReady,"pinGate":true,"secureUnlock":true,"nativeIntents":true}"
        }
    }
}
