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

    fun createSession(): String {
        val sessionId = LocalDateTime.now().toString()
        val sessionFile = File("$sessionsDir/$sessionId.json")
        sessionFile.writeText(objectMapper.writeValueAsString(Session(sessionId)))
        return sessionId
    }

    fun getSession(sessionId: String): Session {
        val sessionFile = File("$sessionsDir/$sessionId.json")
        return objectMapper.readValue(sessionFile)
    }

    fun getSessions(): List<Session> {
        return File(sessionsDir).listFiles()
            ?.filter { it.extension == "json" }
            ?.map { objectMapper.readValue(it) } ?: emptyList()
    }

    fun updateSession(sessionId: String, messages: List<ChatMessage>) {
        val sessionFile = File("$sessionsDir/$sessionId.json")
        sessionFile.writeText(objectMapper.writeValueAsString(Session(sessionId, messages.toMutableList())))
    }

    fun deleteSession(sessionId: String) {
        File("$sessionsDir/$sessionId.json").delete()
    }
}
