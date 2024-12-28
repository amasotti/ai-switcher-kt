let currentSessionId = null;

// Load sessions
function loadSessions() {
    fetch("/api/get-sessions")
        .then(response => response.json())
        .then(data => {
            const sessionSelector = document.getElementById("session-selector");
            sessionSelector.innerHTML = "";
            data.forEach(session => {
                const option = document.createElement("option");
                option.value = session.id;
                option.textContent = `${session.id} (${session.provider})`; // Display session ID and provider
                sessionSelector.appendChild(option);
            });
        });
}

// Create a new session
document.getElementById("new-session-btn").addEventListener("click", () => {
    const provider = document.getElementById("api-selector").value; // Get the selected provider
    fetch(`/api/create-session?provider=${provider}`, { method: "POST" })
        .then(response => response.text())
        .then(sessionId => {
            currentSessionId = sessionId;
            loadSessions();
        });
});
// Switch session
document.getElementById("session-selector").addEventListener("change", (event) => {
    currentSessionId = event.target.value;
    loadChatHistory();
});

// Load chat history for the current session
function loadChatHistory() {
    if (!currentSessionId) return;
    fetch(`/api/get-session/${currentSessionId}`)
        .then(response => response.json())
        .then(session => {
            const chatBox = document.getElementById("chat-box");
            chatBox.innerHTML = "";
            session.messages.forEach(msg => {
                appendMessage(msg.role, msg.content, msg.timestamp);
            });
        });
}

// Append a message to the chat box
function appendMessage(role, content, timestamp) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;
    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    contentDiv.textContent = content;
    const timestampDiv = document.createElement("div");
    timestampDiv.className = "timestamp";
    timestampDiv.textContent = timestamp;
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampDiv);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Generate response
document.getElementById("generate-btn").addEventListener("click", async () => {
    if (!currentSessionId) return;

    const api = document.getElementById("api-selector").value;
    const systemPrompt = document.getElementById("system-prompt").value;
    const userPrompt = document.getElementById("user-prompt").value;
    const temperature = parseFloat(document.getElementById("temperature").value);
    const maxTokens = parseInt(document.getElementById("max-tokens").value);
    const topP = parseFloat(document.getElementById("top-p").value);

    if (!userPrompt) return;

    appendMessage("user", userPrompt, new Date().toLocaleString());
    document.getElementById("user-prompt").value = "";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sessionId: currentSessionId,
                apiName: api,
                systemPrompt: systemPrompt,
                userPrompt: userPrompt,
                temperature: temperature,
                maxTokens: maxTokens,
                topP: topP
            })
        });
        const data = await response.text();
        appendMessage("bot", data, new Date().toLocaleString());
    } catch (error) {
        appendMessage("bot", "Error: " + error.message, new Date().toLocaleString());
    }
});

// Clear chat
document.getElementById("clear-btn").addEventListener("click", () => {
    if (!currentSessionId) return;
    fetch(`/api/delete-session/${currentSessionId}`, { method: "POST" })
        .then(() => {
            document.getElementById("chat-box").innerHTML = "";
        });
});

// Load sessions on page load
loadSessions();
