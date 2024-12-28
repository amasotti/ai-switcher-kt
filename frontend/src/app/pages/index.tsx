import React, { useState, useEffect } from 'react';
import { createSession, getSessions, getSession, generateResponse, ChatMessage } from '@/app/api';
import SessionSelector from '../components/SessionSelector';
import ChatBox from '../components/ChatBox';
import AISettings from '../components/AISettings';
import "@/app/styles/globals.css";

const Home: React.FC = () => {
    const [sessions, setSessions] = useState<Array<{ id: string; provider: string }>>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [api, setApi] = useState<string>('DeepSeek');
    const [temperature, setTemperature] = useState<number>(0.7);
    const [maxTokens, setMaxTokens] = useState<number>(150);
    const [topP, setTopP] = useState<number>(1.0);
    const [systemPrompt, setSystemPrompt] = useState<string>('');

    // Load sessions on component mount
    useEffect(() => {
        getSessions().then((resp) => setSessions(resp.data));
    }, []);

    // Load chat history when the session changes
    useEffect(() => {
        if (currentSessionId) {
            getSession(currentSessionId).then((resp) => setMessages(resp.data.messages));
        }
    }, [currentSessionId]);

    const handleCreateSession = () => {
        createSession(api).then((resp) => {
            setCurrentSessionId(resp.data);
            getSessions().then((data) => setSessions(data)); // Refresh session list
        });
    };

    const handleSelectSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
    };


    const handleSystemPromptChange = (prompt: string) => {
        setSystemPrompt(prompt);
    };

    return (
        <div className="app">
            <aside className="sidebar">
                <SessionSelector
                    sessions={sessions}
                    onSelectSession={handleSelectSession}
                    onCreateSession={handleCreateSession}
                />
                <AISettings
                    api={api}
                    temperature={temperature}
                    maxTokens={maxTokens}
                    topP={topP}
                    onApiChange={setApi}
                    onTemperatureChange={setTemperature}
                    onMaxTokensChange={setMaxTokens}
                    onTopPChange={setTopP}
                />
            </aside>

            <main className="main-content">
                <div className="chat-container">
          <textarea
              className="system-prompt"
              value={systemPrompt}
              onChange={(e) => handleSystemPromptChange(e.target.value)}
              placeholder="Enter system prompt here..."
          />
                    <ChatBox
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </main>
        </div>
    );
};

export default Home;
