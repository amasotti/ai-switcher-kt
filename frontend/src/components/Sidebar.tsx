'use client';

import { useSession } from '@/contexts/SessionContext';
import { createSession } from '@/lib/api';
import { useEffect, useState } from 'react';

export interface AISettings {
  provider: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

interface SidebarProps {
  onSettingsChange: (settings: AISettings) => void;
}

export default function Sidebar({ onSettingsChange }: SidebarProps) {
  const { sessions, currentSessionId, addSession, setCurrentSession } =
    useSession();
  const [settings, setSettings] = useState<AISettings>({
    provider: 'DeepSeek',
    temperature: 0.0,
    maxTokens: 150,
    topP: 1.0,
  });

  // Update parent component when settings change
  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  async function handleNewSession() {
    try {
      const sessionId = await createSession(settings.provider);
      addSession({
        id: sessionId,
        provider: settings.provider,
        messages: [],
      });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  return (
    <aside className='flex h-screen w-80 flex-col bg-gray-800 text-white'>
      {/* Settings Section */}
      <div className='sidebar-section'>
        <h3 className='mb-6 text-xl font-bold'>AI Settings</h3>

        <div>
          <label className='ai-label'>Provider</label>
          <select
            value={settings.provider}
            onChange={(e) =>
              setSettings((s) => ({ ...s, provider: e.target.value }))
            }
            className='ai-input'
          >
            <option value='DeepSeek'>DeepSeek</option>
            <option value='OpenAI'>OpenAI</option>
            <option value='Claude'>Claude</option>
          </select>
        </div>

        <div>
          <label className='ai-label'>
            Temperature ({settings.temperature})
          </label>
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={settings.temperature}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                temperature: parseFloat(e.target.value),
              }))
            }
            className='ai-slider'
          />
        </div>

        <div>
          <label className='ai-label'>Max Tokens</label>
          <input
            type='number'
            value={settings.maxTokens}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                maxTokens: parseInt(e.target.value),
              }))
            }
            className='ai-input'
          />
        </div>

        <div>
          <label className='ai-label'>Top P ({settings.topP})</label>
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={settings.topP}
            onChange={(e) =>
              setSettings((s) => ({ ...s, topP: parseFloat(e.target.value) }))
            }
            className='ai-slider'
          />
        </div>
      </div>

      {/* Sessions Section */}
      <div className='sidebar-section mt-auto'>
        <button onClick={handleNewSession} className='ai-button-primary mb-4'>
          New Session
        </button>
        <select
          value={currentSessionId || ''}
          onChange={(e) => setCurrentSession(e.target.value)}
          className='ai-input'
        >
          <option value=''>Select Session</option>
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.id} ({session.provider})
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
