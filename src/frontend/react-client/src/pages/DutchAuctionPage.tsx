import { useParams } from "react-router-dom";
import { Box, Paper, Typography } from "@mui/material"
import AuctionHeader from "../components/AuctionHeader";

export default function DutchAuctionPage() {
    const { id } = useParams();
    const auctionInfo = {
      currentPrice: 500,
      startPrice: 1000,
      priceDecreaseRate: 50,
      nextDecrease: '15:30',
    };
  
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <AuctionHeader owner="0x654...fed" type="Dutch auction" />
        
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Current bid: {auctionInfo.currentPrice} ETH
          </Typography>
  
          <Typography variant="body1">
            Start bid: {auctionInfo.startPrice} ETH
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 1 }}>
            Price decrease rate: {auctionInfo.priceDecreaseRate} ETH/hour
          </Typography>
  
          <Typography variant="body1" sx={{ mt: 1 }}>
            Next decrease: {auctionInfo.nextDecrease}
          </Typography>
        </Paper>
      </Box>
    );
  }