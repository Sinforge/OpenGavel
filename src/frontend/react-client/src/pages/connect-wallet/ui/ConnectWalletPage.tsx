import {
    Button,
    Stack,
    Typography,
    Card,
    CardContent,
    Avatar,
    Box
} from '@mui/material';
import { useConnect } from 'wagmi';

const WalletIcons: Record<string, string> = {
    'Injected': '/images/Injected-Icon.png',
    'MetaMask': '/images/MetaMask-Icon.svg',
    'WalletConnect': '/images/ConnectWallet-Icon.svg',
    'Phantom': '/images/Phantom-Icon.svg',
};

const ConnectWalletPage = () => {
    const { connect, connectors } = useConnect();

    const getWalletDisplayName = (connectorName: string) => {
        const nameMap: Record<string, string> = {
            'Injected': 'Injected',
            'MetaMask': 'MetaMask',
            'WalletConnect': 'WalletConnect',
            'Phantom': 'Phantom'
        };
        return nameMap[connectorName] || connectorName;
    };

    return (
        <Card sx={{
            width: '100%',
            borderRadius: 4,
            justifyContent: 'center',
            boxShadow: 3
        }}>
            <CardContent>
                <Typography variant="h5" textAlign="center" mb={4}>
                    Integrations
                </Typography>

                <Stack spacing={3}>
                    {connectors.map((connector) => {
                        const displayName = getWalletDisplayName(connector.name);
                        const iconSrc = WalletIcons[displayName];

                        return (
                            <Button
                                key={connector.id}
                                variant="outlined"
                                size="large"
                                fullWidth
                                startIcon={
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        p: 0.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <img
                                            src={iconSrc}
                                            alt={`${displayName} logo`}
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>
                                }
                                onClick={() => connect({ connector })}
                                sx={{
                                    height: 72,
                                    justifyContent: 'flex-start',
                                    px: 3,
                                    borderWidth: 2,
                                    borderRadius: 3,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: 2
                                    }
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="600"
                                    color="text.primary"
                                >
                                    {displayName}
                                </Typography>
                            </Button>
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ConnectWalletPage;