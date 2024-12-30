package learn.toni.aiswitcher.model.api

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import learn.toni.aiswitcher.model.ChatMessage

@JsonSerialize
data class GenerateRequest(
    val sessionId: String,
    val apiName: String,
    val systemPrompt: String,
    val userPrompt: String,
    val temperature: Double,
    val maxTokens: Int,
    val topP: Double
)

@JsonSerialize
data class OpenAIRequest(
    val model: String,
    val messages: List<ChatMessage>,
    val temperature: Double,
    @JsonProperty("max_tokens") val maxTokens: Int,
    @JsonProperty("top_p") val topP: Double
)


// ------------------------------------------------------------
// PERPLEXITY REQUEST MODEL
// ------------------------------------------------------------

@JsonSerialize
data class PerplexityRequest(
    val model: String,
    val messages: List<ChatMessage>,
    val temperature: Double,
    @JsonProperty("max_tokens") val maxTokens: Int,
    @JsonProperty("top_p") val topP: Double,
    @JsonProperty("search_domain_filter") val searchDomainFilter: List<String>,
    @JsonProperty("return_images") val returnImages: Boolean = false,
    @JsonProperty("return_related_questions") val returnRelatedQuestions: Boolean = false,
    @JsonProperty("search_recency_filter") val searchRecencyFilter: String,
    @JsonProperty("top_k") val topK: Int,
    val stream: Boolean = false,
    @JsonProperty("presence_penalty") val presencePenalty: Int = 0,
    @JsonProperty("frequency_penalty") val frequencyPenalty: Int = 1
)
