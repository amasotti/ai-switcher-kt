package learn.toni.aiswitcher.model

import com.anthropic.models.MessageParam
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

fun Role.toAnthropicRole() = when (this) {
    Role.USER -> MessageParam.Role.USER
    Role.SYSTEM -> MessageParam.Role.ASSISTANT
    Role.ASSISTANT -> MessageParam.Role.ASSISTANT
}
