package com.chronovyu.app

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.core.content.getSystemService
import androidx.lifecycle.lifecycleScope
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.Worker
import androidx.work.WorkerParameters
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

private val Ink = Color(0xFF111827)
private val Muted = Color(0xFF64748B)
private val Accent = Color(0xFF2563EB)
private val Canvas = Color(0xFFF5F7FB)
private val Green = Color(0xFF15803D)

class MainActivity : ComponentActivity() {
    private lateinit var store: LocalStore
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = LocalStore(applicationContext)
        createNotificationChannel(this)
        setContent { ChronoApp(store, ::scheduleReminder, ::authenticateBiometric, ::exportData) }
    }
    private fun scheduleReminder() {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 2026)
            return
        }
        val request = PeriodicWorkRequestBuilder<DailyReminderWorker>(24, TimeUnit.HOURS).setInitialDelay(1, TimeUnit.HOURS).build()
        WorkManager.getInstance(this).enqueueUniquePeriodicWork("chronovyu-daily-reminder", ExistingPeriodicWorkPolicy.UPDATE, request)
        android.widget.Toast.makeText(this, "Daily reminder scheduled (Android may defer delivery to save battery).", android.widget.Toast.LENGTH_LONG).show()
    }
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 2026 && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) scheduleReminder()
    }
    private fun authenticateBiometric() {
        val authenticators = BiometricManager.Authenticators.BIOMETRIC_STRONG or BiometricManager.Authenticators.DEVICE_CREDENTIAL
        if (BiometricManager.from(this).canAuthenticate(authenticators) != BiometricManager.BIOMETRIC_SUCCESS) {
            android.widget.Toast.makeText(this, "Set up a screen lock or biometric in Android Settings first.", android.widget.Toast.LENGTH_LONG).show()
            return
        }
        BiometricPrompt(this, ContextCompat.getMainExecutor(this), object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                android.widget.Toast.makeText(this@MainActivity, "Device authentication successful.", android.widget.Toast.LENGTH_SHORT).show()
            }
        }).authenticate(BiometricPrompt.PromptInfo.Builder().setTitle("CHRONOVYU secure access").setSubtitle("Confirm your identity").setAllowedAuthenticators(authenticators).build())
    }
    private fun exportData() {
        lifecycleScope.launch {
            val json = store.exportJson()
            val intent = Intent(Intent.ACTION_SEND).apply { type = "application/json"; putExtra(Intent.EXTRA_SUBJECT, "CHRONOVYU data backup"); putExtra(Intent.EXTRA_TEXT, json) }
            startActivity(Intent.createChooser(intent, "Export CHRONOVYU backup"))
        }
    }
}

class DailyReminderWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        createNotificationChannel(applicationContext)
        val notification = NotificationCompat.Builder(applicationContext, "chronovyu_reminders")
            .setSmallIcon(android.R.drawable.ic_popup_reminder).setContentTitle("Your next best action")
            .setContentText("Open CHRONOVYU and choose one meaningful task for today.")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT).setAutoCancel(true).build()
        applicationContext.getSystemService<NotificationManager>()?.notify(2026, notification)
        return Result.success()
    }
}
private fun createNotificationChannel(context: Context) {
    if (Build.VERSION.SDK_INT >= 26) context.getSystemService<NotificationManager>()?.createNotificationChannel(
        NotificationChannel("chronovyu_reminders", "Daily reminders", NotificationManager.IMPORTANCE_DEFAULT).apply { description = "A gentle reminder to review your next action." })
}

