import React, {useEffect, useState} from 'react';
import {Box, Typography, List, ListItem, Paper, Divider} from '@mui/material';
import {useParams} from 'react-router-dom';
import {CircularProgress} from '@mui/material';
import {GetAuctionResponse} from "../../../shared/api/types";

interface BlindAuctionPageProps {
    data: GetAuctionResponse;
}

export const BlindAuctionPage: React.FC<BlindAuctionPageProps> = ({data}) => {
    const {id} = useParams();
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const bidsData = await AuctionApi.getBids(id!);
                //setBids(bidsData);
            } catch (err) {
                setError('Failed to load auction data');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{p: 3, maxWidth: 800, mx: 'auto'}}>


            <Paper sx={{p: 3, mt: 2}}>
                <Typography variant="h6" gutterBottom>
                    Bids stats
                </Typography>

                <Typography variant="body1" sx={{mb: 2}}>
                    Bid count: {bids.length}
                </Typography>

                <Divider sx={{my: 2}}/>

                <Typography variant="h6" gutterBottom>
                    Auction participants
                </Typography>

                <List>
                    {bids.map((bid, index) => (
                        <ListItem key={index}>
                            <Typography>
                                {bid.bidder} - {new Date(bid.timestamp).toLocaleString()}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

