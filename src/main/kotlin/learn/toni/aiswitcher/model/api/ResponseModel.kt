package learn.toni.aiswitcher.model.api

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import learn.toni.aiswitcher.model.ChatMessage

// ------------------------------------------------------------
// DeepSeek API
// ------------------------------------------------------------

@JsonIgnoreProperties(ignoreUnknown = true)
data class DeepSeekResponse(
    val id: String,
    val `object`: String,
    val created: Long,
    val model: String,
    val choices: List<DeepSeekChoices>,
    val usage: DeepSeekUsage,
    @JsonProperty("system_fingerprint") val systemFingerprint: String
)

data class DeepSeekChoices(
    val index: Int,
    val message: ChatMessage,
    val logprobs: Any?,
    @JsonProperty("finish_reason") val finishReason: String
)


data class DeepSeekUsage (
    @JsonProperty("prompt_tokens") val promptTokens: Int,
    @JsonProperty("completion_tokens") val completionTokens: Int,
    @JsonProperty("total_tokens") val totalTokens: Int,
    @JsonProperty("prompt_cache_hit_tokens") val promptCacheHitTokens: Float,
    @JsonProperty("prompt_cache_miss_tokens") val promptCacheMissTokens: Float
)

// ------------------------------------------------------------
// OpenAI API
// ------------------------------------------------------------

data class OpenAIResponse(
    val id: String,
    val `object`: String,
    val created: Long,
    val model: String,
    val usage: OpenAIUsage,
    val choices: List<OpenAIChoices>
)

data class OpenAIUsage(
    @JsonProperty("prompt_tokens") val promptTokens: Int,
    @JsonProperty("completion_tokens") val completionTokens: Int,
    @JsonProperty("total_tokens") val totalTokens: Int,
    @JsonProperty("completion_tokens_details") val completionTokensDetails: CompletionTokensDetails
)

data class CompletionTokensDetails(
    @JsonProperty("reasoning_tokens") val reasoningTokens: Int,
    @JsonProperty("accepted_prediction_tokens") val acceptedPredictionTokens: Int,
    @JsonProperty("rejected_prediction_tokens") val rejectedPredictionTokens: Int
)

data class OpenAIChoices(
    val message: ChatMessage,
    val logprobs: Any?,
    @JsonProperty("finish_reason") val finishReason: String,
    val index: Int
)

// ------------------------------------------------------------
// Perplexity API Response

data class PerplexityResponse(
    val id: String,
    val `object`: String,
    val created: Long,
    val model: String,
    val citations: List<String>,
    val choices: List<PerplexityChoices>,
    val usage: PerplexityUsage
)

data class PerplexityChoices(
    val index: Int,
    val message: ChatMessage,
    val delta: ChatMessage,
    @JsonProperty("finish_reason") val finishReason: String
)

data class PerplexityUsage(
    @JsonProperty("prompt_tokens") val promptTokens: Int,
    @JsonProperty("completion_tokens") val completionTokens: Int,
    @JsonProperty("total_tokens") val totalTokens: Int
)