private enum class Tab(val label: String) { HOME("Home"), TASKS("Tasks"), FOCUS("Focus"), VAULT("Vault"), JARVIS("JARVIS"), SETTINGS("Settings") }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ChronoApp(store: LocalStore, onReminder: () -> Unit, onBiometric: () -> Unit, onExport: () -> Unit) {
    var selected by remember { mutableStateOf(Tab.HOME) }
    val tasks by store.tasks.collectAsState(initial = emptyList())
    val notes by store.notes.collectAsState(initial = emptyList())
    val sessions by store.focusSessions.collectAsState(initial = 0)
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }
    var toast by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(toast) { toast?.let { snackbar.showSnackbar(it); toast = null } }
    MaterialTheme(colorScheme = lightColorScheme(primary = Accent, background = Canvas, surface = Color.White, onSurface = Ink, secondary = Green)) {
        Scaffold(containerColor = Canvas, topBar = {
            TopAppBar(title = { Column { Text("CHRONOVYU", fontWeight = FontWeight.Black); Text("YOUR PERSONAL COMMAND CENTER", style = MaterialTheme.typography.labelSmall, color = Muted) } },
                actions = { IconButton(onClick = { selected = Tab.SETTINGS }) { Icon(Icons.Default.Settings, contentDescription = "Settings") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Canvas))
        }, bottomBar = {
            NavigationBar(containerColor = Color.White) {
                listOf(Tab.HOME, Tab.TASKS, Tab.FOCUS, Tab.VAULT, Tab.JARVIS).forEach { tab ->
                    val icon = when (tab) { Tab.HOME -> Icons.Default.Home; Tab.TASKS -> Icons.Default.CheckCircle; Tab.FOCUS -> Icons.Default.Timer; Tab.VAULT -> Icons.Default.Bookmarks; else -> Icons.Default.AutoAwesome }
                    NavigationBarItem(selected == tab, { selected = tab }, icon = { Icon(icon, contentDescription = tab.label) }, label = { Text(tab.label, maxLines = 1) })
                }
            }
        }, snackbarHost = { SnackbarHost(snackbar) }) { padding ->
            Box(Modifier.padding(padding).fillMaxSize()) {
                when (selected) {
                    Tab.HOME -> HomeScreen(tasks, notes.size, sessions, { selected = Tab.TASKS }, { selected = Tab.FOCUS })
                    Tab.TASKS -> TasksScreen(tasks, { title -> scope.launch { runCatching { store.addTask(title) }.onSuccess { toast = "Task added" }.onFailure { toast = it.message ?: "Could not add task" } } }, { id -> scope.launch { store.toggleTask(id) } }, { id -> scope.launch { store.deleteTask(id); toast = "Task deleted" } })
                    Tab.FOCUS -> FocusScreen { scope.launch { store.recordFocusSession(); toast = "Focus session saved" } }
                    Tab.VAULT -> VaultScreen(notes, { title, body -> scope.launch { runCatching { store.saveNote(title, body) }.onSuccess { toast = "Note saved on this device" }.onFailure { toast = it.message ?: "Could not save note" } } }, { id -> scope.launch { store.deleteNote(id); toast = "Note deleted" } })
                    Tab.JARVIS -> AssistantScreen()
                    Tab.SETTINGS -> SettingsScreen(onReminder, onBiometric, onExport)
                }
            }
        }
    }
}

