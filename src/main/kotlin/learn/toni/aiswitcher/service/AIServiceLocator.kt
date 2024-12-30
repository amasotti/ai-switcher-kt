package learn.toni.aiswitcher.service

import org.springframework.stereotype.Component

@Component
class AIServiceLocator(
    private val deepSeekProvider: DeepSeekProvider,
    private val openAIProvider: OpenAIProvider,
    private val anthropicProvider: AnthropicProvider,
    private val perplexityProvider: PerplexityProvider
) {
    fun getService(apiName: String): AIServiceProvider {
        return when (apiName) {
            "DeepSeek" -> deepSeekProvider
            "OpenAI" -> openAIProvider
            "Anthropic" -> anthropicProvider
            "Perplexity" -> perplexityProvider
            else -> throw IllegalArgumentException("Invalid API selected")
        }
    }
}
