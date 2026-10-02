package com.cat2026.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ApplicationInfo
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.provider.AlarmClock
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.fragment.app.FragmentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.core.graphics.toColorInt
import androidx.core.net.toUri
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebMessageCompat
import androidx.webkit.WebViewCompat
import androidx.webkit.WebViewFeature
import com.cat2026.app.notifications.ReminderSchedule
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import java.util.concurrent.Executor
import java.util.Locale
import org.json.JSONObject
import javax.crypto.KeyGenerator
import javax.crypto.Mac
import javax.crypto.SecretKey
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties

class MainActivity : FragmentActivity() {

    private lateinit var webView: WebView
    private lateinit var biometricExecutor: Executor
    private var nativeUnlocked = false
    private var speechRecognizer: SpeechRecognizer? = null
    private var voiceListening = false
    private val prefs by lazy { getSharedPreferences("jarvis_security", MODE_PRIVATE) }

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) triggerNotificationSetup()
    }

    private val requestRecordAudioPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) startNativeVoiceRecognition()
        else updateGateMessage("Microphone permission was denied. Use Face / Fingerprint or the JARVIS PIN.")
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
                    val debug = (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0 && url.startsWith("http://localhost")

                    return if (trusted || debug) {
                        false
                    } else {
                        try { startActivity(Intent(Intent.ACTION_VIEW, request.url)) } catch (_: Exception) {}
                        true
                    }
                }
            }

            if (!WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)) {
                throw IllegalStateException("Secure WebMessage bridge is unavailable on this WebView.")
            }
            WebViewCompat.addWebMessageListener(
                this,
                "AndroidNativeHost",
                setOf("https://appassets.androidforward.site"),
                WebViewCompat.WebMessageListener { _, message, sourceOrigin, isMainFrame, replyProxy ->
                    if (!isMainFrame || sourceOrigin.toString() != "https://appassets.androidforward.site") return@WebMessageListener
                    if (message.type != WebMessageCompat.TYPE_STRING) return@WebMessageListener
                    handleBridgeMessage(message.data ?: return@WebMessageListener, replyProxy)
                }
            )
        }

        setContentView(webView)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.url?.startsWith("https://appassets.androidforward.site/assets/public/") == true) {
                    webView.evaluateJavascript("window.dispatchEvent(new Event('android:backbutton'))", null)
                } else {
                    finishAndRemoveTask()
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

    private fun vaultKeyMaterial(): String {
        val key = getOrCreateJarvisKey() ?: throw IllegalStateException("JARVIS keystore unavailable")
        val mac = Mac.getInstance("HmacSHA256")
        mac.init(key)
        return mac.doFinal("CAT2026_JARVIS_SECURE_VAULT_V1".toByteArray(StandardCharsets.UTF_8))
            .joinToString("") { "%02x".format(it) }
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
            "Enter your 6-digit JARVIS PIN, use real Face / Fingerprint, or use Voice → Biometric."
        } else {
            "Create your private 6-digit JARVIS PIN for this device. Voice is only a trigger; identity is still verified by the device."
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
            """request("setPin",{pin}).then(r=>{if(r.ok){setMsg("PIN saved securely. Opening JARVIS...")}else{setMsg("PIN could not be saved. Try again.")}})"""
        } else {
            """request("verifyPin",{pin}).then(r=>{if(r.ok){setMsg("Identity verified. Opening JARVIS...")}else{document.getElementById("pin").value="";setMsg(r.locked?"Security cooldown active. Try again shortly.":"Incorrect PIN. Try again.")}})"""
        }

        val page = """
        <!doctype html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
          <style>
            *{box-sizing:border-box}
            body{margin:0;min-height:100vh;background:radial-gradient(circle at 50% 15%,#0D3135 0,#071519 44%,#020607 100%);color:#fff;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center}
            .gate{width:min(430px,92vw);padding:30px 22px 24px;border:1px solid rgba(99,246,255,.30);border-radius:24px;background:rgba(8,15,27,.94);box-shadow:0 0 50px rgba(99,246,255,.10),inset 0 0 28px rgba(255,255,255,.02);text-align:center}
            .orb{width:92px;height:92px;margin:0 auto 16px;border-radius:50%;border:2px solid #63F6FF;box-shadow:0 0 30px rgba(99,246,255,.28),inset 0 0 24px rgba(99,246,255,.09);display:grid;place-items:center}
            .ring{width:62px;height:62px;border-radius:50%;border:1px solid rgba(147,197,253,.55);display:grid;place-items:center;color:#93C5FD;font-size:18px}
            h1{font-size:22px;letter-spacing:1px;margin:10px 0 6px;color:#63F6FF}
            .sub{font-size:12px;color:#A5B4C7;line-height:1.5;margin:0 auto 18px;max-width:345px}
            .status{font-size:10px;letter-spacing:1.6px;color:#6EE7B7;margin-bottom:12px}
            input{width:100%;padding:15px;border-radius:12px;border:1px solid #34445A;background:#0F1A2B;color:#fff;text-align:center;font-size:23px;letter-spacing:9px;outline:none}
            .confirm{margin-top:10px}
            button{width:100%;padding:14px;margin-top:12px;border:0;border-radius:12px;font-weight:900;cursor:pointer}
            .primary{background:linear-gradient(100deg,#63F6FF,#75F6B0);color:#031113;box-shadow:0 10px 28px rgba(99,246,255,.12)}
            .bio{background:#071A1E;color:#E7FEFF;border:1px solid rgba(99,246,255,.24)}
            .voice{background:#0B1518;color:#B6F9DD;border:1px solid rgba(117,246,176,.24);font-size:12px}
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
            <button class="voice" onclick="voice()">◌ SAY “HEY JARVIS, UNLOCK”</button>

            <div id="msg" class="msg">${messageText}</div>
            <div class="footer">CAT 2026 • JARVIS Personal Command System</div>
          </main>

          <script>
            const pending=new Map();
            let seq=0;
            function request(action,args={}){return new Promise(resolve=>{const id=String(++seq);pending.set(id,resolve);AndroidNativeHost.postMessage(JSON.stringify({id,action,args}))})}
            AndroidNativeHost.onmessage=function(event){try{const r=JSON.parse(event.data);const resolve=pending.get(r.id);if(resolve){pending.delete(r.id);resolve(r)}}catch(_){}}
            function setMsg(t){document.getElementById('msg').textContent=t}
            function submitPin(){
              const pin=document.getElementById('pin').value;
              if(!/^\d{6}$/.test(pin)){setMsg('PIN must be exactly 6 digits.');return}
              ${confirmCheck}
              ${submitLogic}
            }
            function bio(){setMsg('Waiting for real biometric verification...');request('authenticateBiometric')}
            function voice(){setMsg('Listening for “Hey Jarvis, unlock”…');request('startVoiceUnlock')}
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

    private fun updateGateMessage(message: String) {
        runOnUiThread {
            webView.evaluateJavascript(
                "document.getElementById('msg')&&(document.getElementById('msg').textContent=" + JSONObject.quote(message) + ")",
                null
            )
        }
    }

    private fun startNativeVoiceUnlock() {
        if (voiceListening) {
            stopNativeVoiceRecognition("Voice trigger stopped.")
            return
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestRecordAudioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
            return
        }

        startNativeVoiceRecognition()
    }

    private fun startNativeVoiceRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            updateGateMessage("Speech recognition is unavailable on this device. Use Face / Fingerprint or the JARVIS PIN.")
            return
        }

        speechRecognizer?.destroy()
        val recognizer = SpeechRecognizer.createSpeechRecognizer(this)
        speechRecognizer = recognizer
        voiceListening = true

        recognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                updateGateMessage("Listening: say “Hey Jarvis, unlock”.")
            }

            override fun onBeginningOfSpeech() {
                updateGateMessage("Voice detected. Listening for the unlock command…")
            }

            override fun onRmsChanged(rmsdB: Float) = Unit
            override fun onBufferReceived(buffer: ByteArray?) = Unit
            override fun onEndOfSpeech() = Unit

            override fun onError(error: Int) {
                stopNativeVoiceRecognition(
                    if (error == SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)
                        "Microphone permission is required."
                    else
                        "Voice trigger ended. Use Face / Fingerprint or try again."
                )
            }

            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION).orEmpty()
                val heard = matches.joinToString(" ").lowercase(Locale.US)
                    .replace(Regex("[^a-z0-9 ]"), " ")
                    .replace(Regex("\s+"), " ")
                    .trim()

                stopNativeVoiceRecognition("")

                val wake = heard.contains("hey jarvis") || heard.contains("jarvis")
                val unlock = heard.contains("unlock") || heard.contains("open")
                if (wake && unlock) {
                    updateGateMessage("Voice command accepted. Confirm your identity with real Face / Fingerprint.")
                    authenticateBiometricInternal()
                } else {
                    updateGateMessage("Say “Hey Jarvis, unlock” to start biometric verification.")
                }
            }

            override fun onPartialResults(partialResults: Bundle?) = Unit
            override fun onEvent(eventType: Int, params: Bundle?) = Unit
        })

        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.US)
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3)
        }

        try {
            recognizer.startListening(intent)
        } catch (_: Exception) {
            stopNativeVoiceRecognition("Voice trigger could not start. Use Face / Fingerprint or PIN.")
        }
    }

    private fun stopNativeVoiceRecognition(message: String) {
        voiceListening = false
        try { speechRecognizer?.stopListening() } catch (_: Exception) {}
        speechRecognizer?.destroy()
        speechRecognizer = null
        if (message.isNotBlank()) updateGateMessage(message)
    }

    private fun loadAppAfterUnlock() {
        if (!nativeUnlocked) return
        triggerNotificationSetup()
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

    private fun triggerNotificationSetup() {
        if (!nativeUnlocked) return
        ReminderSchedule.createChannel(this)
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
        ) {
            ReminderSchedule.scheduleMorning(this)
            ReminderSchedule.scheduleEvening(this)
        }
    }

    private fun disableNotificationSetup() {
        ReminderSchedule.cancel(this)
    }

    private fun handleBridgeMessage(payload: String, replyProxy: androidx.webkit.JavaScriptReplyProxy) {
        try {
            val request = JSONObject(payload)
            val id = request.optString("id")
            val action = request.optString("action")
            val args = request.optJSONObject("args") ?: JSONObject()
            val response = JSONObject().put("id", id)

            when (action) {
                "exitApp" -> { finishAndRemoveTask(); response.put("ok", true) }
                "requestNotificationPermission" -> {
                    if (nativeUnlocked && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        runOnUiThread { requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS) }
                    }
                    response.put("ok", nativeUnlocked)
                }
                "setNotificationsEnabled" -> {
                    if (nativeUnlocked) {
                        if (args.optBoolean("enabled", false)) triggerNotificationSetup()
                        else disableNotificationSetup()
                    }
                    response.put("ok", nativeUnlocked)
                }
                "authenticateBiometric" -> {
                    runOnUiThread { authenticateBiometricInternal() }
                    response.put("ok", true).put("started", true)
                }
                "startVoiceUnlock" -> {
                    runOnUiThread { startNativeVoiceUnlock() }
                    response.put("ok", true).put("started", true)
                }
                "setPin" -> {
                    val saved = setJarvisPin(args.optString("pin"))
                    if (saved) { nativeUnlocked = true; runOnUiThread { loadAppAfterUnlock() } }
                    response.put("ok", saved)
                }
                "verifyPin" -> {
                    val locked = isNativeRateLimited()
                    val verified = !locked && verifyJarvisPin(args.optString("pin"))
                    if (verified) { nativeUnlocked = true; runOnUiThread { loadAppAfterUnlock() } }
                    response.put("ok", verified).put("locked", locked)
                }
                "launchNativeAction" -> response.put("ok", launchNativeAction(args.optString("action")))
                "getVaultKeyMaterial" -> {
                    if (!nativeUnlocked) {
                        response.put("ok", false).put("error", "Native unlock required")
                    } else {
                        response.put("ok", true).put("vaultKey", vaultKeyMaterial())
                    }
                }
                "getDeviceCapabilities" -> {
                    val biometricReady =
                        BiometricManager.from(this@MainActivity)
                            .canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) ==
                            BiometricManager.BIOMETRIC_SUCCESS
                    response.put("ok", nativeUnlocked)
                    response.put("capabilities", JSONObject()
                        .put("biometric", biometricReady)
                        .put("pinGate", true)
                        .put("secureUnlock", true)
                        .put("voiceTrigger", true)
                        .put("nativeIntents", true))
                }
                else -> response.put("ok", false).put("error", "Unsupported native action")
            }
            replyProxy.postMessage(response.toString())
        } catch (_: Exception) {
            replyProxy.postMessage(JSONObject().put("id", "").put("ok", false).put("error", "Invalid bridge message").toString())
        }
    }

    override fun onDestroy() {
        stopNativeVoiceRecognition("")
        super.onDestroy()
    }

    private fun launchNativeAction(action: String): Boolean {
        if (!nativeUnlocked) return false
        return try {
            when (action.lowercase()) {
                "browser" -> startActivity(Intent(Intent.ACTION_VIEW, "https://www.google.com".toUri()))
                "camera" -> startActivity(Intent("android.media.action.IMAGE_CAPTURE"))
                "settings" -> startActivity(Intent(Settings.ACTION_SETTINGS))
                "wifi" -> startActivity(Intent(Settings.ACTION_WIFI_SETTINGS))
                "bluetooth" -> startActivity(Intent(Settings.ACTION_BLUETOOTH_SETTINGS))
                "calendar" -> startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_CALENDAR))
                "clock" -> startActivity(Intent(AlarmClock.ACTION_SHOW_ALARMS))
                "phone" -> startActivity(Intent(Intent.ACTION_DIAL))
                "messages" -> startActivity(Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_APP_MESSAGING))
                "whatsapp" -> packageManager.getLaunchIntentForPackage("com.whatsapp")?.let { startActivity(it) } ?: return false
                "youtube" -> startActivity(Intent(Intent.ACTION_VIEW, "https://www.youtube.com".toUri()))
                else -> return false
            }
            true
        } catch (_: Exception) { false }
    }
}
