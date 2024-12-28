"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from 'react';
import { createSession, getSessions, getSession, generateResponse } from '@/app/api';
import SessionSelector from '../components/SessionSelector';
import ChatBox from '../components/ChatBox';
import AISettings from '../components/AISettings';
import { ChatMessage } from '../types/session';

const Home: React.FC = () => {
    const [sessions, setSessions] = useState<Array<{ id: string; provider: string }>>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [api, setApi] = useState<string>('DeepSeek');
    const [temperature, setTemperature] = useState<number>(0.7);
    const [maxTokens, setMaxTokens] = useState<number>(150);
    const [topP, setTopP] = useState<number>(1.0);
    const [systemPrompt, setSystemPrompt] = useState<string>('You are a helpful assistant.');
    const [userPrompt, setUserPrompt] = useState<string>('');

    useEffect(() => {
        getSessions().then((data) => setSessions(data));
    }, []);

    useEffect(() => {
        if (currentSessionId) {
            getSession(currentSessionId).then((session) => setMessages(session.messages));
        }
    }, [currentSessionId]);

    const handleCreateSession = () => {
        createSession(api).then((sessionId) => {
            setCurrentSessionId(sessionId);
            getSessions().then((data) => setSessions(data));
        });
    };

    const handleGenerateResponse = () => {
        if (!userPrompt) return;

        generateResponse({
            sessionId: currentSessionId!,
            apiName: api,
            systemPrompt,
            userPrompt,
            temperature,
            maxTokens,
            topP,
        }).then((response) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'system', content: response, timestamp: new Date().toLocaleString() },
            ]);
            setUserPrompt(''); // Clear the user prompt input
        });
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="app">
            <h1>Generative AI Switcher</h1>
            <SessionSelector
                sessions={sessions}
                onSelectSession={setCurrentSessionId}
                onCreateSession={handleCreateSession}
            />
            <AISettings
                api={api}
                temperature={temperature}
                maxTokens={maxTokens}
                topP={topP}
                onApiChange={setApi}
                onTemperatureChange={(value) => setTemperature(parseFloat(value))}
                onMaxTokensChange={(value) => setMaxTokens(parseInt(value))}
                onTopPChange={(value) => setTopP(parseFloat(value))}
            />
            <div className="prompt-inputs">
                <label>
                    System Prompt:
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Enter system prompt"
                    />
                </label>
                <label>
                    User Prompt:
                    <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Enter your prompt"
                    />
                </label>
            </div>
            <div className="buttons">
                <button onClick={handleGenerateResponse}>Submit</button>
                <button onClick={handleClearChat}>Clear Chat</button>
            </div>
            <ChatBox messages={messages} />
        </div>
    );
};

export default Home;
