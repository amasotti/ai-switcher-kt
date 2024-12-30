'use client';

import { useSession } from '@/contexts/SessionContext';

export default function SessionPanel() {
  const { sessions, currentSessionId, addSession, setCurrentSession, deleteSession } =
    useSession();

  return (
      <div className='sidebar-section mt-auto'>
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
          <button onClick={() => addSession()} className='ai-button-primary mb-4'>
              New Session
          </button>
          <button onClick={() => deleteSession(currentSessionId!)} className='ai-button-danger mb-4'>
              Clear Session
          </button>
      </div>
  );
}
