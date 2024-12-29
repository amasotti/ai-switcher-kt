'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { getSessions } from '@/lib/api';

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  provider: string;
  messages: Message[];
}

interface SessionContextType {
  sessions: Session[];
  currentSessionId: string | null;
  addSession: (session: Session) => void;
  setCurrentSession: (id: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  loadSessionMessages: (sessionId: string) => Message[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
    setCurrentSessionId(session.id);
  };

  const setCurrentSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const addMessage = (sessionId: string, message: Message) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, message] }
          : session
      )
    );
  };

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const sessions = await getSessions();
      setSessions(sessions);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = (sessionId: string): Message[] => {
    const session = sessions.find((s) => s.id === sessionId);
    return session?.messages || [];
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSessionId,
        addSession,
        setCurrentSession,
        addMessage,
        loadSessionMessages,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
