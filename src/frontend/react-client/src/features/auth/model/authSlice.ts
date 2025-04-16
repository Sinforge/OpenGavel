import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
    jwt: string | null;
    walletAddress: `0x${string}` | null;
    isAuthenticated: boolean;
}

const loadInitialState = (): AuthState => {
    const jwt = Cookies.get('jwt') ?? null;
    const walletAddress = (Cookies.get('walletAddress') ?? null) as `0x${string}` | null;

    return {
        jwt,
        walletAddress,
        isAuthenticated: !!jwt && !!walletAddress
    };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (
            state,
            action: PayloadAction<{
                jwt: string;
                walletAddress: `0x${string}`
            }>
        ) => {
            state.jwt = action.payload.jwt;
            state.walletAddress = action.payload.walletAddress;
            state.isAuthenticated = true;

            Cookies.set('jwt', action.payload.jwt, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            Cookies.set('walletAddress', action.payload.walletAddress, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
        },
        clearAuth: (state) => {
            state.jwt = null;
            state.walletAddress = null;
            state.isAuthenticated = false;

            Cookies.remove('jwt');
            Cookies.remove('walletAddress');
        },
    },
});

export const { actions: authActions, reducer: authReducer } = authSlice;