package com.cat2026.app.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import com.cat2026.app.MainActivity
import com.cat2026.app.R
import java.time.LocalDate
import java.time.ZoneId
import java.util.concurrent.TimeUnit

/**
 * Two real, locally-scheduled reminders — deliberately just two, not
 * one per study block, to respect the app's own "no notification
 * spam" rule. Fires via WorkManager, which is Android's recommended
 * mechanism for periodic background work; per Android's own platform
 * guidance this is battery-friendly and INEXACT — it targets the
 * scheduled time but the OS may shift it somewhat under Doze/battery
 * optimization. That's the honest, correct trade-off for this kind of
 * reminder (Android explicitly reserves exact-alarm delivery for
 * alarm-clock/calendar apps, not study reminders like this).
 *
 * CAT_DATE is duplicated here from the web app's `Config.CAT_DATE`
 * (src/data/config.ts) because this is a separate Kotlin runtime with
 * no shared module between them. If the exam date ever changes,
 * update BOTH places.
 */
object ReminderSchedule {
    const val CHANNEL_ID = "cat2026_daily_reminders"
    const val MORNING_WORK_NAME = "cat2026_morning_mission"
    const val EVENING_WORK_NAME = "cat2026_evening_error_log"
    private val APP_ZONE: ZoneId = ZoneId.of("Asia/Kolkata")

    val CAT_EXAM_DATE: LocalDate = LocalDate.of(2026, 11, 29)

    fun createChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = context.getSystemService(NotificationManager::class.java)
        val channel = NotificationChannel(
            CHANNEL_ID,
            "CAT 2026 Daily Reminders",
            NotificationManager.IMPORTANCE_DEFAULT
        ).apply {
            description = "Two daily check-ins: morning mission and evening error log."
            enableLights(true)
            lightColor = Color.parseColor("#F5A623")
        }
        manager.createNotificationChannel(channel)
    }

    fun scheduleMorning(context: Context) {
        val delay = nextDelayMillis(5, 0) ?: return
        val request = OneTimeWorkRequestBuilder<MorningMissionWorker>()
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .build()
        WorkManager.getInstance(context).enqueueUniqueWork(MORNING_WORK_NAME, ExistingWorkPolicy.REPLACE, request)
    }

    fun scheduleEvening(context: Context) {
        val delay = nextDelayMillis(21, 0) ?: return
        val request = OneTimeWorkRequestBuilder<EveningErrorLogWorker>()
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .build()
        WorkManager.getInstance(context).enqueueUniqueWork(EVENING_WORK_NAME, ExistingWorkPolicy.REPLACE, request)
    }

    fun cancel(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(MORNING_WORK_NAME)
        WorkManager.getInstance(context).cancelUniqueWork(EVENING_WORK_NAME)
    }

    /** Sends a single diagnostic notification without altering the reminder schedule. */
    fun sendTestNotification(context: Context): Boolean {
        return try {
            createChannel(context)
            showNotification(
                context,
                id = 1003,
                title = "CAT 2026 • Test notification",
                text = "Android can display app notifications. Your scheduled reminders remain unchanged."
            )
            true
        } catch (_: Exception) {
            // The app may be blocked by OS notification settings or permission.
            false
        }
    }

    fun daysLeft(): Long {
        val today = LocalDate.now(APP_ZONE)
        return (CAT_EXAM_DATE.toEpochDay() - today.toEpochDay()).coerceAtLeast(0)
    }

    fun nextDelayMillis(hour: Int, minute: Int): Long? {
        val now = java.time.LocalDateTime.now(APP_ZONE)
        if (now.toLocalDate().isAfter(CAT_EXAM_DATE)) return null

        var target = now.withHour(hour).withMinute(minute).withSecond(0).withNano(0)
        if (target.isBefore(now)) target = target.plusDays(1)
        if (target.toLocalDate().isAfter(CAT_EXAM_DATE)) return null

        return java.time.Duration.between(now, target).toMillis().coerceAtLeast(0L)
    }
}

class MorningMissionWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        showNotification(
            applicationContext,
            id = 1001,
            title = "CAT 2026 — ${ReminderSchedule.daysLeft()} days left",
            text = "Today's mission is ready. Open the app to see your #1 priority.",
        )
        ReminderSchedule.scheduleMorning(applicationContext)
        return Result.success()
    }
}

class EveningErrorLogWorker(ctx: Context, params: WorkerParameters) : CoroutineWorker(ctx, params) {
    override suspend fun doWork(): Result {
        showNotification(
            applicationContext,
            id = 1002,
            title = "Error Log + Analysis time",
            text = "Classify today's mistakes before you close the day. Repair > Reattempt.",
        )
        ReminderSchedule.scheduleEvening(applicationContext)
        return Result.success()
    }
}

private fun showNotification(context: Context, id: Int, title: String, text: String) {
    val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val openIntent = Intent(context, MainActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val pendingIntent = PendingIntent.getActivity(
        context, id, openIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    val notification = NotificationCompat.Builder(context, ReminderSchedule.CHANNEL_ID)
        .setSmallIcon(R.drawable.ic_stat_cat)
        .setContentTitle(title)
        .setContentText(text)
        .setStyle(NotificationCompat.BigTextStyle().bigText(text))
        .setPriority(NotificationCompat.PRIORITY_DEFAULT)
        .setContentIntent(pendingIntent)
        .setAutoCancel(true)
        .build()

    manager.notify(id, notification)
}

