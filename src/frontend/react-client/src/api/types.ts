export type AuthRequest = {
    address: string
    signature: string
    message: string
}

export type AuthResponse = {
    token: string
}