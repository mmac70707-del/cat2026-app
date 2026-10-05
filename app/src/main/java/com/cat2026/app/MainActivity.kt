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
import android.view.Gravity
import android.widget.FrameLayout
import android.widget.TextView
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
    private lateinit var bootStatus: TextView
    private lateinit var biometricExecutor: Executor
    private var nativeUnlocked = false
    private var speechRecognizer: SpeechRecognizer? = null
    private var voiceListening = false
    private val prefs by lazy { getSharedPreferences("jarvis_security", MODE_PRIVATE) }

    private companion object {
        const val NATIVE_NOTIFICATIONS_ENABLED = "notifications_enabled"
        const val NOTIFICATION_PERMISSION_EVENT = "cat2026:native-notification-permission"
    }

    private val requestNotificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            prefs.edit().putBoolean(NATIVE_NOTIFICATIONS_ENABLED, true).apply()
            triggerNotificationSetup()
        } else {
            prefs.edit().putBoolean(NATIVE_NOTIFICATIONS_ENABLED, false).apply()
            ReminderSchedule.cancel(this)
        }
        emitNotificationPermissionState(isGranted)
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
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            // Vite's public assets remain root-relative (/images/*, /icons/*).
            // Map only those directories explicitly; avoid a catch-all "/" handler.
            .addPathHandler("/images/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/icons/", WebViewAssetLoader.AssetsPathHandler(this))
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
            settings.cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
            setBackgroundColor("#03070A".toColorInt())
            settings.setSupportMultipleWindows(false)
            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage): Boolean {
                    if (consoleMessage.messageLevel() == android.webkit.ConsoleMessage.MessageLevel.ERROR &&
                        ::bootStatus.isInitialized
                    ) {
                        bootStatus.text = "JARVIS LOCAL CORE\nJAVASCRIPT ERROR\n${consoleMessage.message()}"
                        bootStatus.visibility = android.view.View.VISIBLE
                    }
                    return true
                }
            }

            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                    assetLoader.shouldInterceptRequest(request.url)

                override fun onPageStarted(view: WebView, url: String, favicon: android.graphics.Bitmap?) {
                    super.onPageStarted(view, url, favicon)
                    bootStatus.text = "JARVIS LOCAL CORE\nLOADING…"
                    bootStatus.visibility = android.view.View.VISIBLE
                }

                override fun onReceivedError(
                    view: WebView,
                    request: WebResourceRequest,
                    error: android.webkit.WebResourceError
                ) {
                    super.onReceivedError(view, request, error)
                    if (request.isForMainFrame) {
                        bootStatus.text = "JARVIS LOCAL CORE\nLOAD ERROR\n${error.description}"
                        bootStatus.visibility = android.view.View.VISIBLE
                        view.post {
                            view.loadDataWithBaseURL(
                                "https://appassets.androidplatform.net/",
                                """
                                <html><body style="margin:0;background:#03070A;color:#EAFBFC;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center">
                                  <div>
                                    <div style="font-size:11px;letter-spacing:.16em;color:#63F6FF;font-weight:800">JARVIS / LOCAL CORE</div>
                                    <h2 style="font-size:22px;margin:10px 0 6px">App content could not load</h2>
                                    <p style="font-size:13px;line-height:1.5;color:#9BAEB1">The local CAT 2026 engine failed to load. Restart the app after installing the latest build.</p>
                                  </div>
                                </body></html>
                                """.trimIndent(),
                                "text/html",
                                "UTF-8",
                                null
                            )
                        }
                    }
                }

                override fun onPageFinished(view: WebView, url: String) {
                    super.onPageFinished(view, url)
                    bootStatus.visibility = android.view.View.GONE
                    if (nativeUnlocked && url.startsWith("https://appassets.androidplatform.net/assets/")) {
                        view.postDelayed({
                            view.evaluateJavascript(
                                "window.dispatchEvent(new CustomEvent('jarvis:unlocked'))",
                                null
                            )
                        }, 250)
                    }
                }

                override fun onRenderProcessGone(view: WebView, detail: android.webkit.RenderProcessGoneDetail): Boolean {
                    bootStatus.text = "JARVIS LOCAL CORE\nRENDERER RECOVERY…"
                    bootStatus.visibility = android.view.View.VISIBLE
                    view.postDelayed({
                        try {
                            view.destroy()
                            recreate()
                        } catch (_: Exception) {
                            bootStatus.text = "JARVIS LOCAL CORE\nPLEASE RESTART THE APP"
                        }
                    }, 250)
                    return true
                }

                override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage): Boolean {
                    if (consoleMessage.messageLevel() == android.webkit.ConsoleMessage.MessageLevel.ERROR) {
                        bootStatus.text = "JARVIS LOCAL CORE\nJAVASCRIPT ERROR\n${consoleMessage.message()}"
                        bootStatus.visibility = android.view.View.VISIBLE
                    }
                    return true
                }

                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    if (!request.isForMainFrame) return false
                    val url = request.url.toString()
                    val trusted = url.startsWith("https://appassets.androidplatform.net/")
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
                setOf("https://appassets.androidplatform.net"),
                WebViewCompat.WebMessageListener { _, message, sourceOrigin, isMainFrame, replyProxy ->
                    if (!isMainFrame || sourceOrigin.toString() != "https://appassets.androidplatform.net") return@WebMessageListener
                    if (message.type != WebMessageCompat.TYPE_STRING) return@WebMessageListener
                    handleBridgeMessage(message.data ?: return@WebMessageListener, replyProxy)
                }
            )
        }

        bootStatus = TextView(this).apply {
            text = "JARVIS LOCAL CORE\nINITIALISING…"
            setTextColor("#EAFBFC".toColorInt())
            textSize = 14f
            gravity = Gravity.CENTER
            setPadding(32, 24, 32, 24)
            setBackgroundColor("#03070A".toColorInt())
            alpha = 0.98f
        }

        val root = FrameLayout(this).apply {
            setBackgroundColor("#03070A".toColorInt())
            addView(webView, FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            ))
            addView(bootStatus, FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            ).apply {
                gravity = Gravity.CENTER
            })
        }

        setContentView(root)

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.url?.startsWith("https://appassets.androidplatform.net/assets/") == true) {
                    webView.evaluateJavascript("window.dispatchEvent(new Event('android:backbutton'))", null)
                } else {
                    finishAndRemoveTask()
                }
            }
        })

        showJarvisSecurityGate()
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

    private fun emitNotificationPermissionState(granted: Boolean) {
        if (!::webView.isInitialized) return
        val detail = if (granted) "true" else "false"
        webView.post {
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('" + NOTIFICATION_PERMISSION_EVENT + "', {detail:{granted:" + detail + "}}))",
                null
            )
        }
    }

    private fun showJarvisSecurityGate() {
        val hasPin = hasJarvisPin()
        val titleText = if (hasPin) "WELCOME BACK, ASHISH" else "INITIAL JARVIS SETUP"
        val messageText = if (hasPin) {
            "JARVIS is locked. Verify with Face / Fingerprint or your 6-digit PIN."
        } else {
            "Create your private 6-digit JARVIS PIN. Face / Fingerprint will be available after device biometrics are set up."
        }
        val buttonText = if (hasPin) "UNLOCK JARVIS" else "CREATE SECURE PIN"
        val confirmHtml = if (!hasPin) {
            """<input id="confirm" class="pin confirm" inputmode="numeric" maxlength="6" type="password" autocomplete="off" placeholder="CONFIRM PIN">"""
        } else {
            ""
        }
        val confirmCheck = if (!hasPin) {
            """const confirmPin=document.getElementById('confirm').value;if(pin!==confirmPin){setMsg('PINs do not match. Re-enter both.');return;}"""
        } else {
            ""
        }
        val submitLogic = if (!hasPin) {
            """request("setPin",{pin}).then(r=>{setMsg(r.ok?"PIN saved securely. Opening JARVIS...":"PIN could not be saved. Try again.")})"""
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
            :root{--cyan:#63F6FF;--green:#75F6B0;--text:#F6FBFC;--muted:#93A7AA;--line:rgba(99,246,255,.18)}
            body{margin:0;min-height:100vh;background:linear-gradient(160deg,#091719 0%,#04090A 48%,#020405 100%);color:var(--text);font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;padding:12px}
            .gate{width:min(430px,100%);padding:14px;border:1px solid rgba(99,246,255,.28);border-radius:22px;background:linear-gradient(155deg,rgba(10,20,23,.97),rgba(3,8,9,.98));box-shadow:0 22px 60px rgba(0,0,0,.45),inset 0 1px rgba(255,255,255,.04)}
            .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font:800 8px/1 ui-monospace,monospace;letter-spacing:.14em;color:#8DA4A7}
            .brand{display:flex;gap:7px;align-items:center;color:#EEF9FA}.orb{width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 14px rgba(99,246,255,.7)}
            .hero{display:grid;grid-template-columns:112px minmax(0,1fr);gap:13px;align-items:stretch;padding:10px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.018)}
            .photo{width:112px;height:148px;border-radius:12px;overflow:hidden;border:1px solid rgba(99,246,255,.28);background:#081114}
            .photo img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 42%;filter:saturate(.92) contrast(1.02)}
            .hero-copy{display:flex;flex-direction:column;justify-content:center;min-width:0}
            .eyebrow{font:900 7px/1.2 ui-monospace,monospace;letter-spacing:.14em;color:var(--cyan)}
            h1{font-size:20px;line-height:1.03;margin:6px 0 5px;color:#F7FFFF;letter-spacing:-.03em}
            .quote{font-size:11px;line-height:1.48;color:#B8C9CB;margin:0}.quote strong{display:block;color:#F7FFFF}.quote em{display:block;color:var(--cyan);font-style:normal;font-weight:800;margin-top:3px}
            .sub{font-size:9px;line-height:1.4;color:var(--muted);margin:7px 0 0}
            .directive{margin-top:10px;padding:8px 10px;border:1px solid rgba(117,246,176,.18);border-radius:11px;background:rgba(117,246,176,.035);font:800 7px/1.35 ui-monospace,monospace;letter-spacing:.08em;color:#99B6A5}
            .security{margin-top:9px;padding:11px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.014)}
            .label{font:900 7px/1.2 ui-monospace,monospace;letter-spacing:.14em;color:var(--cyan)}
            .status{font-size:11px;font-weight:800;color:#E9F3F4;margin-top:4px}
            .hint{font-size:9px;line-height:1.35;color:var(--muted);margin:5px 0 9px}
            input{width:100%;height:45px;padding:9px 12px;border-radius:11px;border:1px solid rgba(99,246,255,.22);background:#081114;color:#fff;text-align:center;font-size:20px;letter-spacing:8px;outline:none}
            input:focus{border-color:var(--cyan);box-shadow:0 0 0 2px rgba(99,246,255,.08)}
            .confirm{margin-top:7px}
            button{width:100%;min-height:43px;padding:10px;border-radius:11px;font-weight:900;cursor:pointer}
            .primary{margin-top:8px;border:1px solid var(--cyan);background:var(--cyan);color:#031012}
            .bio{margin-top:8px;border:1px solid rgba(99,246,255,.22);background:#07161A;color:#E7FEFF}
            .device{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}
            .device button{margin:0;background:#071215;color:#AFC5C7;border:1px solid rgba(255,255,255,.08);font-size:9px}
            .device button:active,.bio:active,.primary:active{transform:translateY(1px)}
            .msg{min-height:28px;margin-top:7px;font-size:9px;line-height:1.4;color:#B9C9CB;text-align:center}
            .footer{margin-top:8px;text-align:center;font:700 7px/1.25 ui-monospace,monospace;color:#5E7275;letter-spacing:.08em}
            @media(max-width:360px){.gate{padding:10px}.hero{grid-template-columns:94px minmax(0,1fr);gap:10px;padding:8px}.photo{width:94px;height:132px}h1{font-size:17px}.quote{font-size:10px}.sub{font-size:8px}.device button{font-size:8px}}
          </style>
        </head>
        <body>
          <main class="gate">
            <div class="top"><div class="brand"><span class="orb"></span>JARVIS <span>PRIVATE CORE</span></div><div>LOCAL • LOCKED</div></div>
            <section class="hero">
              <div class="photo"><img src="https://appassets.androidplatform.net/assets/images/ashish_lock_portrait.jpg" alt="Ashish"></div>
              <div class="hero-copy">
                <div class="eyebrow">EXECUTION PROTOCOL</div>
                <h1>${titleText}</h1>
                <p class="quote"><strong>DREAM. PLAN. EXECUTE.</strong><em>The work becomes the story.</em></p>
                <p class="sub">CAT 2026 is the mission. JARVIS only opens after identity verification.</p>
              </div>
            </section>
            <section class="security">
              <div class="label">SECURITY CORE</div>
              <div class="status">${if (hasPin) "VERIFY IDENTITY" else "INITIALISE PRIVATE CORE"}</div>
              <div class="hint">${messageText}</div>
              <input id="pin" class="pin" inputmode="numeric" maxlength="6" type="password" autocomplete="off" placeholder="••••••">
              ${confirmHtml}
              <button class="primary" onclick="submitPin()">${buttonText}</button>
              <button class="bio" onclick="bio()">◉ USE FACE / FINGERPRINT</button>
              <div class="device">
                <button onclick="voice()">◌ VOICE TRIGGER</button>
                <button onclick="settings()">⚙ BIOMETRIC SETTINGS</button>
              </div>
              <div id="msg" class="msg">${messageText}</div>
              <div class="directive">SHOW UP • DO THE HARD THING • MOVE FORWARD</div>
              <div class="footer">CAT 2026 • JARVIS PERSONAL COMMAND SYSTEM</div>
            </section>
          </main>
          <script>
            const pending=new Map();let seq=0;
            function request(action,args={}){return new Promise(resolve=>{const id=String(++seq);pending.set(id,resolve);AndroidNativeHost.postMessage(JSON.stringify({id,action,args}))})}
            AndroidNativeHost.onmessage=function(event){try{const r=JSON.parse(event.data);const resolve=pending.get(r.id);if(resolve){pending.delete(r.id);resolve(r)}}catch(_){}}
            function setMsg(t){document.getElementById('msg').textContent=t}
            function submitPin(){
              const pin=document.getElementById('pin').value;
              if(!/^\d{6}$/.test(pin)){setMsg('PIN must be exactly 6 digits.');return}
              ${confirmCheck}
              ${submitLogic}
            }
            function bio(){setMsg('Opening the real Android biometric prompt…');request('authenticateBiometric')}
            function voice(){setMsg('Listening for “Hey Jarvis, unlock”…');request('startVoiceUnlock')}
            function settings(){request('openBiometricSettings')}
          </script>
        </body>
        </html>
        """.trimIndent()

        webView.loadDataWithBaseURL(
            "https://appassets.androidplatform.net/",
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
                    .replace(Regex("\\s+"), " ")
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
        // Notification workers are intentionally controlled by Settings.
        // Do not silently re-enable them just because JARVIS was unlocked.
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html")
        checkNotificationPermission()
    }

    private fun biometricAuthenticators(): Int {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            BiometricManager.Authenticators.BIOMETRIC_WEAK or
                BiometricManager.Authenticators.DEVICE_CREDENTIAL
        } else {
            // Android 10 and below do not support BIOMETRIC_* + DEVICE_CREDENTIAL
            // combinations in BiometricPrompt. Use the biometric sensor directly.
            BiometricManager.Authenticators.BIOMETRIC_WEAK
        }
    }

    private fun biometricAvailabilityMessage(code: Int): String {
        return when (code) {
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED ->
                "No Face / Fingerprint is enrolled for apps. Tap BIOMETRIC SETTINGS and add one first."
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE ->
                "This device is not exposing a biometric sensor to apps. Use the secure JARVIS PIN."
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE ->
                "Biometric hardware is temporarily unavailable. Unlock the phone normally and try again."
            BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED ->
                "Android requires a security update before this biometric method can be used."
            BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED ->
                "This Android version cannot use the requested biometric mode. Use the JARVIS PIN."
            else ->
                "Biometric unlock is unavailable right now. Use the JARVIS PIN or open BIOMETRIC SETTINGS."
        }
    }

    private fun openBiometricSettings() {
        try {
            val intent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Intent(Settings.ACTION_BIOMETRIC_ENROLL)
            } else {
                Intent(Settings.ACTION_SECURITY_SETTINGS)
            }
            startActivity(intent)
        } catch (_: Exception) {
            try { startActivity(Intent(Settings.ACTION_SECURITY_SETTINGS)) } catch (_: Exception) {}
        }
    }

    private fun authenticateBiometricInternal() {
        val manager = BiometricManager.from(this)
        val authenticators = biometricAuthenticators()
        val availability = manager.canAuthenticate(authenticators)

        if (availability != BiometricManager.BIOMETRIC_SUCCESS) {
            updateGateMessage(biometricAvailabilityMessage(availability))
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
                    updateGateMessage("Biometric verified. Opening JARVIS…")
                    loadAppAfterUnlock()
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    updateGateMessage("Biometric not recognised. Try again or use the 6-digit JARVIS PIN.")
                }

                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    val detail = when (errorCode) {
                        BiometricPrompt.ERROR_NEGATIVE_BUTTON,
                        BiometricPrompt.ERROR_USER_CANCELED,
                        BiometricPrompt.ERROR_CANCELED ->
                            "Biometric cancelled. Your PIN is still available."
                        BiometricPrompt.ERROR_LOCKOUT,
                        BiometricPrompt.ERROR_LOCKOUT_PERMANENT ->
                            "Too many biometric attempts. Unlock the phone normally, then try again."
                        else ->
                            "Biometric error: $errString. Use the JARVIS PIN if needed."
                    }
                    updateGateMessage(detail)
                }
            }
        )

        val builder = BiometricPrompt.PromptInfo.Builder()
            .setTitle("JARVIS Secure Unlock")
            .setSubtitle("Face / Fingerprint")
            .setDescription(
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R)
                    "Use your enrolled biometric. Android screen-lock credential is also available as a fallback."
                else
                    "Use your enrolled fingerprint or supported face biometric."
            )
            .setAllowedAuthenticators(authenticators)

        prompt.authenticate(builder.build())
    }

    private fun checkNotificationPermission() {
        if (!nativeUnlocked) return
        if (!prefs.getBoolean(NATIVE_NOTIFICATIONS_ENABLED, false)) return

        if (
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            emitNotificationPermissionState(false)
            return
        }

        triggerNotificationSetup()
    }

    private fun requestNativeNotifications() {
        if (!nativeUnlocked) return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (
                ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                return
            }
        }

        prefs.edit().putBoolean(NATIVE_NOTIFICATIONS_ENABLED, true).apply()
        triggerNotificationSetup()
        emitNotificationPermissionState(true)
    }

    private fun triggerNotificationSetup() {
        if (!nativeUnlocked) return
        ReminderSchedule.createChannel(this)

        if (
            Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.POST_NOTIFICATIONS
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            ReminderSchedule.scheduleMorning(this)
            ReminderSchedule.scheduleEvening(this)
        } else {
            emitNotificationPermissionState(false)
        }
    }

    private fun disableNotificationSetup() {
        prefs.edit().putBoolean(NATIVE_NOTIFICATIONS_ENABLED, false).apply()
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
                    if (nativeUnlocked) {
                        runOnUiThread { requestNativeNotifications() }
                    }
                    response.put("ok", nativeUnlocked)
                }
                "setNotificationsEnabled" -> {
                    if (nativeUnlocked) {
                        if (args.optBoolean("enabled", false)) {
                            runOnUiThread { requestNativeNotifications() }
                        } else {
                            disableNotificationSetup()
                        }
                    }
                    response.put("ok", nativeUnlocked)
                }
                "authenticateBiometric" -> {
                    runOnUiThread { authenticateBiometricInternal() }
                    response.put("ok", true).put("started", true)
                }
                "openBiometricSettings" -> {
                    if (nativeUnlocked || webView.url?.startsWith("https://appassets.androidplatform.net/") == true) {
                        runOnUiThread { openBiometricSettings() }
                    }
                    response.put("ok", true)
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
