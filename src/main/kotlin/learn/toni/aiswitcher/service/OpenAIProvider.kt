package learn.toni.aiswitcher.service

import learn.toni.aiswitcher.exceptions.OpenAIException
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.OpenAIMessage
import learn.toni.aiswitcher.model.api.OpenAIRequest
import learn.toni.aiswitcher.model.api.OpenAIResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class OpenAIProvider(
    @Value("\${apikeys.openai}") private val apiKey: String,
    @Value("\${apikeys.openai.org}") private val orgId: String
) : AIServiceProvider {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val restTemplate: RestTemplate = RestTemplate()

    companion object {
        private const val API_URL = "https://api.openai.com/v1/chat/completions"
        private const val MODEL = "gpt-4o-mini"
    }

    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String = try {
        val request = createRequest(messages, temperature, maxTokens, topP)
        val response = restTemplate.postForObject(API_URL, request, OpenAIResponse::class.java)
            .also { logger.debug("Received response from OpenAI: {}", it) }
            ?: throw OpenAIException("Null response received from OpenAI")

        response.choices
            .firstOrNull()
            ?.message
            ?.content
            ?.trim() // Add trim() to remove leading/trailing newlines
            ?: throw OpenAIException("No content in OpenAI response")
    } catch (e: Exception) {
        logger.error("Failed to generate response from OpenAI", e)
        throw OpenAIException("Failed to generate response", e)
    }

    private fun createRequest(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): HttpEntity<OpenAIRequest> {
        val payload = OpenAIRequest(
            model = MODEL,
            messages = messages.map { OpenAIMessage(it.role.value, it.content) },
            temperature = temperature,
            maxTokens = maxTokens,
            topP = topP
        )

        val headers = HttpHeaders().apply {
            setBearerAuth(apiKey)
            set("OpenAI-Organization", orgId)
            contentType = MediaType.APPLICATION_JSON
        }

        return HttpEntity(payload, headers)
            .also { logger.debug("Created request with payload: {}", payload) }
    }
}




