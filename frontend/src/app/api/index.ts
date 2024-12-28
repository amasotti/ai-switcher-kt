import axios, { AxiosResponse } from 'axios';
import {
    CreateSessionResponse,
    GetSessionsResponse,
    GetSessionResponse,
    GenerateResponse,
} from '../types/api';

const index = axios.create({
    baseURL: 'http://localhost:8080/api', // Point to the Spring Boot backend
});

export const createSession = async (provider: string): Promise<CreateSessionResponse> => {
    const response: AxiosResponse<CreateSessionResponse> = await index.post('/create-session', null, {
        params: { provider },
    });
    return response.data;
};

export const getSessions = async (): Promise<GetSessionsResponse> => {
    const response: AxiosResponse<GetSessionsResponse> = await index.get('/get-sessions');
    return response.data;
};

export const getSession = async (sessionId: string): Promise<GetSessionResponse> => {
    const response: AxiosResponse<GetSessionResponse> = await index.get(`/get-session/${sessionId}`);
    return response.data;
};

export const generateResponse = async (data: {
    sessionId: string;
    apiName: string;
    systemPrompt: string;
    userPrompt: string;
    temperature: number;
    maxTokens: number;
    topP: number;
}): Promise<GenerateResponse> => {
    const response: AxiosResponse<GenerateResponse> = await index.post('/generate', data);
    return response.data;
};
