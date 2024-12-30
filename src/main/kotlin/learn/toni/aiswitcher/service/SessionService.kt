package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import learn.toni.aiswitcher.exceptions.SessionNotFoundException
import learn.toni.aiswitcher.exceptions.SessionStorageException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.io.File
import java.time.LocalDateTime
import learn.toni.aiswitcher.model.Session
import learn.toni.aiswitcher.model.ChatMessage
import java.time.format.DateTimeFormatter.ofPattern

@Service
class SessionService {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val objectMapper = jacksonObjectMapper()

    companion object {
        private const val SESSIONS_DIR = "sessions"
        private const val JSON_EXT = "json"
    }

    private val sessionDirectory = File(SESSIONS_DIR).apply {
        if (!exists()) {
            mkdirs().also { success ->
                if (!success) throw SessionStorageException("Failed to create sessions directory")
            }
        }
    }

    fun createSession(provider: String): String = try {
        var sessionId = LocalDateTime.now()
            .format(ofPattern("yyyy-MM-dd_HH:mm:ss"))
        val session = Session(sessionId, provider)
        saveSession(session)
        sessionId
    } catch (e: Exception) {
        logger.error("Failed to create session for provider: $provider", e)
        throw SessionStorageException("Failed to create session", e)
    }

    fun getSession(sessionId: String): Session = try {
        getSessionFile(sessionId).let { file ->
            if (!file.exists()) throw SessionNotFoundException(sessionId)
            objectMapper.readValue(file)
        }
    } catch (e: Exception) {
        logger.error("Failed to get session: $sessionId", e)
        throw when (e) {
            is SessionNotFoundException -> e
            else -> SessionStorageException("Failed to read session: $sessionId", e)
        }
    }

    fun getSessions(): List<Session> = try {
        sessionDirectory.listFiles { file -> file.extension == JSON_EXT }
            ?.mapNotNull { file ->
                runCatching {
                    objectMapper.readValue<Session>(file)
                }.getOrNull()
                    .also { if (it == null) logger.warn("Failed to parse session file: ${file.name}") }
            }
            ?: emptyList()
    } catch (e: Exception) {
        logger.error("Failed to list sessions", e)
        throw SessionStorageException("Failed to list sessions", e)
    }

    fun updateSession(sessionId: String, messages: List<ChatMessage>) = try {
        val session = getSession(sessionId)
        saveSession(session.copy(messages = messages.toMutableList()))
    } catch (e: Exception) {
        logger.error("Failed to update session: $sessionId", e)
        throw when (e) {
            is SessionNotFoundException -> e
            else -> SessionStorageException("Failed to update session: $sessionId", e)
        }
    }

    fun deleteSession(sessionId: String): Boolean = try {
        getSessionFile(sessionId).delete()
    } catch (e: Exception) {
        logger.error("Failed to delete session: $sessionId", e)
        throw SessionStorageException("Failed to delete session: $sessionId", e)
    }

    private fun saveSession(session: Session) {
        getSessionFile(session.id).writeText(objectMapper.writeValueAsString(session))
    }

    private fun getSessionFile(sessionId: String) =
        File(sessionDirectory, "$sessionId.$JSON_EXT")
}

