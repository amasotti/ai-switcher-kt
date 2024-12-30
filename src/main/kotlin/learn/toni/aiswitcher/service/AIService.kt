package learn.toni.aiswitcher.service

import org.springframework.stereotype.Service
import learn.toni.aiswitcher.model.ChatMessage

import org.slf4j.LoggerFactory


@Service
class AIService(private val aiServiceLocator: AIServiceLocator) {

    private val logger = LoggerFactory.getLogger(AIService::class.java)

    fun generateResponse(
        apiName: String,
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double,
    ): String {
        logger.debug("Generating response for API: $apiName")
        val provider = aiServiceLocator.getService(apiName)

        logger.debug("Provider: {}", provider)

        return provider.generateResponse(messages, temperature, maxTokens, topP)
    }
}
