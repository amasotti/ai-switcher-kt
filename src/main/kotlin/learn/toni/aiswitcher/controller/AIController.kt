package learn.toni.aiswitcher.controller

import learn.toni.aiswitcher.model.ChatMessage
import learn.toni.aiswitcher.model.Role
import learn.toni.aiswitcher.model.Session
import learn.toni.aiswitcher.model.api.GenerateRequest
import learn.toni.aiswitcher.service.AIService
import learn.toni.aiswitcher.service.SessionService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AIController(
    private val aiService: AIService,
    private val sessionService: SessionService
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @PostMapping("/generate")
    fun generate(@RequestBody request: GenerateRequest): ResponseEntity<String> =
        try {
            logger.debug("Processing generation request for session: ${request.sessionId}")

            val messages = buildMessageList(request)
            val response = generateAIResponse(request, messages)
            updateSessionWithResponse(request.sessionId, messages, response)

            ResponseEntity.ok(response)
        } catch (e: Exception) {
            logger.error("Failed to generate response", e)
            ResponseEntity.internalServerError().body("Failed to generate response: ${e.message}")
        }

    @PostMapping("/create-session")
    fun createSession(@RequestParam provider: String): ResponseEntity<String> =
        runCatching {
            ResponseEntity.ok(sessionService.createSession(provider))
        }.getOrElse {
            logger.error("Failed to create session for provider: $provider", it)
            ResponseEntity.internalServerError().body("Failed to create session")
        }

    @GetMapping("/get-sessions")
    fun getSessions(): ResponseEntity<List<Session>> =
        runCatching {
            ResponseEntity.ok(sessionService.getSessions())
        }.getOrElse {
            logger.error("Failed to retrieve sessions", it)
            ResponseEntity.internalServerError().body(emptyList())
        }

    @GetMapping("/get-session/{sessionId}")
    fun getSession(@PathVariable sessionId: String): ResponseEntity<Session> =
        runCatching {
            ResponseEntity.ok(sessionService.getSession(sessionId))
        }.getOrElse {
            logger.error("Failed to retrieve session: $sessionId", it)
            ResponseEntity.notFound().build()
        }

    @DeleteMapping("/delete-session/{sessionId}")
    fun deleteSession(@PathVariable sessionId: String): ResponseEntity<Unit> =
        runCatching<ResponseEntity<Unit>> {
            sessionService.deleteSession(sessionId)
            ResponseEntity.ok().build()
        }.getOrElse {
            logger.error("Failed to delete session: $sessionId", it)
            ResponseEntity.internalServerError().build()
        }

    private fun buildMessageList(request: GenerateRequest): MutableList<ChatMessage> {

        val previousMessages = sessionService.getSession(request.sessionId).messages
        val messages = mutableListOf<ChatMessage>()

        messages.addAll(previousMessages)
        messages.add(ChatMessage(Role.USER, request.userPrompt))
        messages.add(ChatMessage(Role.SYSTEM, request.systemPrompt))

        return messages
    }

    private fun generateAIResponse(
        request: GenerateRequest,
        messages: List<ChatMessage>
    ): String = aiService.generateResponse(
        request.apiName,
        messages,
        request.temperature,
        request.maxTokens,
        request.topP
    )

    private fun updateSessionWithResponse(
        sessionId: String,
        messages: MutableList<ChatMessage>,
        response: String
    ) {
        messages.add(ChatMessage(Role.SYSTEM, response))
        sessionService.updateSession(sessionId, messages)
        logger.debug("Session $sessionId updated with response")
    }
}
