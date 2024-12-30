package learn.toni.aiswitcher.exceptions

sealed class SessionException(message: String, cause: Throwable? = null) :
    RuntimeException(message, cause)

class SessionNotFoundException(sessionId: String) :
    SessionException("Session not found: $sessionId")

class SessionStorageException(message: String, cause: Throwable? = null) :
    SessionException(message, cause)
