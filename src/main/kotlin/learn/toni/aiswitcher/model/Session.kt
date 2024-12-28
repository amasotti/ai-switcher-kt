package learn.toni.aiswitcher.model

data class Session(
    val id: String,
    val provider: String, // e.g., "DeepSeek", "ChatGPT", "Claude"
    val messages: MutableList<ChatMessage> = mutableListOf()
)
