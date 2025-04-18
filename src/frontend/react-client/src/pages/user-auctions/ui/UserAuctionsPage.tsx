import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Typography,
    Card,
    ListItemButton,
    useTheme,
    Modal,
    Avatar,
    CardContent,
    CardActions
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
    GetUserAuctionsAuctionModel,
    OpenAuctionRequest
} from '../../../shared/api/types';
import {
    useGetUserAuctionsQuery,
    useOpenAuctionMutation
} from '../../../shared/api/auctionApi';
import { AuctionType } from '../../../entities/AuctionType';
import { AuctionStatus } from '../../../entities/AuctionStatus';
import { useWalletClient } from 'wagmi';
import {
    BlindAuctionConfiguration,
    EnglishAuctionConfiguration
} from '../../../entities/AuctionConfiguration';
import { deployContract, waitForTransactionReceipt } from 'viem/actions';
import { CHAIN_ICONS, CHAIN_NAMES } from '../../../shared/constants/ChainConstants';

const avatarStyle = {
    width: 24,
    height: 24,
    '& img': {
        objectFit: 'contain',
    },
};

type ContractInfo = {
    bytecode: string;
    abi: any;
};

export const UserAuctionsPage: React.FC = () => {
    const theme = useTheme();
    const { data: walletClient } = useWalletClient();
    const account = walletClient?.account;
    const navigate = useNavigate();
    const { data, isLoading } = useGetUserAuctionsQuery(
        { address: account?.address },
        { skip: !account?.address }
    );

    const [openAuction] = useOpenAuctionMutation();
    const [isProcessing, setIsProcessing] = useState(false);

    if (isLoading || !data) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const getContractInfo = async (
        type: AuctionType
    ): Promise<ContractInfo> => {
        const path = type === AuctionType.BLIND
            ? '/contracts/auction.blind.json'
            : '/contracts/auction.english.json';
        return (await fetch(path)).json();
    };

    const handleDeploy = async (auction: GetUserAuctionsAuctionModel) => {
        setIsProcessing(true);
        try {
            const contractInfo = await getContractInfo(auction.type);
            const config = auction.type === AuctionType.ENGLISH
                ? new EnglishAuctionConfiguration(auction.configuration)
                : new BlindAuctionConfiguration(auction.configuration);
            const constructorParams = config.getContractArgs();

            const txHash = await deployContract(walletClient!, {
                abi: contractInfo.abi,
                bytecode: `0x${contractInfo.bytecode}`,
                args: constructorParams,
                account: account!.address
            });

            const receipt = await waitForTransactionReceipt(walletClient!, {
                hash: txHash
            });
            const contractAddress = receipt.contractAddress;

            const openAuctionRequest: OpenAuctionRequest = {
                id: auction.id,
                contractAddress: contractAddress!,
                chainId: walletClient!.chain.id
            };

            await openAuction(openAuctionRequest);
            navigate(`/auctions/${auction.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusColor = (status: AuctionStatus) => {
        switch (status) {
            case AuctionStatus.CONFIGURED: return 'warning';
            case AuctionStatus.OPENED: return 'success';
            case AuctionStatus.CLOSED: return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{
            maxWidth: 1000,
            mx: 'auto',
            p: 3,
            bgcolor: 'background.default',
            minHeight: '100vh'
        }}>
            <Typography variant="h4" gutterBottom color="textPrimary">
                My Auctions
            </Typography>

            <Button
                component={Link}
                to="/auctions/create"
                variant="contained"
                sx={{ mb: 4 }}
            >
                Create New Auction
            </Button>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3
            }}>
                {data.auctions.map((auction) => {
                    const isOpened = auction.status === AuctionStatus.OPENED;
                    return (
                        <Card
                            key={auction.id}
                            elevation={4}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: 'background.paper',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.2s'
                                }
                            }}
                        >
                            <ListItemButton
                                onClick={isOpened ? () => navigate(`/auctions/${auction.id}`) : undefined}
                                sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    height: '100%',
                                    textAlign: 'left',
                                    transition: theme.transitions.create(['transform'], {
                                        duration: theme.transitions.duration.short
                                    }),
                                    p: 0,
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    }
                                }}
                            >
                                <CardContent sx={{ width: '100%' }}>
                                    <Typography variant="h6" gutterBottom color="textPrimary">
                                        {auction.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                        <Chip
                                            label={auction.type}
                                            variant="outlined"
                                            color="primary"
                                        />
                                        <Chip
                                            label={auction.status}
                                            color={getStatusColor(auction.status)}
                                        />
                                        {auction.chainId && (
                                            <Chip
                                                variant="outlined"
                                                label={CHAIN_NAMES[auction.chainId] || `Chain ${auction.chainId}`}
                                                avatar={
                                                    <Avatar
                                                        src={CHAIN_ICONS[auction.chainId]}
                                                        sx={avatarStyle}
                                                    />
                                                }
                                                sx={{
                                                    color: 'text.secondary',
                                                    borderColor: 'divider'
                                                }}
                                            />
                                        )}
                                    </Box>
                                    {auction.contractAddress && (
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ mt: 1 }}
                                        >
                                            Contract: {auction.contractAddress}
                                        </Typography>
                                    )}
                                </CardContent>
                                {auction.status === AuctionStatus.CONFIGURED &&
                                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            disabled={isProcessing}
                                            onClick={() => handleDeploy(auction)}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark'
                                                }
                                            }}
                                        >
                                            Deploy
                                        </Button>
                                    </CardActions>
                                }
                            </ListItemButton>
                        </Card>
                    );
                })}
            </Box>

            <Modal open={isProcessing} disableAutoFocus>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 280,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 3,
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.primary'
                    }}
                >
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Transaction pending...
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};