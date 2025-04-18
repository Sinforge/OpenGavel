import React, { useCallback, useEffect, useState } from 'react';
import { useWriteContract } from 'wagmi';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { parseEther, formatUnits } from 'viem';
import { EthAddress, GetAuctionResponse } from '../../../shared/api/types';
import EnglishAuctionBidChart from '../../../features/get-auction/ui/EnglishAuctionBidChart';
import EventLogList from '../../../features/get-auction/ui/EventLogList';

dayjs.extend(duration);

interface Bid {
  amount: bigint;
  bidder: EthAddress;
  blockNumber: bigint;
  timestamp: Date;
}

interface DecodedEventLog {
  eventName: string;
  args: Record<string, string>;
  transactionHash: string;
  address: EthAddress;
  blockNumber: bigint;
  timestamp: Date;
}

interface Props {
  data: GetAuctionResponse;
}

export const EnglishAuctionPage: React.FC<Props> = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [bids, setBids] = useState<Bid[]>([]);
  const [events, setEvents] = useState<DecodedEventLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<'pending' | 'active' | 'ended'>('pending');
  const [timeLeft, setTimeLeft] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/v1/Contract/getLogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chainId: data.chainId,
          address: data.contractAddress
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { result } = await response.json();

      const parsedBids = result.map((log: any) => {
        const bidder = `0x${log.topics[1].slice(-40)}`.toLowerCase();
        const amount = BigInt(log.data);
        const blockNumber = BigInt(parseInt(log.blockNumber, 16));
        const timestamp = new Date(parseInt(log.timeStamp, 16) * 1000);

        return {
          bidder,
          amount,
          blockNumber,
          timestamp
        };
      });

      const parsedEvents = result.map((log: any) => ({
        eventName: 'NewBid',
        args: {
          bidder: `0x${log.topics[1].slice(-40)}`.toLowerCase(),
          amount: formatUnits(BigInt(log.data), 18),
        },
        transactionHash: log.transactionHash,
        address: log.address,
        blockNumber: BigInt(parseInt(log.blockNumber, 16)),
        timestamp: new Date(parseInt(log.timeStamp, 16) * 1000)
      }));

      setBids(parsedBids);
      setEvents(parsedEvents);
      setLoading(false);
    } catch (err) {
      setError('Failed to load auction data');
      enqueueSnackbar('Error loading auction data', { variant: 'error' });
      setLoading(false);
    }
  }, [enqueueSnackbar, data.chainId, data.contractAddress]); // Добавляем зависимости
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const { writeContract: placeBid, isPending: isBidding } = useWriteContract({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('Bid placed successfully!', { variant: 'success' });
        setBidAmount('');
        fetchLogs();
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
    },
  });

  // Остальной код без изменений
  const { writeContract: withdraw } = useWriteContract({
    mutation: {
      onSuccess: () => enqueueSnackbar('Withdrawal successful!', { variant: 'success' }),
      onError: (error) => enqueueSnackbar(error.message, { variant: 'error' }),
    },
  });

  const { writeContract: finalize } = useWriteContract({
    mutation: {
      onSuccess: () => enqueueSnackbar('Auction finalized!', { variant: 'success' }),
      onError: (error) => enqueueSnackbar(error.message, { variant: 'error' }),
    },
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const start = Math.floor(new Date(data.startTime).getTime() / 1000);
      const end = Math.floor(new Date(data.endTime).getTime() / 1000);

      if (now < start) {
        setAuctionStatus('pending');
        setTimeLeft(dayjs.duration(start - now, 'seconds').format('D[d] H[h] m[m] s[s]'));
      } else if (now < end) {
        setAuctionStatus('active');
        setTimeLeft(dayjs.duration(end - now, 'seconds').format('D[d] H[h] m[m] s[s]'));
      } else {
        setAuctionStatus('ended');
        setTimeLeft('Auction ended');
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [data]);

  const handleBidAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setBidAmount(value);
    }
  };

  const handlePlaceBid = () => {
    try {
      const weiValue = parseEther(bidAmount);
      placeBid({
        address: data.contractAddress!,
        abi: [{
          inputs: [],
          name: 'bid',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        }],
        functionName: 'bid',
        value: weiValue,
      });
    } catch (error) {
      enqueueSnackbar('Invalid bid amount. Use correct ETH format (e.g. 0.1)', { variant: 'error' });
    }
  };

  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (loading) return <CircularProgress sx={{ mt: 2 }} />;

  return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>{data.title}</Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" color="primary">{timeLeft}</Typography>
            <Typography variant="body2">Start: {dayjs(data.startTime).format('DD.MM.YYYY HH:mm')}</Typography>
            <Typography variant="body2">End: {dayjs(data.endTime).format('DD.MM.YYYY HH:mm')}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
            <TextField
                label="Bid Amount (ETH)"
                type="number"
                value={bidAmount}
                onChange={(e) => handleBidAmountChange(e.target.value)}
                disabled={isBidding}
                sx={{ flex: 1 }}
                inputProps={{ step: '0.001', min: '0', pattern: '^\\d+(\\.\\d{1,18})?$' }}
            />
            <Button
                variant="contained"
                onClick={handlePlaceBid}
                disabled={!bidAmount || isBidding}
            >
              {isBidding ? <CircularProgress size={24} /> : 'Place Bid'}
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => finalize({
                  address: data.contractAddress!,
                  abi: [{ inputs: [], name: 'finalize', outputs: [], stateMutability: 'nonpayable', type: 'function' }],
                  functionName: 'finalize'
                })}
            >
              Finalize Auction
            </Button>
            <Button
                variant="outlined"
                onClick={() => withdraw({
                  address: data.contractAddress!,
                  abi: [{ inputs: [], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }],
                  functionName: 'withdraw'
                })}
            >
              Withdraw Funds
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <EnglishAuctionBidChart
              bids={bids}
              title={`Bid History (${bids.length} bids)`}
              height={400}
              onPointClick={(bid) => console.log('Selected bid:', bid)}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <EventLogList
              events={events}
              isLoading={loading}
              error={error}
              title="Auction Events"
              height={400}
              onEventClick={(event) => console.log('Selected event:', event)}
          />
        </Paper>
      </Box>
  );
};