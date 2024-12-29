'use client';

import { useState } from 'react';
import SessionPanel from '@/components/sidebar/SessionSetings';
import AISettingsPanel from '@/components/sidebar/AISettingsPanel';
import { AISettings } from '@/types';

interface SidebarProps {
  onSettingsChange: (settings: AISettings) => void;
}

export default function Sidebar({ onSettingsChange }: SidebarProps) {
  const [currentProvider, setCurrentProvider] = useState('DeepSeek');

  const handleSettingsChange = (settings: AISettings) => {
    setCurrentProvider(settings.provider);
    onSettingsChange(settings);
  };

  return (
    <aside className='flex h-screen w-80 flex-col bg-gray-800 text-white'>
      <AISettingsPanel onSettingsChange={handleSettingsChange} />
      <SessionPanel currentProvider={currentProvider} />
    </aside>
  );
}
