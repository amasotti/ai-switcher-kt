package learn.toni.aiswitcher.model.api

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import learn.toni.aiswitcher.model.OpenAIMessage

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
    val messages: List<OpenAIMessage>,
    val temperature: Double,
    @JsonProperty("max_tokens") val maxTokens: Int,
    @JsonProperty("top_p") val topP: Double
)