@Composable private fun PageTitle(eyebrow: String, title: String, subtitle: String) {
    Column(verticalArrangement = Arrangement.spacedBy(5.dp)) {
        Text(eyebrow.uppercase(), style = MaterialTheme.typography.labelMedium, color = Accent, fontWeight = FontWeight.Bold)
        Text(title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = Ink)
        Text(subtitle, style = MaterialTheme.typography.bodyMedium, color = Muted)
    }
}
@Composable private fun Panel(content: @Composable ColumnScope.() -> Unit) {
    Card(shape = RoundedCornerShape(22.dp), colors = CardDefaults.cardColors(containerColor = Color.White), elevation = CardDefaults.cardElevation(1.dp), modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp), content = content)
    }
}
@Composable private fun MetricCard(label: String, value: String, caption: String, modifier: Modifier = Modifier) {
    Card(modifier, shape = RoundedCornerShape(20.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = Muted, fontWeight = FontWeight.Bold)
            Text(value, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = Ink)
            Text(caption, style = MaterialTheme.typography.labelSmall, color = Muted, maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
    }
}
@Composable private fun HomeScreen(tasks: List<CvTask>, noteCount: Int, sessions: Int, onTasks: () -> Unit, onFocus: () -> Unit) {
    val pending = tasks.count { !it.done }; val done = tasks.count { it.done }
    LazyColumn(Modifier.fillMaxSize().padding(horizontal = 18.dp), contentPadding = PaddingValues(top = 12.dp, bottom = 24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        item { Card(shape = RoundedCornerShape(28.dp), colors = CardDefaults.cardColors(containerColor = Ink), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(22.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("MAKE TODAY COUNT", color = Color(0xFF93C5FD), style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.Bold)
                Text("One clear move.\nThen the next.", color = Color.White, style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold)
                Text("Build momentum without needing a perfect day.", color = Color(0xFFD1D5DB))
                Button(onClick = onTasks) { Text("Choose next action"); Icon(Icons.Default.ArrowForward, null, Modifier.padding(start = 8.dp)) }
            }
        } }
        item { PageTitle("Your snapshot", "Good morning, builder.", "Progress is saved locally on this device.") }
        item { Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            MetricCard("TO DO", pending.toString(), "open tasks", Modifier.weight(1f))
            MetricCard("DONE", done.toString(), "completed", Modifier.weight(1f))
            MetricCard("FOCUS", sessions.toString(), "sessions", Modifier.weight(1f))
        } }
        item { Panel {
            Row(verticalAlignment = Alignment.CenterVertically) { Icon(Icons.Default.Bolt, null, tint = Accent); Text("Your operating rhythm", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold) }
            RhythmRow("01", "Choose one outcome", "Make the next step concrete")
            RhythmRow("02", "Protect a focus block", "Start small; stay present")
            RhythmRow("03", "Close the loop", "Mark progress and reset")
            OutlinedButton(onClick = onFocus, modifier = Modifier.fillMaxWidth()) { Icon(Icons.Default.Timer, null); Text("Start a focus session", Modifier.padding(start = 8.dp)) }
        } }
        item { Panel { Text("Knowledge Vault", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold); Text("$noteCount notes saved on this device", color = Muted); Text("Keep useful ideas, decisions, and lessons close at hand.") } }
    }
}
@Composable private fun RhythmRow(number: String, title: String, subtitle: String) {
    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Box(Modifier.size(34.dp).background(Color(0xFFEFF6FF), CircleShape), contentAlignment = Alignment.Center) { Text(number, color = Accent, fontWeight = FontWeight.Bold) }
        Column(Modifier.weight(1f)) { Text(title, fontWeight = FontWeight.SemiBold); Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Muted) }
    }
}
@Composable private fun EmptyState(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, subtitle: String) {
    Column(Modifier.fillMaxWidth().padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Icon(icon, null, Modifier.size(42.dp), tint = Accent); Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold); Text(subtitle, color = Muted)
    }
}
@Composable private fun TasksScreen(tasks: List<CvTask>, onAdd: (String) -> Unit, onToggle: (String) -> Unit, onDelete: (String) -> Unit) {
    var title by remember { mutableStateOf("") }; var error by remember { mutableStateOf<String?>(null) }
    Column(Modifier.fillMaxSize().padding(horizontal = 18.dp)) {
        Spacer(Modifier.height(12.dp)); PageTitle("Execution", "Tasks that move you forward.", "Create, complete, or remove tasks offline."); Spacer(Modifier.height(18.dp))
        Panel {
            OutlinedTextField(value = title, onValueChange = { title = it.take(120); error = null }, label = { Text("What needs doing?") }, modifier = Modifier.fillMaxWidth(), singleLine = true, keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences), isError = error != null, supportingText = { error?.let { Text(it) } })
            Button(onClick = { if (title.isBlank()) error = "Enter a task first." else { onAdd(title); title = ""; error = null } }, modifier = Modifier.fillMaxWidth()) { Icon(Icons.Default.Add, null); Text("Add task", Modifier.padding(start = 8.dp)) }
        }
        Spacer(Modifier.height(14.dp))
        if (tasks.isEmpty()) EmptyState(Icons.Default.CheckCircle, "A clean slate", "Add one small action to get moving.")
        else LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), contentPadding = PaddingValues(bottom = 24.dp)) {
            items(tasks, key = { it.id }) { task -> Card(shape = RoundedCornerShape(16.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                Row(Modifier.fillMaxWidth().padding(horizontal = 6.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(task.done, { onToggle(task.id) })
                    Text(task.title, Modifier.weight(1f).padding(vertical = 8.dp), color = if (task.done) Muted else Ink, style = MaterialTheme.typography.bodyLarge)
                    IconButton(onClick = { onDelete(task.id) }) { Icon(Icons.Default.DeleteOutline, contentDescription = "Delete task ${task.title}", tint = Muted) }
                }
            } }
        }
    }
}
@Composable private fun FocusScreen(onComplete: () -> Unit) {
    var minutes by remember { mutableIntStateOf(25) }; var remaining by remember { mutableIntStateOf(1500) }; var running by remember { mutableStateOf(false) }; var completed by remember { mutableStateOf(false) }
    LaunchedEffect(running, remaining) { if (running && remaining > 0) { delay(1000); remaining--; if (remaining == 0) { running = false; completed = true; onComplete() } } }
    val time = "${(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}"
    Column(Modifier.fillMaxSize().padding(22.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
        PageTitle("Deep work", "Protect your attention.", "A local timer. No account or network required.")
        Panel {
            Box(Modifier.fillMaxWidth().padding(vertical = 22.dp), contentAlignment = Alignment.Center) { Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(Icons.Default.Timer, null, Modifier.size(36.dp), tint = Accent); Text(time, style = MaterialTheme.typography.displayLarge, fontWeight = FontWeight.Bold, color = Ink)
                Text(if (completed) "Session complete — nice work." else if (running) "Stay with one thing." else "Choose a block and begin.", color = Muted)
            } }
            if (!running && remaining == minutes * 60) Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { listOf(15, 25, 50).forEach { m -> FilterChip(minutes == m, { minutes = m; remaining = m * 60; completed = false }, label = { Text("$m min") }) } }
            Button(onClick = { if (running) running = false else { if (remaining == 0) remaining = minutes * 60; completed = false; running = true } }, modifier = Modifier.fillMaxWidth()) { Icon(if (running) Icons.Default.Pause else Icons.Default.PlayArrow, null); Text(if (running) "Pause session" else "Start focus", Modifier.padding(start = 8.dp)) }
            OutlinedButton(onClick = { running = false; remaining = minutes * 60; completed = false }, modifier = Modifier.fillMaxWidth()) { Text("Reset timer") }
        }
        Text("A session is counted when the timer finishes.", color = Muted, style = MaterialTheme.typography.bodySmall)
    }
}
@Composable private fun VaultScreen(notes: List<CvNote>, onSave: (String, String) -> Unit, onDelete: (String) -> Unit) {
    var title by remember { mutableStateOf("") }; var body by remember { mutableStateOf("") }; var error by remember { mutableStateOf<String?>(null) }
    Column(Modifier.fillMaxSize().padding(horizontal = 18.dp)) {
        Spacer(Modifier.height(12.dp)); PageTitle("Knowledge", "Your personal vault.", "Notes stay on this device; nothing is uploaded."); Spacer(Modifier.height(16.dp))
        Panel {
            OutlinedTextField(title, { title = it.take(100); error = null }, label = { Text("Note title") }, modifier = Modifier.fillMaxWidth(), singleLine = true, isError = error != null)
            OutlinedTextField(body, { body = it.take(5000); error = null }, label = { Text("Idea, lesson, or decision") }, modifier = Modifier.fillMaxWidth(), minLines = 3, maxLines = 6)
            error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            Button(onClick = { if (title.isBlank() || body.isBlank()) error = "A title and note are both required." else { onSave(title, body); title = ""; body = ""; error = null } }, modifier = Modifier.fillMaxWidth()) { Icon(Icons.Default.Save, null); Text("Save note", Modifier.padding(start = 8.dp)) }
        }
        Spacer(Modifier.height(12.dp))
        if (notes.isEmpty()) EmptyState(Icons.Default.Bookmarks, "Save a useful idea", "Your first note will appear here.")
        else LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp), contentPadding = PaddingValues(bottom = 24.dp)) { items(notes, key = { it.id }) { note -> Panel {
            Row(verticalAlignment = Alignment.CenterVertically) { Text(note.title, Modifier.weight(1f), fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium); IconButton(onClick = { onDelete(note.id) }) { Icon(Icons.Default.DeleteOutline, contentDescription = "Delete note ${note.title}") } }
            Text(note.body, color = Muted)
        } } }
    }
}
@Composable private fun AssistantScreen() {
    Column(Modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        PageTitle("JARVIS", "Your thinking partner.", "AI integration is intentionally not simulated.")
        Panel {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(Modifier.size(44.dp).background(Color(0xFFFFF7ED), CircleShape), contentAlignment = Alignment.Center) { Icon(Icons.Default.CloudOff, null, tint = Color(0xFFB45309)) }
                Column(Modifier.weight(1f)) { Text("Online service not configured", fontWeight = FontWeight.Bold); Text("No verified API endpoint or key is set up.", color = Muted, style = MaterialTheme.typography.bodySmall) }
            }
            HorizontalDivider(); Text("What works today", fontWeight = FontWeight.SemiBold)
            Text("• Tasks, notes, timer, and reminders work locally.\\n• No fake AI replies or pretend sign-in.\\n• Connect a secure backend later to enable chat and account sync.", color = Muted)
            Text("Never put a private AI API key in the Android app. Configure a secure backend first.", style = MaterialTheme.typography.bodySmall, color = Muted)
        }
    }
}
@Composable private fun SettingsScreen(onReminder: () -> Unit, onBiometric: () -> Unit, onExport: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        PageTitle("Control & privacy", "Your app, your data.", "Offline-first by design.")
        Panel {
            SettingRow(Icons.Default.NotificationsActive, "Daily reminder", "Schedule a reminder with Android WorkManager.", onReminder); HorizontalDivider()
            SettingRow(Icons.Default.Fingerprint, "Verify with device security", "Open the biometric or device credential prompt.", onBiometric); HorizontalDivider()
            SettingRow(Icons.Default.FileDownload, "Export a backup", "Share a JSON copy of tasks, notes, and focus count.", onExport)
        }
        Panel {
            Text("Privacy & service status", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            StatusLine("Tasks and notes", "On device", Green); StatusLine("Cloud account sync", "Not configured", Color(0xFFB45309))
            StatusLine("AI assistant API", "Not configured", Color(0xFFB45309)); StatusLine("Backup restore/import", "Not available yet", Muted)
        }
        Text("CHRONOVYU Native · 1.0.0 · Local notes are not encrypted by a dedicated vault layer. Do not store passwords or highly sensitive secrets in notes.", style = MaterialTheme.typography.bodySmall, color = Muted)
    }
}
@Composable private fun SettingRow(icon: androidx.compose.ui.graphics.vector.ImageVector, title: String, subtitle: String, action: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable(onClick = action).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Icon(icon, null, tint = Accent); Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) { Text(title, fontWeight = FontWeight.SemiBold); Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Muted) }
        Icon(Icons.Default.ChevronRight, null, tint = Muted)
    }
}
@Composable private fun StatusLine(title: String, status: String, color: Color) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
        Text(title, color = Ink, modifier = Modifier.weight(1f)); Text(status, color = color, style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.SemiBold)
    }
}
