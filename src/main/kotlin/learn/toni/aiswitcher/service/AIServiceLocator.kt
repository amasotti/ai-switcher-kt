package learn.toni.aiswitcher.service

import org.springframework.stereotype.Component

@Component
class AIServiceLocator(
    private val deepSeekProvider: DeepSeekProvider,
    private val openAIProvider: OpenAIProvider,
    private val anthropicProvider: AnthropicProvider
) {
    fun getService(apiName: String): AIServiceProvider {
        return when (apiName) {
            "DeepSeek" -> deepSeekProvider
            "OpenAI" -> openAIProvider
            "Anthropic" -> anthropicProvider
            else -> throw IllegalArgumentException("Invalid API selected")
        }
    }
}
