package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.GenerateResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class AnthropicProvider : AIServiceProvider {

    private val logger = LoggerFactory.getLogger(AnthropicProvider::class.java)
    private val restTemplate = RestTemplate()
    private val objectMapper = jacksonObjectMapper()

    init {
        logger.info("Anthropic Provider initialized")
        require(System.getenv("ANTHROPIC_API_KEY") != null) { "ANTHROPIC_API_KEY environment variable not set" }
    }

    private val apiUrl = "https://api.openai.com/v1/chat/completions"

    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String {

        val apiKey = System.getenv("ANTHROPIC_API_KEY")
        val payload = mapOf(
            "model" to "gpt-4",
            "messages" to messages.map { mapOf("role" to it.role.value, "content" to it.content) },
            "temperature" to temperature,
            "max_tokens" to maxTokens,
            "top_p" to topP
        )

        val headers = org.springframework.http.HttpHeaders().apply {
            set("Authorization", "Bearer $apiKey")
            set("Content-Type", "application/json")
        }

        val request = HttpEntity(payload, headers)
        val response = restTemplate.postForObject(apiUrl, request, String::class.java)

        logger.info("Response from ChatGPT: $response")

        val generatedResponse = objectMapper.readValue<GenerateResponse>(
            response.toString(),
            GenerateResponse::class.java
        )

        return generatedResponse.choices.firstOrNull()?.message?.content ?: "No response generated"
    }
}
