import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    jwt: string | null;
    walletAddress: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    jwt: null,
    walletAddress: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ jwt: string; walletAddress: string }>) => {
            state.jwt = action.payload.jwt;
            state.walletAddress = action.payload.walletAddress;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.jwt = null;
            state.walletAddress = null;
            state.isAuthenticated = false;
        },
    },
});

export const { actions: authActions, reducer: authReducer } = authSlice;