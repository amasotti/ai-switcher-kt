package learn.toni.aiswitcher.service

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient
import com.anthropic.models.MessageCreateParams
import com.anthropic.models.MessageParam
import com.anthropic.models.Model
import learn.toni.aiswitcher.exceptions.AnthropicException
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.Role
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import kotlin.time.Duration.Companion.seconds
import kotlin.time.toJavaDuration

const val MAX_RETRY = 3

@Service
class AnthropicProvider : AIServiceProvider {
    private val logger = LoggerFactory.getLogger(javaClass)
    private val client: AnthropicClient = createClient()

    init {
        logger.info("Anthropic Provider initialized")
    }

    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String = try {
        // Extract system message and user/assistant messages
        val (systemMessage, conversationMessages) = messages.partition { it.role == Role.SYSTEM }

        val params = createMessageParams(
            systemPrompt = systemMessage.firstOrNull()?.content,
            messages = conversationMessages,
            temperature = temperature,
            maxTokens = maxTokens
        )

        val response = client
            .messages()
            .create(params)
            .validate()
            .also { logger.info("Request to Anthropic: {}", it) }

        response.content()
            .firstOrNull()
            ?.textBlock()
            ?.orElseThrow { IllegalStateException("No text block found in response") }
            ?.text()
            ?: "No response from Anthropic"

    } catch (e: com.anthropic.errors.AnthropicException) {
        logger.error("Error generating response from Anthropic", e)
        throw AnthropicException("Failed to generate response", e)
    }

    private fun createMessageParams(
        systemPrompt: String?,
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int
    ) = MessageCreateParams.builder()
        .model(Model.CLAUDE_3_5_SONNET_LATEST)
        .maxTokens(maxTokens.toLong())
        .temperature(temperature)
        .apply {
            systemPrompt?.let { system(it) }
        }
        .messages(messages.map { it.toMessageParam() })
        .build()
        .also { logger.debug("Created params: {}", it) }

    private fun ChatMessage.toMessageParam() = MessageParam.builder()
        .role(role.toAnthropicRole())
        .content(MessageParam.Content.ofString(content))
        .build()

    private fun Role.toAnthropicRole() = when (this) {
        Role.USER -> MessageParam.Role.USER
        Role.SYSTEM -> error("System role is handled separately by Anthropic")
        Role.ASSISTANT -> MessageParam.Role.ASSISTANT
    }

    /**
     * Create a new Anthropic client with sensible defaults
     *
     * The client is configured with the API key from the environment (ANTHROPIC_API_KEY)
     * and a maximum of 3 retries on failed requests
     *
     * @return a new Anthropic client
     */
    private fun createClient(): AnthropicClient = AnthropicOkHttpClient.builder()
        .fromEnv()
        .maxRetries(MAX_RETRY)
        .timeout(300.seconds.toJavaDuration())
        .build()
        .also { logger.debug("Client initialized: {}", it) }

}

