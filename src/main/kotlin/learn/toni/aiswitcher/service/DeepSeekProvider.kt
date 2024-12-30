package learn.toni.aiswitcher.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.exceptions.DeepSeekException
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.DeepSeekResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpEntity
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class DeepSeekProvider(
    @Value("\${apikeys.deepseek}") private val apiKey: String,
) : AIServiceProvider {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val objectMapper = jacksonObjectMapper()
    private val restTemplate: RestTemplate = RestTemplate()

    companion object {
        private const val API_URL = "https://api.deepseek.com/chat/completions"
        private const val MODEL = "deepseek-chat"
    }

    init {
        logger.info("DeepSeekProvider initialized")
    }

    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String = try {
        val request = createRequest(messages, temperature, maxTokens)
        val response = restTemplate.postForObject(API_URL, request, String::class.java)
            ?: throw DeepSeekException("Null response received from DeepSeek")

        logger.debug("Response from DeepSeek: $response")

        parseResponse(response)
    } catch (e: Exception) {
        logger.error("Error generating response from DeepSeek", e)
        throw DeepSeekException("Failed to generate response", e)
    }

    private fun createRequest(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int
    ): HttpEntity<Map<String, Any>> {
        val payload = mapOf(
            "model" to MODEL,
            "messages" to messages.map { it.toDeepSeekMessage() },
            "temperature" to temperature,
            "max_tokens" to maxTokens,
            "stream" to false
        )

        val headers = HttpHeaders().apply {
            setBearerAuth(apiKey)
            contentType = MediaType.APPLICATION_JSON
        }

        return HttpEntity(payload, headers)
            .also { logger.debug("Created request with payload: $payload") }
    }

    private fun parseResponse(response: String): String =
        objectMapper.readValue(response, DeepSeekResponse::class.java)
            .choices
            .firstOrNull()
            ?.message
            ?.content
            ?: "No response from DeepSeek"

    private fun ChatMessage.toDeepSeekMessage() = mapOf(
        "role" to role.value,
        "content" to content
    )
}

