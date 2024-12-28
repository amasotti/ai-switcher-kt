package learn.toni.aiswitcher.service

import learn.toni.aiswitcher.model.ChatMessage


interface AIServiceProvider {
    fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String
}
