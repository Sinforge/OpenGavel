import {Box, Button, Chip, CircularProgress, List, ListItem, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import { GetUserAuctionsAuctionModel } from "../../../shared/api/types";
import {useGetUserAuctionsQuery} from "../../../shared/api/auctionApi";
import {AuctionType} from "../../../entities/AuctionType";
import {AuctionStatus} from "../../../entities/AuctionStatus";
import {useWalletClient} from "wagmi";
import {BlindAuctionConfiguration, EnglishAuctionConfiguration} from "../../../entities/AuctionConfiguration";
import {deployContract} from "viem/actions";

type ContractInfo = {
    bytecode: string
    abi: any
}

export const UserAuctionsPage = () => {
    const { data: walletClient } = useWalletClient();
    const account = walletClient?.account;
    const { data } = useGetUserAuctionsQuery({address: account?.address });

    if(data === undefined)
        return <CircularProgress></CircularProgress>


    const getContractInfo = async (type: AuctionType) : Promise<ContractInfo> => {
        let path: string;
        switch (type) {
            case AuctionType.BLIND:
                path = "/contracts/auction.blind.json";
                break;
            case AuctionType.ENGLISH:
                path = "/contracts/auction.english.json"
                break;
        }

        return (await fetch(path)).json();
    }

    const handleDeploy = async (auction: GetUserAuctionsAuctionModel) => {
            const contractInfo = await getContractInfo(auction.type);
            const config = auction.type === AuctionType.ENGLISH
                ? new EnglishAuctionConfiguration(auction.configuration)
                : new BlindAuctionConfiguration(auction.configuration);

            const constructorParams = config.getContractArgs();

            console.log(`0x${contractInfo.bytecode}`);
            console.log(contractInfo);
            const txHash = await deployContract(walletClient!, {
                abi: contractInfo.abi,
                bytecode: `0x${contractInfo.bytecode}`,
                args: constructorParams,
                account: account!.address
            });

            console.log(txHash);
    };

    const getStatusColor = (status: AuctionStatus) => {
        switch (status) {
            case AuctionStatus.PENDING: return 'warning';
            case AuctionStatus.DEPLOYED: return 'success';
            case AuctionStatus.CLOSED: return 'error';
            default: return 'default';
        }
    };

    /*if (!userAddress) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error">Please connect your wallet</Typography>
            </Box>
        );
    }*/

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Auctions
            </Typography>

            <Button component={Link} to="/" variant="contained" sx={{ mb: 3 }}>
                Create New Auction
            </Button>


           <Paper elevation={3}>
                <List>
                    {data!.auctions.map((auction) => (
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
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDeploy(auction)}
                            >
                                Deploy

                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
};
