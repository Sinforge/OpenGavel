import type { AuthResponse, AuthRequest } from './types';
import { authAxios } from './axios';

export const AuthApi = {
    async authorize(params: AuthRequest): Promise<AuthResponse> {
        const response = await authAxios.post("/auth", params);


        return response.data;
    }
}