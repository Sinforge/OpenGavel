import {Box, Button, Chip, CircularProgress, List, ListItem, Paper, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {GetUserAuctionsAuctionModel, OpenAuctionRequest} from "../../../shared/api/types";
import {useGetUserAuctionsQuery, useOpenAuctionMutation} from "../../../shared/api/auctionApi";
import {AuctionType} from "../../../entities/AuctionType";
import {AuctionStatus} from "../../../entities/AuctionStatus";
import {useWalletClient} from "wagmi";
import {BlindAuctionConfiguration, EnglishAuctionConfiguration} from "../../../entities/AuctionConfiguration";
import {deployContract, waitForTransactionReceipt} from "viem/actions";

type ContractInfo = {
    bytecode: string
    abi: any
}

const AuctionItemTokenAddress = "0x8cC1fF721928ddE2903ca7eb0bbc113daD29DDbD"

export const UserAuctionsPage = () => {
    const { data: walletClient } = useWalletClient();
    const account = walletClient?.account;
    const navigate = useNavigate();
    const { data } = useGetUserAuctionsQuery(
        { address: account?.address },
        { skip: !account?.address });

    const [openAuction] = useOpenAuctionMutation();

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

        const receipt = await waitForTransactionReceipt(walletClient!, {  hash: txHash });
        const contractAddress = receipt.contractAddress;

        const openAuctionRequest: OpenAuctionRequest = {
            id: auction.id,
            contractAddress: contractAddress!,
            chainId: walletClient!.chain.id
        }

        await openAuction(openAuctionRequest);

        navigate("/auctions/" + auction.id);
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
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Auctions
            </Typography>

            <Button component={Link} to="/auctions/create" variant="contained" sx={{ mb: 3 }}>
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
