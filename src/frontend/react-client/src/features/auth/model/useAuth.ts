import { useSignMessage } from 'wagmi';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../app/store';
/*
import { api } from '../../../shared/api';
*/
import { authActions } from './authSlice';

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { signMessageAsync } = useSignMessage();

    const login = async () => {
        try {
            //const { nonce } = await api.get('/auth/nonce');
            //const signature = await signMessageAsync({ message: nonce });

            //const { jwt, address } = await api.post('/auth/verify', { signature, nonce });

            //dispatch(authActions.setAuth({ jwt, walletAddress: address }));
        } catch (error) {
            //dispatch(authActions.clearAuth());
            throw error;
        }
    };

    const logout = () => {
        dispatch(authActions.clearAuth());
    };

    return { login, logout };
};