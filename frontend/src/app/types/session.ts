export interface Session {
    id: string;
    provider: string;
    messages: ChatMessage[];
}

export interface ChatMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
    timestamp: string;
}
