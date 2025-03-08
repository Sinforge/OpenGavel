import type { AuthResponse, AuthRequest } from './types';
import api from './axios';

export const auth_api = {
    async authorize(params: AuthRequest): Promise<AuthResponse> {
        const response = await api.post("/auth", params);

        //if (!response.) {
        //    const error = await response.json()
        //    throw new Error(error.message || 'Authentication failed')
        //}

        return response.data;
    }
}