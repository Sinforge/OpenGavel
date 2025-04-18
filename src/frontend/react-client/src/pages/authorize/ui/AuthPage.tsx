import {useAccount, useDisconnect} from 'wagmi';
import {
    Container,
    Box,
    Typography,
    Chip,
    CircularProgress,
    Backdrop, Button
} from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import {useAppSelector} from "../../../app/store";
import ConnectWalletPage from "../../connect-wallet/ui/ConnectWalletPage";
import {LoginButton} from "../../../features/auth";

export const AuthPage = () => {
    const { isConnected, address } = useAccount();
    const {disconnect} = useDisconnect();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    if (isAuthenticated) {
        return (
                <CircularProgress color="inherit" />
        );
    }

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '10',
                py: 4
            }}
        >
            <Box textAlign="center" mb={1}>
                <Typography variant="h3" gutterBottom>
                    Welcome to OpenGavel
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Select connect method to continue
                </Typography>
            </Box>

            {!isConnected ? (
                <Box sx={{ width: '100%' }}>
                    <ConnectWalletPage />
                </Box>
            ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <Chip
                                icon={<AccountBalanceWallet />}
                                label={address}
                                variant="outlined"
                                sx={{
                                    mb: 3,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    '.MuiChip-label': { overflow: 'visible' }
                                }}
                            />
                            <Button
                                onClick={() => disconnect()}
                            >Change connect method</Button>
                            <LoginButton />
                        </Box>
                    )}
        </Container>
    );
};