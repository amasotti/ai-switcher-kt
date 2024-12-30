'use client';

import { useState } from 'react';
import { generateResponse } from '@/lib/api';
import { useSession } from '@/contexts/SessionContext';
import {useSettings} from "@/contexts/SettingsContext";

export default function ChatInput() {
  const { currentSessionId, addMessage } = useSession();
  const {settings} = useSettings();
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentSessionId || !userPrompt.trim() || isLoading) return;

    const timestamp = new Date().toLocaleString();

    const userMessage = {
      role: 'user',
      content: userPrompt,
      timestamp,
    };
    addMessage(currentSessionId, userMessage);

    setIsLoading(true);
    try {
      const response = await generateResponse({
        sessionId: currentSessionId,
        apiName: settings.provider,
        systemPrompt,
        userPrompt,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        topP: settings.topP,
      });

      addMessage(currentSessionId, {
        role: 'bot',
        content: response,
        timestamp: new Date().toLocaleString(),
      });
      setUserPrompt('');
    } catch (error) {
      console.error('Failed to generate response:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='border-t border-gray-200 bg-white p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder='System Prompt (Context)'
            className='h-24 w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex gap-4'>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder='Your message...'
            className='flex-1 resize-none rounded-lg border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500'
          />

          <button
            type='submit'
            disabled={isLoading || !currentSessionId || !userPrompt.trim()}
            className='rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
