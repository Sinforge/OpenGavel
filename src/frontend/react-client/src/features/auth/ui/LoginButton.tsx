import {useAccount, useSignMessage} from 'wagmi';
import {useAuthorizeMutation} from "../../../shared/api/authApi";
import {useAppDispatch} from "../../../app/store";
import {authActions} from "../model/authSlice";
import {
    Button,
    CircularProgress,
    Stack, Typography,
    useTheme
} from '@mui/material';
import { VerifiedUser } from '@mui/icons-material';
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

const message = ("Message to verify login. (OpenGavel)")

export const LoginButton = () => {
    //const theme = useTheme();
    const { address } = useAccount();
    const { signMessageAsync, isPending: isSigning } = useSignMessage();
    const [authorize, { isLoading: isAuthorizing }] = useAuthorizeMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            const signature = await signMessageAsync({ message });
            const { token } = await authorize({ address, message, signature }).unwrap();
            dispatch(authActions.setAuth({ jwt: token, walletAddress: address! }));
            navigate('/auctions/my')
        } catch (error) {
            enqueueSnackbar('Authorization failed. Please try again.', {
                variant: 'error'
            });
        }
    };

    return (
        <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleAuth}
            disabled={isSigning || isAuthorizing}
            startIcon={<VerifiedUser />}
            sx={{
                py: 2,
                borderRadius: 3,
                //background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.02)'
                },
                '&:active': {
                    transform: 'scale(0.98)'
                }
            }}
        >
            {isSigning || isAuthorizing ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                    <CircularProgress size={20} color="inherit" />
                    <Typography>Authenticating...</Typography>
                </Stack>
            ) : (
                'Sign In with Wallet'
            )}
        </Button>
    );
};