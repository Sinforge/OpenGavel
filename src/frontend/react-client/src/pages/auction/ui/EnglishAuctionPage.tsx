import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import {GetAuctionResponse} from "../../../shared/api/types";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);


interface EnglishAuctionPageProps {
    data: GetAuctionResponse;
}
export const EnglishAuctionPage : React.FC<EnglishAuctionPageProps> = ({data}) => {
  const { id } = useParams();
  // TODO: для графиков использовать useRef
  const [bids, setBids] = useState([
    { amount: 100, time: '10:00' },
    { amount: 150, time: '10:30' },
    { amount: 200, time: '11:00' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
          // TODO use state manager
        // Если нужно загружать ставки с сервера:
        // const bidsData = await LotApi.getBids(id!);
        // setBids(bidsData);
      } catch (err) {
        setError('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);
  const chartData = {
    labels: bids.map(bid => bid.time),
    datasets: [
      {
        label: 'Bid history',
        data: bids.map(bid => bid.amount),
        borderColor: '#1976d2',
        tension: 0.4,
      },
    ],
  };
  if (loading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
  );
  if (error) return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
  );
  return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Bid history chart
          </Typography>
          <Box sx={{ height: 400 }}>
            <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Bid Amount'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Time'
                      }
                    }
                  }
                }}
            />
          </Box>
        </Paper>
      </Box>
  );
}
