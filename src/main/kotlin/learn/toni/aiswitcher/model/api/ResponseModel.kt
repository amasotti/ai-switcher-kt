package learn.toni.aiswitcher.model.api

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import learn.toni.aiswitcher.model.ChatMessage

@JsonIgnoreProperties(ignoreUnknown = true)
data class GenerateResponse(
    val id: String,
    val `object`: String,
    val created: Long,
    val model: String,
    val choices: List<Response>,
    val usage: DeepSeekUsage,
    @JsonProperty("system_fingerprint") val systemFingerprint: String
)

data class DeepSeekUsage (
    @JsonProperty("prompt_tokens") val promptTokens: Int,
    @JsonProperty("completion_tokens") val completionTokens: Int,
    @JsonProperty("total_tokens") val totalTokens: Int,
    @JsonProperty("prompt_cache_hit_tokens") val promptCacheHitTokens: Float,
    @JsonProperty("prompt_cache_miss_tokens") val promptCacheMissTokens: Float
)

data class Response(
    val index: Int,
    val message: ChatMessage,
    val logprobs: Any?,
    @JsonProperty("finish_reason") val finishReason: String
)
