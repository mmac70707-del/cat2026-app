package com.chronovyu.app

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class LocalStoreModelTest {
    @Test fun taskRoundTripsThroughJson() {
        val original = CvTask("task-1", "Review a mock", false, 123L)
        val decoded = CvTask.fromJson(original.toJson())
        assertEquals(original, decoded)
    }

    @Test fun taskDefaultsAreSafeForMissingFields() {
        val decoded = CvTask.fromJson(JSONObject().put("title", "Read one passage"))
        assertEquals("Read one passage", decoded.title)
        assertFalse(decoded.done)
        assertTrue(decoded.id.isNotBlank())
    }

    @Test fun noteRoundTripsThroughJson() {
        val original = CvNote("note-1", "Insight", "Small systems compound.", 456L)
        assertEquals(original, CvNote.fromJson(original.toJson()))
    }
}
