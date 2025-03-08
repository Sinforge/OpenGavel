import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Paper, Box, Typography } from '@mui/material'
import AuctionHeader from '../components/AuctionHeader';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function EnglishAuctionPage() {
  const { id } = useParams();
  const [bids] = useState([
    { amount: 100, time: '10:00' },
    { amount: 150, time: '10:30' },
    { amount: 200, time: '11:00' },
  ]);

  const chartData = {
    labels: bids.map(bid => bid.time),
    datasets: [
      {
        label: 'Stats history',
        data: bids.map(bid => bid.amount),
        borderColor: '#1976d2',
      },
    ],
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <AuctionHeader owner="0x321...cba" type="English auction" />
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Change bid status
        </Typography>
        
        <Box sx={{ height: 400 }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}