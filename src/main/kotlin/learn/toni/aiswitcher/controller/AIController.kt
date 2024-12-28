package learn.toni.aiswitcher.controller

import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.Role
import learn.toni.aiswitcher.model.Session
import learn.toni.aiswitcher.model.api.GenerateRequest
import learn.toni.aiswitcher.service.AIService
import learn.toni.aiswitcher.service.SessionService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AIController(
    private val aiService: AIService,
    private val sessionService: SessionService
) {

    private val logger = LoggerFactory.getLogger(AIController::class.java)

    @Suppress("LongParameterList")
    @PostMapping("/generate")
    fun generate(@RequestBody request: GenerateRequest): String {
        logger.debug("Generating response for session: ${request.sessionId} with API: ${request.apiName}")
        val session = sessionService.getSession(request.sessionId)
        val messages = session.messages.toMutableList()

        logger.info("Request received for session: ${request.sessionId}")
        logger.info("System prompt: ${request.systemPrompt}")
        messages.add(ChatMessage(Role.SYSTEM, request.systemPrompt))

        logger.info("User prompt: ${request.userPrompt}")
        messages.add(ChatMessage(Role.USER, request.userPrompt))

        val response = aiService.generateResponse(
            request.apiName,
            messages,
            request.temperature,
            request.maxTokens,
            request.topP
        )
        logger.info("Response generated successfully for session: $response")
        messages.add(ChatMessage(Role.SYSTEM, response))

        sessionService.updateSession(request.sessionId, messages)
        logger.info("Response generated successfully for session: ${request.sessionId}")
        return response
    }

    @PostMapping("/create-session")
    fun createSession(): String {
        return sessionService.createSession()
    }

    @GetMapping("/get-sessions")
    fun getSessions(): List<Session> {
        return sessionService.getSessions()
    }

    @GetMapping("/get-session/{sessionId}")
    fun getSession(@PathVariable sessionId: String): Session {
        return sessionService.getSession(sessionId)
    }

    @PostMapping("/delete-session/{sessionId}")
    fun deleteSession(@PathVariable sessionId: String) {
        sessionService.deleteSession(sessionId)
    }
}
