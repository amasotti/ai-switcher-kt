package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.DeepSeekResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class DeepSeekProvider: AIServiceProvider {
    private val restTemplate = RestTemplate()
    private val objectMapper = jacksonObjectMapper()
    private val logger = LoggerFactory.getLogger(DeepSeekProvider::class.java)
    @Value("\${apikeys.deepseek}") lateinit var apiKey: String
    private val apiUrl = "https://api.deepseek.com/chat/completions"

    init {
        logger.info("DeepSeekProvider initialized")
    }


    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String {

        val payload = mapOf(
            "model" to "deepseek-chat",
            "messages" to messages.map { mapOf("role" to it.role.value, "content" to it.content) },
            "temperature" to temperature,
            "max_tokens" to maxTokens,
            //"top_p" to topP,
            "stream" to false
        )

        logger.info("Payload to DeepSeek: {}", payload)

        val headers = org.springframework.http.HttpHeaders().apply {
            set("Authorization", "Bearer $apiKey")
            set("Content-Type", "application/json")
        }

        logger.info("Headers to DeepSeek: {}", headers)

        val request = HttpEntity(payload, headers)
        val response = restTemplate.postForObject(apiUrl, request, String::class.java)

        logger.info("Response from DeepSeek: $response")

        val generatedResponse = objectMapper.readValue<DeepSeekResponse>(
            response.toString(),
            DeepSeekResponse::class.java
        )

        return generatedResponse.choices.firstOrNull()?.message?.content ?: "No response generated"
    }
}
