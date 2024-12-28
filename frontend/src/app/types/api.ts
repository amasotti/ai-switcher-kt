import { AxiosResponse } from 'axios';
import {Session} from "@/app/types/session";

export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

export type CreateSessionResponse = string; // Session ID
export type GetSessionsResponse = Array<{ id: string; provider: string }>;
export type GetSessionResponse = Session;
export type GenerateResponse = string; // AI response
