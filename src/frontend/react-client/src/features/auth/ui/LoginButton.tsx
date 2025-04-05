import { useAccount, useConnect } from 'wagmi';
import { useAuth } from '../model/useAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

export const LoginButton = () => {
    const { connect, connectors } = useConnect();
    const { isConnected } = useAccount();
    const { login } = useAuth();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogin = async () => {
        if (!isConnected) {
            await connect({ connector: connectors[0] });
        }
        await login();
    };

    return (
        <button onClick={handleLogin} disabled={isAuthenticated}>
            {isAuthenticated ? 'Connected' : 'Connect Wallet & Login'}
        </button>
    );
};