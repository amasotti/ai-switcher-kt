import ky from 'ky';

interface GenerateParams {
  sessionId: string;
  apiName: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

interface Session {
  id: string;
  provider: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

// API client instance with base configuration
const api = ky.create({
  prefixUrl: 'http://localhost:8080/api',
  timeout: 300000,
  hooks: {
    beforeError: [
      (error) => {
        // Log errors or handle them globally
        console.error('API Error:', error);
        return error;
      },
    ],
  },
});

export async function getSessions(): Promise<Session[]> {
  return api.get('get-sessions').json();
}

// TODO: If the session become many, I will need to just import the metadata and retrieve the chat history only
// when the user clicks on the session
// export async function getSession(sessionId: string): Promise<Session> {
//   return api.get(`get-session/${sessionId}`).json();
// }

export async function createSession(provider: string): Promise<string> {
  return api
    .post('create-session', {
      searchParams: { provider },
    })
    .text();
}

export async function generateResponse(
  params: GenerateParams
): Promise<string> {
  return api
    .post('generate', {
      json: params,
    })
    .text();
}

export async function deleteSession(sessionId: string): Promise<void> {
  await api.delete(`delete-session/${sessionId}`);
}

// export async function getSessionHistory(sessionId: string): Promise<Session> {
//   return api.get(`get-session/${sessionId}`).json();
// }
