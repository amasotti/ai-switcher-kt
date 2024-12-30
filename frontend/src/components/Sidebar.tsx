'use client';

import SessionPanel from '@/components/sidebar/SessionPanel';
import AISettingsPanel from '@/components/sidebar/AISettingsPanel';

export default function Sidebar() {
  return (
    <aside className='flex h-screen w-80 flex-col bg-gray-800 text-white'>
      <AISettingsPanel />
      <SessionPanel />
    </aside>
  );
}
