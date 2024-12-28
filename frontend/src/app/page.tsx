'use client'

import Sidebar, { AISettings } from '@/components/Sidebar'
import ChatHistory from '@/components/ChatHistory'
import ChatInput from '@/components/ChatInput'
import { useState } from 'react'

export default function Home() {
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Array<{role: string, content: string, timestamp: string}>>([])
    const [settings, setSettings] = useState<AISettings>({
        provider: 'DeepSeek',
        temperature: 0.7,
        maxTokens: 150,
        topP: 1.0
    })

    return (
        <main className="flex h-screen bg-gray-50">
            <Sidebar
                currentSessionId={currentSessionId}
                onSessionChange={setCurrentSessionId}
                onSettingsChange={setSettings}
            />
            <div className="flex-1 flex flex-col">
                <ChatHistory messages={messages} />
                <ChatInput
                    sessionId={currentSessionId}
                    settings={settings}
                    onMessageSent={(msg) => setMessages(prev => [...prev, msg])}
                />
            </div>
        </main>
    )
}
