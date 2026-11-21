package com.chronovyu.app

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

private val Context.dataStore by preferencesDataStore(name = "chronovyu_local")
private val TASKS_KEY = stringPreferencesKey("tasks_json")
private val NOTES_KEY = stringPreferencesKey("notes_json")
private val SESSIONS_KEY = stringPreferencesKey("focus_sessions_json")

data class CvTask(val id: String, val title: String, val done: Boolean, val createdAt: Long) {
    fun toJson() = JSONObject().put("id", id).put("title", title).put("done", done).put("createdAt", createdAt)
    companion object {
        fun fromJson(o: JSONObject) = CvTask(o.optString("id", UUID.randomUUID().toString()), o.optString("title"), o.optBoolean("done"), o.optLong("createdAt"))
    }
}

data class CvNote(val id: String, val title: String, val body: String, val updatedAt: Long) {
    fun toJson() = JSONObject().put("id", id).put("title", title).put("body", body).put("updatedAt", updatedAt)
    companion object {
        fun fromJson(o: JSONObject) = CvNote(o.optString("id", UUID.randomUUID().toString()), o.optString("title"), o.optString("body"), o.optLong("updatedAt"))
    }
}

class LocalStore(private val context: Context) {
    val tasks: Flow<List<CvTask>> = context.dataStore.data.map { prefs ->
        parseArray(prefs[TASKS_KEY]).map { CvTask.fromJson(it) }.sortedBy { it.done }
    }
    val notes: Flow<List<CvNote>> = context.dataStore.data.map { prefs ->
        parseArray(prefs[NOTES_KEY]).map { CvNote.fromJson(it) }.sortedByDescending { it.updatedAt }
    }
    val focusSessions: Flow<Int> = context.dataStore.data.map { prefs -> prefs[SESSIONS_KEY]?.toIntOrNull() ?: 0 }

    suspend fun addTask(title: String) {
        val clean = title.trim().take(120)
        require(clean.isNotBlank()) { "Enter a task first." }
        context.dataStore.edit { p ->
            val list = parseArray(p[TASKS_KEY]).toMutableList()
            list.add(JSONObject().put("id", UUID.randomUUID().toString()).put("title", clean).put("done", false).put("createdAt", System.currentTimeMillis()))
            p[TASKS_KEY] = list.toJsonString()
        }
    }

    suspend fun toggleTask(id: String) {
        context.dataStore.edit { p ->
            p[TASKS_KEY] = parseArray(p[TASKS_KEY]).map { o ->
                if (o.optString("id") == id) o.put("done", !o.optBoolean("done")) else o
            }.toJsonString()
        }
    }

    suspend fun deleteTask(id: String) {
        context.dataStore.edit { p -> p[TASKS_KEY] = parseArray(p[TASKS_KEY]).filterNot { it.optString("id") == id }.toJsonString() }
    }

    suspend fun saveNote(title: String, body: String) {
        val cleanTitle = title.trim().take(100)
        val cleanBody = body.trim().take(5000)
        require(cleanTitle.isNotBlank()) { "Give your note a title." }
        require(cleanBody.isNotBlank()) { "Write something to save." }
        context.dataStore.edit { p ->
            val existing = parseArray(p[NOTES_KEY]).filterNot { it.optString("title") == cleanTitle }.toMutableList()
            existing.add(JSONObject().put("id", UUID.randomUUID().toString()).put("title", cleanTitle).put("body", cleanBody).put("updatedAt", System.currentTimeMillis()))
            p[NOTES_KEY] = existing.toJsonString()
        }
    }

    suspend fun deleteNote(id: String) {
        context.dataStore.edit { p -> p[NOTES_KEY] = parseArray(p[NOTES_KEY]).filterNot { it.optString("id") == id }.toJsonString() }
    }

    suspend fun recordFocusSession() {
        context.dataStore.edit { p -> p[SESSIONS_KEY] = ((p[SESSIONS_KEY]?.toIntOrNull() ?: 0) + 1).toString() }
    }

    suspend fun exportJson(): String {
        val p = context.dataStore.data.first()
        return JSONObject()
            .put("product", "CHRONOVYU")
            .put("schemaVersion", 1)
            .put("exportedAt", System.currentTimeMillis())
            .put("tasks", JSONArray(p[TASKS_KEY] ?: "[]"))
            .put("notes", JSONArray(p[NOTES_KEY] ?: "[]"))
            .put("completedFocusSessions", p[SESSIONS_KEY]?.toIntOrNull() ?: 0)
            .toString(2)
    }

}

private fun parseArray(raw: String?): List<JSONObject> {
    if (raw.isNullOrBlank()) return emptyList()
    return try {
        val a = JSONArray(raw)
        (0 until a.length()).mapNotNull { i -> a.optJSONObject(i) }
    } catch (_: Exception) { emptyList() }
}
private fun List<JSONObject>.toJsonString() = JSONArray().also { a -> forEach { a.put(it) } }.toString()
