package learn.toni.aiswitcher.model

import com.fasterxml.jackson.annotation.JsonValue

data class ChatMessage(
    val role: Role,
    val content: String,
    val timestamp: String = java.time.LocalDateTime.now().toString()
)

enum class Role(@get:JsonValue val value: String) {
    USER("user"),
    SYSTEM("system"),
    ASSISTANT("assistant")
}
