package learn.toni.aiswitcher.exceptions

class AnthropicException(message: String, cause: Throwable? = null) :
    RuntimeException(message, cause)

class DeepSeekException(message: String, cause: Throwable? = null) :
    RuntimeException(message, cause)

class OpenAIException(message: String, cause: Throwable? = null) :
    RuntimeException(message, cause)
