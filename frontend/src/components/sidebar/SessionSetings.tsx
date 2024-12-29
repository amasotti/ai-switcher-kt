'use client';

import { useSession } from '@/contexts/SessionContext';
import { createSession } from '@/lib/api';

interface SessionPanelProps {
  currentProvider: string;
}

export default function SessionPanel({ currentProvider }: SessionPanelProps) {
  const { sessions, currentSessionId, addSession, setCurrentSession } =
    useSession();

  async function handleNewSession() {
    try {
      const sessionId = await createSession(currentProvider);
      addSession({
        id: sessionId,
        provider: currentProvider,
        messages: [],
      });
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  }

  return (
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
  );
}
