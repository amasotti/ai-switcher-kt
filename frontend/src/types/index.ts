export interface Session {
  id: string;
  provider: string;
  messages: Message[];
}

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AISettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  provider: string;
}
