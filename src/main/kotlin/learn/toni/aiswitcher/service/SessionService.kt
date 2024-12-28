package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.stereotype.Service
import java.io.File
import java.time.LocalDateTime
import learn.toni.aiswitcher.model.Session
import learn.toni.aiswitcher.model.ChatMessage

@Service
class SessionService {

    private val sessionsDir = "sessions"
    private val objectMapper = jacksonObjectMapper()

    init {
        File(sessionsDir).mkdirs()
    }

    /**
     * Creates a new session with the specified provider.
     *
     * @param provider The AI provider (e.g., "DeepSeek", "ChatGPT", "Claude").
     * @return The ID of the created session.
     */
    fun createSession(provider: String): String {
        val sessionId = LocalDateTime.now().toString()
        val sessionFile = File("$sessionsDir/$sessionId.json")
        sessionFile.writeText(objectMapper.writeValueAsString(Session(sessionId, provider)))
        return sessionId
    }

    /**
     * Retrieves a session by its ID.
     *
     * @param sessionId The ID of the session.
     * @return The session object.
     */
    fun getSession(sessionId: String): Session {
        val sessionFile = File("$sessionsDir/$sessionId.json")
        return objectMapper.readValue(sessionFile)
    }

    /**
     * Retrieves all sessions.
     *
     * @return A list of all sessions.
     */
    fun getSessions(): List<Session> {
        return File(sessionsDir).listFiles()
            ?.filter { it.extension == "json" }
            ?.map { objectMapper.readValue<Session>(it) } ?: emptyList()
    }

    /**
     * Updates a session with new messages.
     *
     * @param sessionId The ID of the session.
     * @param messages The list of messages to update the session with.
     */
    fun updateSession(sessionId: String, messages: List<ChatMessage>) {
        val sessionFile = File("$sessionsDir/$sessionId.json")
        val session = getSession(sessionId)
        sessionFile.writeText(objectMapper.writeValueAsString(session.copy(messages = messages.toMutableList())))
    }

    /**
     * Deletes a session by its ID.
     *
     * @param sessionId The ID of the session to delete.
     */
    fun deleteSession(sessionId: String) {
        File("$sessionsDir/$sessionId.json").delete()
    }
}
