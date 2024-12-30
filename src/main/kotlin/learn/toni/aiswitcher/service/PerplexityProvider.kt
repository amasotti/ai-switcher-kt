package learn.toni.aiswitcher.service

import learn.toni.aiswitcher.exceptions.OpenAIException
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.api.PerplexityRequest
import learn.toni.aiswitcher.model.api.PerplexityResponse
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class PerplexityProvider(
    @Value("\${apikeys.perplexity}") private val apiKey: String
) : AIServiceProvider {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val restTemplate: RestTemplate = RestTemplate()

    companion object {
        private const val API_URL = "https://api.perplexity.ai/chat/completions"
        private const val MODEL = "llama-3.1-sonar-large-128k-online"
    }

    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String = try {
        val request = createRequest(messages, temperature, maxTokens, topP)
        val response = restTemplate.postForObject(API_URL, request, PerplexityResponse::class.java)
            .also { logger.debug("Received response from OpenAI: {}", it) }
            ?: throw OpenAIException("Null response received from OpenAI")

        parseResponse(response)
    } catch (e: Exception) {
        logger.error("Failed to generate response from OpenAI", e)
        throw OpenAIException("Failed to generate response", e)
    }

    private fun createRequest(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): HttpEntity<PerplexityRequest> {
        val payload = PerplexityRequest(
            model = MODEL,
            messages = messages.map { ChatMessage(it.role, it.content) },
            temperature = temperature,
            maxTokens = maxTokens,
            topP = topP,
            searchDomainFilter = listOf("perplexity.ai"),
            searchRecencyFilter = "month",
            topK = 0,
            stream = false,
            presencePenalty = 0,
            frequencyPenalty = 1
        )

        val headers = HttpHeaders().apply {
            setBearerAuth(apiKey)
            contentType = MediaType.APPLICATION_JSON
        }

        return HttpEntity(payload, headers)
            .also { logger.debug("Created request with payload: {}", payload) }
    }


    private fun parseResponse(response: PerplexityResponse) : String {
        val choices = response.choices
            .firstOrNull()
            ?.message
            ?.content
            ?.trim() // Add trim() to remove leading/trailing newlines
            ?: "No content in OpenAI response"

        val citations = response.citations
            .joinToString("\n")

        return """
            |Choices: $choices
            |Citations: $citations
        """.trimMargin()
    }
}




