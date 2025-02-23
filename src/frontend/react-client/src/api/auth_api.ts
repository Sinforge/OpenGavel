import type { AuthResponse, AuthRequest } from './types';
const API_BASE_URL = "localhost:8080"

export const auth_api = {
    async verifySignature(params: AuthRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Authentication failed')
        }

        return response.json()
    }
}