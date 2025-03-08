import { Box, Typography, List, ListItem, Paper, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import AuctionHeader from '../components/AuctionHeader';
import { Bid } from '../types/Bid';

export default function BlindAuctionPage() {
  const { id } = useParams();
  const [bids, setBids] = useState<Bid[]>([
    { bidder: '0x123...abc', amount: 1.5, timestamp: '2023-10-20 14:30' },
    { bidder: '0x456...def', amount: 2.0, timestamp: '2023-10-20 15:00' },
  ]);

  const auctionInfo = {
    owner: '0x789...ghi',
    type: 'Blind auction',
    endTime: '2023-10-25 18:00',
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <AuctionHeader owner={auctionInfo.owner} type={auctionInfo.type} />
      
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