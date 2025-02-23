export type AuthRequest = {
    address: `0x${string}` | undefined
    signature: string
    message: string
}

export type AuthResponse = {
    token: string
}