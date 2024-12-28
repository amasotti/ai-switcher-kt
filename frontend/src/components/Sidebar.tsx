'use client'

import { useEffect, useState } from 'react'
import { createSession, getSessions } from '@/lib/api'

interface SidebarProps {
    currentSessionId: string | null
    onSessionChange: (sessionId: string) => void
    onSettingsChange: (settings: AISettings) => void
}

export interface AISettings {
    provider: string
    temperature: number
    maxTokens: number
    topP: number
}

export default function Sidebar({ currentSessionId, onSessionChange, onSettingsChange }: SidebarProps) {
    const [sessions, setSessions] = useState<Array<{ id: string, provider: string }>>([])
    const [settings, setSettings] = useState<AISettings>({
        provider: 'DeepSeek',
        temperature: 0.0,
        maxTokens: 150,
        topP: 1.0
    })

    // Update parent component when settings change
    useEffect(() => {
        onSettingsChange(settings)
    }, [settings, onSettingsChange])

    useEffect(() => {
        loadSessions()
    }, [])

    async function loadSessions() {
        try {
            const data = await getSessions()
            setSessions(data)
        } catch (error) {
            console.error('Failed to load sessions:', error)
        }
    }

    async function handleNewSession() {
        try {
            const sessionId = await createSession(settings.provider)
            await loadSessions()
            onSessionChange(sessionId)
        } catch (error) {
            console.error('Failed to create session:', error)
        }
    }

    return (
        <aside className="w-80 bg-gray-800 text-white flex flex-col h-screen">
            {/* Settings Section */}
            <div className="sidebar-section">
                <h3 className="text-xl font-bold mb-6">AI Settings</h3>

                <div>
                    <label className="ai-label">Provider</label>
                    <select
                        value={settings.provider}
                        onChange={(e) => setSettings(s => ({ ...s, provider: e.target.value }))}
                        className="ai-input"
                    >
                        <option value="DeepSeek">DeepSeek</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Claude">Claude</option>
                    </select>
                </div>

                <div>
                    <label className="ai-label">
                        Temperature ({settings.temperature})
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                        className="ai-slider"
                    />
                </div>

                <div>
                    <label className="ai-label">Max Tokens</label>
                    <input
                        type="number"
                        value={settings.maxTokens}
                        onChange={(e) => setSettings(s => ({ ...s, maxTokens: parseInt(e.target.value) }))}
                        className="ai-input"
                    />
                </div>

                <div>
                    <label className="ai-label">
                        Top P ({settings.topP})
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.topP}
                        onChange={(e) => setSettings(s => ({ ...s, topP: parseFloat(e.target.value) }))}
                        className="ai-slider"
                    />
                </div>
            </div>

            {/* Sessions Section */}
            <div className="sidebar-section mt-auto">
                <button
                    onClick={handleNewSession}
                    className="ai-button-primary mb-4"
                >
                    New Session
                </button>

                <select
                    value={currentSessionId || ''}
                    onChange={(e) => onSessionChange(e.target.value)}
                    className="ai-input"
                >
                    <option value="">Select Session</option>
                    {sessions.map(session => (
                        <option key={session.id} value={session.id}>
                            {session.id} ({session.provider})
                        </option>
                    ))}
                </select>
            </div>
        </aside>
    )
}
