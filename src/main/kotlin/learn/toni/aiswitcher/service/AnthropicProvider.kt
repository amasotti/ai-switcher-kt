package learn.toni.aiswitcher.service

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.MessageCreateParams
import com.anthropic.models.MessageParam
import com.anthropic.models.Model
import com.anthropic.models.TextBlock
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.toAnthropicRole
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class AnthropicProvider : AIServiceProvider {

    private val logger = LoggerFactory.getLogger(AnthropicProvider::class.java)
    @Value("\${apikeys.anthropic}") lateinit var apiKey: String

    init {
        logger.info("Anthropic Provider initialized")
    }


    override fun generateResponse(
        messages: List<ChatMessage>,
        temperature: Double,
        maxTokens: Int,
        topP: Double
    ): String {

        @Suppress("MagicNumber")
        val client : AnthropicClient = AnthropicOkHttpClient
            .builder()
            .fromEnv()
            .maxRetries(3)
            .timeout(java.time.Duration.ofSeconds(30000))
            .build()
        logger.debug("Client initialized, {}", client)

        val params : MessageCreateParams = MessageCreateParams
            .builder()
            .model(Model.CLAUDE_3_5_SONNET_LATEST)
            .maxTokens(maxTokens.toLong())
            .temperature(temperature)
            .messages(messages.map {
                MessageParam.builder()
                    .role(it.role.toAnthropicRole())
                    .content(MessageParam.Content.ofString(it.content))
                    .build()
            })
            .build()

        logger.debug("Params: {}", params)

        val response = client.messages().create(params).validate()

        logger.info("Response from Anthropic: $response")

        logger.info("Usage Stats from Anthropic: ${response.usage().toString()}")

        val optionalTextBlock: Optional<TextBlock>? = response.content().firstOrNull()?.textBlock()

        // Now extract the text from the TextBlock and return it as string using the let() scope function
        return optionalTextBlock?.orElseThrow { IllegalStateException("No text block found in response") }?.text() ?: ""

    }
}
