import { useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Paper
} from '@mui/material';
import {custom, parseEther} from "viem";
import {http, useAccount, useClient} from 'wagmi';
import { deployContract } from 'viem/actions'
import AuctionStatus from "../types/AuctionStatus";
import { AuctionApi } from "../api/auction_api";
import { EthAddress, GetUserAuctionsAuctionModel } from "../api/types";
import { Link } from "react-router-dom";
import { BlockchainApi } from "../api/blockchain_api";
import AuctionType from "../types/AuctionType";
import { config } from "../configs/wagmi";
import {createWalletClient} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {mainnet, sepolia} from "wagmi/chains";

const UserAuctionsPage = () => {
    const [auctions, setAuctions] = useState<GetUserAuctionsAuctionModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [deployingId, setDeployingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const { address: userAddress } = useAccount();
    const client = useClient({ config });

    useEffect(() => {
        const fetchAuctions = async () => {
            if (!userAddress) return;

            try {
                const response = await AuctionApi.getUserAuctions({ address: userAddress });
                setAuctions(response.auctions);
            } catch (err) {
                setError('Failed to load auctions');
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, [userAddress]);

    const getContractDeployData = async (type: AuctionType) => {
        switch (type) {
            case AuctionType.ENGLISH:
                return await BlockchainApi.getEnglishAuctionContract();
            case AuctionType.BLIND:
                return await BlockchainApi.getBlindAuctionContract();
            default:
                throw new Error('Unsupported auction type');
        }
    }

    const getContractConstructorArgs = async (type: AuctionType, id: string): Promise<any[]> => {
        switch (type) {
            case AuctionType.ENGLISH:
                const english = await AuctionApi.getEnglishAuctionDeployOptions(id);
                return [
                    english.ownerAddress,
                    english.startPrice,
                    english.endTime,
                    english.bidStep
                ];
            case AuctionType.BLIND:
                const blind = await AuctionApi.getBlindAuctionDeployOptions(id);
                const debug = [
                    blind.ownerAddress,
                    blind.title,
                    parseEther(blind.startPrice.toString()),
                    new Date(blind.endTime).getSeconds(),
                    blind.bidAmount
                ];
                console.log(debug);
                return debug;
            default:
                return [];
        }
    }

    const handleDeploy = async (auction: GetUserAuctionsAuctionModel) => {
        if (!userAddress) {
            setError('Wallet not connected');
            return;
        }

        try {
            setDeployingId(auction.id);
            setError('');

            // Получаем данные для деплоя
            const contractDeployData = await getContractDeployData(auction.type);
            const constructorArgs = await getContractConstructorArgs(auction.type, auction.id);

            // Используем текущий `wagmi` клиент
            const walletClient = createWalletClient({
                // Используем инжектированный провайдер MetaMask
                transport: custom(window.ethereum),
                chain: sepolia,
            })
            const [account] = await walletClient.getAddresses();
            const txHash = await deployContract(walletClient, {
                abi: JSON.parse(contractDeployData.abi), // Убираем Object.entries, оставляем массив ABI
                bytecode: contractDeployData.bytecode,
                args: constructorArgs,
                account, // Адрес, с которого происходит деплой (MetaMask подписывает транзакцию)
            });

            console.log('Contract deployment tx hash:', txHash);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Deployment failed');
        } finally {
            setDeployingId(null);
        }
    };

    const getStatusColor = (status: AuctionStatus) => {
        switch (status) {
            case AuctionStatus.PENDING: return 'warning';
            case AuctionStatus.DEPLOYED: return 'success';
            case AuctionStatus.CLOSED: return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!userAddress) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">Please connect your wallet</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Auctions
            </Typography>

            <Button component={Link} to="/" variant="contained" sx={{ mb: 3 }}>
                Create New Auction
            </Button>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Paper elevation={3}>
                <List>
                    {auctions.map((auction) => (
                        <ListItem
                            key={auction.id}
                            sx={{
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{auction.title}</Typography>
                                <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={auction.type}
                                        variant="outlined"
                                        color="primary"
                                    />
                                    <Chip
                                        label={auction.status}
                                        color={getStatusColor(auction.status)}
                                    />
                                    {auction.contractAddress && (
                                        <Typography variant="body2">
                                            Contract: {auction.contractAddress}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {auction.status === AuctionStatus.PENDING && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleDeploy(auction)}
                                    disabled={!!deployingId}
                                >
                                    {deployingId === auction.id ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Deploy'
                                    )}
                                </Button>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};

export default UserAuctionsPage;