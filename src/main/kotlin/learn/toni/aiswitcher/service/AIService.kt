package learn.toni.aiswitcher.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.GenerateResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity

@Service
class AIService {

    private val logger = LoggerFactory.getLogger(AIService::class.java)

    private val restTemplate = RestTemplate()
    private val objectMapper = jacksonObjectMapper()

    @Suppress("UnusedParameter")
    fun generateResponse(
        apiName: String,
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double): String
    {
        val apiConfig = when (apiName) {
            "DeepSeek" -> ApiConfig("https://api.deepseek.com/chat/completions", System.getenv("DEEPSEEK_API_KEY"))
            "ChatGPT" -> ApiConfig("https://api.openai.com/v1/chat/completions", System.getenv("CHATGPT_API_KEY"))
            "Claude" -> ApiConfig("https://api.anthropic.com/v1/messages", System.getenv("CLAUDE_API_KEY"))
            else -> throw IllegalArgumentException("Invalid API selected")
        }

        val payload = mapOf(
            "model" to "deepseek-chat",
            "messages" to messages.map { mapOf("role" to it.role.value, "content" to it.content) },
            "stream" to false
        )

        val headers = org.springframework.http.HttpHeaders().apply {
            set("Authorization", "Bearer ${apiConfig.key}")
            set("Content-Type", "application/json")
        }

        val request = HttpEntity(payload, headers)
        val response = restTemplate.postForObject(apiConfig.url, request, String::class.java)

        logger.info("Response from $apiName: $response")

        val generatedResponse = objectMapper.readValue<GenerateResponse>(
            response.toString(),
            GenerateResponse::class.java
        )

        return generatedResponse.choices.firstOrNull()?.message?.content ?: "No response generated"
    }

    data class ApiConfig(val url: String, val key: String)
}
