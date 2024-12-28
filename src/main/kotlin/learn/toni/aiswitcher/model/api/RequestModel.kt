package learn.toni.aiswitcher.model.api

import com.fasterxml.jackson.databind.annotation.JsonSerialize

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
