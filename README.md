# Generative AI Switcher (Kotlin)

A Kotlin-based web application built with **Spring Boot** that allows you to switch between multiple Generative AI APIs
(e.g., DeepSeek, ChatGPT, Claude) and customize AI settings. 

The app features a clean and structured frontend with a side menu for AI parameters and a main content area for chat 
interactions.

(And of course this project is built with the help of several AIs 🤖)

---

## Features

- **Multi-Chat Sessions**: Create, switch, and delete chat sessions.
- **Customizable AI Settings**: Adjust parameters like `temperature`, `max_tokens`, and `top_p`.
- **Multiple APIs**: Choose between different Generative AI APIs (DeepSeek, ChatGPT, Claude).
- **Responsive Design**: Side menu and main content area adapt to different screen sizes.
- **Chat History**: Stores chat sessions locally for retrieval and visualization.
- **Clean JSON Serialization**: Uses Kotlin data classes and Jackson for seamless API communication.

---

## Technologies Used

- **Backend**: Spring Boot (Kotlin, v.2.0.10, java 21)
- **Frontend**: HTML, CSS (Bootstrap), JavaScript (to be perhaps replaced by React later on, but I am not a frontend dev)
- **API Integration**: DeepSeek, ChatGPT, Claude
- **Build Tool**: Gradle (v. 8.12)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/generative-ai-switcher-kotlin.git
   cd generative-ai-switcher-kotlin
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add your API keys:
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key
   CHATGPT_API_KEY=your_chatgpt_api_key
   CLAUDE_API_KEY=your_claude_api_key
   ```

3. Run the application:
   ```bash
   ./gradlew bootRun
   ```

4. Open your browser and navigate to `http://localhost:8080`.

---

## API Endpoints

| Endpoint                          | Method | Description                                   |
|-----------------------------------|--------|-----------------------------------------------|
| `/api/create-session`             | POST   | Creates a new chat session.                   |
| `/api/get-session/{sessionId}`    | GET    | Retrieves a chat session by ID.               |
| `/api/delete-session/{sessionId}` | POST   | Deletes a chat session by ID.                 |
| `/api/generate`                   | POST   | Sends a prompt to the AI and gets a response. |

---

## Example Payloads

### **Generate Request**
```json
{
    "sessionId": "2024-12-28T18:43:33.174034",
    "apiName": "DeepSeek",
    "systemPrompt": "You are a helpful assistant.",
    "userPrompt": "Hello!",
    "temperature": 0.7,
    "maxTokens": 150,
    "topP": 1.0
}
```

### **Generate Response**
```json
{
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "Hello! How can I assist you today?"
            },
            "logprobs": null,
            "finish_reason": "stop"
        }
    ]
}
```

---

## Frontend Screenshots

![Screenshot 1](./screenshot.png) 
*Side menu with AI settings and main chat area.*


---

## Acknowledgments

- **Spring Boot**: For the robust and scalable backend framework.
- **Kotlin**: For the concise and expressive programming language.
- **Bootstrap**: For the responsive and clean UI components.
- **DeepSeek, OpenAI, Anthropic**: For their Generative AI APIs.

---

Enjoy experimenting with different Generative AI models! 🚀
