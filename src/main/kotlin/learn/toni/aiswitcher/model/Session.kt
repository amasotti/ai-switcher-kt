package learn.toni.aiswitcher.model

data class Session(
    val id: String,
    val messages: MutableList<ChatMessage> = mutableListOf()
)
