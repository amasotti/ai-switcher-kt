'use client';

import Sidebar, { AISettings } from '@/components/Sidebar';
import ChatHistory from '@/components/ChatHistory';
import ChatInput from '@/components/ChatInput';
import { SessionProvider } from '@/contexts/SessionContext';
import { useState } from 'react';
import Header from '@/components/Header';

export default function Home() {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'DeepSeek',
    temperature: 0.0,
    maxTokens: 3000,
    topP: 0.1,
  });

  return (
    <SessionProvider>
      <main className='flex h-screen bg-gray-50'>
        <Sidebar onSettingsChange={setSettings} />
        <div className='flex flex-1 flex-col'>
          <Header />
          <ChatHistory />
          <ChatInput settings={settings} />
        </div>
      </main>
    </SessionProvider>
  );
}
