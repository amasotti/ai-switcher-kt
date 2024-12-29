package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.GenerateResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class DeepSeekProvider: AIServiceProvider {
    private val restTemplate = RestTemplate()
    private val objectMapper = jacksonObjectMapper()
    private val logger = LoggerFactory.getLogger(DeepSeekProvider::class.java)

    init {
        logger.info("DeepSeekProvider initialized")
        require (System.getenv("DEEPSEEK_API_KEY") != null) { "DEEPSEEK_API_KEY environment variable not set" }
    }

    private val apiUrl = "https://api.deepseek.com/chat/completions"


    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String {
        val apiKey = System.getenv("DEEPSEEK_API_KEY")

        val payload = mapOf(
            "model" to "deepseek-chat",
            "messages" to messages.map { mapOf("role" to it.role.value, "content" to it.content) },
            "temperature" to temperature,
            "max_tokens" to maxTokens,
            //"top_p" to topP,
            "stream" to false
        )

        logger.debug("Payload to DeepSeek: {}", payload)

        val headers = org.springframework.http.HttpHeaders().apply {
            set("Authorization", "Bearer $apiKey")
            set("Content-Type", "application/json")
        }

        val request = HttpEntity(payload, headers)
        val response = restTemplate.postForObject(apiUrl, request, String::class.java)

        logger.info("Response from DeepSeek: $response")

        val generatedResponse = objectMapper.readValue<GenerateResponse>(
            response.toString(),
            GenerateResponse::class.java
        )

        return generatedResponse.choices.firstOrNull()?.message?.content ?: "No response generated"
    }
}
