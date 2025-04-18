import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
    IconButton,
    Avatar,
    CircularProgress, useTheme
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import {
    useAccount,
    useChainId,
    useSwitchChain,
    useBalance
} from 'wagmi';
import { formatEther } from 'viem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useDisconnect } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { authActions } from '../../features/auth';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { generalRoutes } from '../config/routes';
import {chains} from "../../app/providers/WagmiProvider";
import {CHAIN_ICONS} from "../constants/ChainConstants";
import {useColorMode} from "../theme/ThemeWrapper";

const avatarStyle = {
    width: 32,
    height: 32,
    '& img': {
        objectFit: 'contain',
    },
};

export const LogoutButton: React.FC = () => {
    const { disconnect } = useDisconnect();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        disconnect();
        dispatch(authActions.clearAuth());
        localStorage.removeItem('authToken');
        navigate('/auth');
    };

    return (
        <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ textTransform: 'none', borderRadius: 2, px: 3, py: 1 }}
        >
            Log Out
        </Button>
    );
};

const Header: React.FC = () => {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const { data: balance, isLoading: balanceLoading } = useBalance({ address });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();

    const currentChain = chains.find((c : any) => c.id === chainId);

    const navRoutes = generalRoutes.filter(
        (route) => !['/auth', '/auctions/:id'].includes(route.path!)
    );

    const handleNetworkChange = (newChainId: number) => {
        switchChain({ chainId: newChainId });
        setAnchorEl(null);
    };

    const shortenAddress = (addr?: string) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

    return (
        <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: 64 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Typography
                        variant="h6"
                        onClick={() => navigate('/auctions')}
                        sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                    >
                        OpenGavel
                    </Typography>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        <Button  key={'/auctions/create'}
                                 onClick={() => navigate('/auctions/create')}
                                 sx={{ textTransform: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                            Create
                        </Button>
                    </Box>
                </Box>
                {
                    !isAuthenticated && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Button  key={'/auth'}
                                     onClick={() => navigate('/auth')}
                                     sx={{ textTransform: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                                Authorize
                            </Button>
                        </Box>
                    )
                }
                {isAuthenticated && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Button  key={'/auctions/my'}
                                 onClick={() => navigate('/auctions/my')}
                                 sx={{ textTransform: 'none', color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
                            My Auctions
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={
                                <Avatar
                                    src={CHAIN_ICONS[chainId]}
                                    sx={avatarStyle}
                                />
                            }
                            endIcon={<ArrowDropDownIcon />}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{ textTransform: 'none' }}
                        >
                            {currentChain?.name || `Chain ${chainId}`}
                        </Button>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            {chains.map((chain: any) => (
                                <MenuItem
                                    key={chain.id}
                                    selected={chain.id === chainId}
                                    onClick={() => handleNetworkChange(chain.id)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar
                                            src={CHAIN_ICONS[chain.id]}
                                            sx={avatarStyle}
                                        />
                                        <Typography>{chain.name}</Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Menu>

                        <Box sx={{ minWidth: 100, textAlign: 'right' }}>
                            <Typography variant="caption" color="text.secondary">
                                Balance
                            </Typography>
                            {balanceLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Typography fontWeight="bold">
                                    {parseFloat(formatEther(balance?.value ?? BigInt(0))).toFixed(4)} {balance?.symbol}
                                </Typography>
                            )}
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AccountBalanceWalletIcon />}
                            sx={{ textTransform: 'none' }}
                        >
                            {shortenAddress(address)}
                        </Button>

                        <LogoutButton />
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;