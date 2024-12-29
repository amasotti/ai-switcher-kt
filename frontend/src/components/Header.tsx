'use client';

import { useSession } from '@/contexts/SessionContext';

export default function Header() {
  const { currentSessionId } = useSession();

  return (
    <header className='border-b bg-gray-800 px-6 py-4 text-white'>
      <h1 className='text-2xl font-semibold'>
        Toni's AI Switcher
        <span className='ml-2 text-sm text-white'>
          {currentSessionId
            ? `Session: ${currentSessionId}`
            : 'Select or create a session'}
        </span>
      </h1>
    </header>
  );
}
