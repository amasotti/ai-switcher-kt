'use client'

import { useState } from 'react'
import { generateResponse } from '@/lib/api'
import { AISettings } from '@/components/Sidebar'

interface ChatInputProps {
    sessionId: string | null
    settings: AISettings
    onMessageSent: (message: { role: string, content: string, timestamp: string }) => void
}

export default function ChatInput({ sessionId, settings, onMessageSent }: ChatInputProps) {
    const [systemPrompt, setSystemPrompt] = useState('')
    const [userPrompt, setUserPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!sessionId || !userPrompt.trim() || isLoading) return

        const timestamp = new Date().toLocaleString()

        onMessageSent({
            role: 'user',
            content: userPrompt,
            timestamp
        })

        setIsLoading(true)
        try {
            const response = await generateResponse({
                sessionId,
                apiName: settings.provider,
                systemPrompt,
                userPrompt,
                temperature: settings.temperature,
                maxTokens: settings.maxTokens,
                topP: settings.topP
            })

            onMessageSent({
                role: 'bot',
                content: response,
                timestamp: new Date().toLocaleString()
            })

            setUserPrompt('')
        } catch (error) {
            console.error('Failed to generate response:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
          <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="System Prompt (Context)"
              className="w-full h-24 p-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
                </div>

                <div className="flex gap-4">
          <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Your message..."
              className="flex-1 p-3 rounded-lg border border-gray-300 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

                    <button
                        type="submit"
                        disabled={isLoading || !sessionId || !userPrompt.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    )
}
