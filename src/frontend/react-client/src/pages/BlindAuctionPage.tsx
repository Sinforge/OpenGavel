import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import AuctionHeader from '../components/AuctionHeader';
import { Bid } from '../types/Bid';
import { AuctionApi } from "../api/auction_api";
import AuctionType from "../types/AuctionType";
import { CircularProgress } from '@mui/material';
import {GetBlindAuctionResponse} from "../api/types";

export default function BlindAuctionPage() {
  const { id } = useParams();
  const [bids, setBids] = useState<Bid[]>([]);
  const [auctionInfo, setAuctionInfo] = useState<GetBlindAuctionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionData = await AuctionApi.getBlindAuction(id!);
        setAuctionInfo(auctionData);

/*        // Загрузка ставок
        const bidsData = await LotApi.getBids(id!);
        setBids(bidsData);*/
      } catch (err) {
        setError('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!auctionInfo) return null;

  return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <AuctionHeader
            title={auctionInfo.title}
            owner={auctionInfo.ownerAddress}
            type={AuctionType.BLIND}
        />

        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Bids stats
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Bid count: {bids.length}
          </Typography>

          <Divider sx={{ my: 2 }} />

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