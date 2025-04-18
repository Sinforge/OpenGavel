import React, {useCallback, useEffect, useState} from 'react';
import {useWriteContract} from 'wagmi';
import {Alert, Box, Button, CircularProgress, Paper, TextField, Typography, useTheme} from '@mui/material';
import {useSnackbar} from 'notistack';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {formatUnits, parseEther} from 'viem';
import {EthAddress, GetAuctionResponse} from '../../../shared/api/types';
import EnglishAuctionBidChart from '../../../features/get-auction/ui/EnglishAuctionBidChart';
import EventLogList from '../../../features/get-auction/ui/EventLogList';
import {AuctionType} from "../../../entities/AuctionType";
import {AuctionStatus} from "../../../entities/AuctionStatus";

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
  data?: GetAuctionResponse;
}

const defaultData: GetAuctionResponse = {
  title: 'Loading Auction...',
  description: '',
  chainId: 0,
  contractAddress: '0x',
  ownerAddress: '0x',
  type: AuctionType.ENGLISH,
  status: AuctionStatus.CLOSED ,
  configuration: {},
  startTime: new Date(),
  endTime: new Date(),
};

export const EnglishAuctionPage: React.FC<Props> = ({ data = defaultData }) => {
  const theme = useTheme();
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
      setError(null);
      setBids([]);
      setEvents([]);
      setLoading(true);

      if (!data?.chainId || !data?.contractAddress) {
        setError('Auction contract not configured');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/v1/Contract/getLogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainId: data.chainId,
          address: data.contractAddress
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const { result } = await response.json();

      const parsedBids = result.map((log: any) => ({
        bidder: `0x${log.topics[1].slice(-40)}`.toLowerCase(),
        amount: BigInt(log.data),
        blockNumber: BigInt(parseInt(log.blockNumber, 16)),
        timestamp: new Date(parseInt(log.timeStamp, 16) * 1000)
      }));

      const parsedEvents = result.map((log: any) => ({
        eventName: 'NewBid',
        args: {
          bidder: `0x${log.topics[1].slice(-40)}`.toLowerCase(),
          amount: formatUnits(BigInt(log.data), 18)
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
      setBids([]);
      setEvents([]);
      enqueueSnackbar('Error loading auction data', { variant: 'error' });
      setLoading(false);
    }
  }, [enqueueSnackbar, data]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const updateTimer = () => {
      try {
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
      } catch (e) {
        setError('Invalid auction time format');
      }
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(interval);
  }, [data]);

  const handleBidAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) setBidAmount(value);
  };

  const { writeContract: placeBid, isPending: isBidding } = useWriteContract({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('Bid placed successfully!', { variant: 'success' });
        setBidAmount('');
        fetchLogs();
      },
      onError: (error) => enqueueSnackbar(error.message, { variant: 'error' }),
    },
  });

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

  const handlePlaceBid = () => {
    try {
      if (!data.contractAddress) {
        enqueueSnackbar('Auction contract not available', { variant: 'error' });
        return;
      }

      const weiValue = parseEther(bidAmount);
      placeBid({
        address: data.contractAddress,
        abi: [{
          inputs: [],
          name: 'bid',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        }],
        functionName: 'bid',
        value: weiValue,
      });
    } catch (error) {
      enqueueSnackbar('Invalid bid amount format', { variant: 'error' });
    }
  };

  return (
      <Box sx={{
        p: 3,
        maxWidth: 1200,
        mx: 'auto',
        bgcolor: 'background.default',
        minHeight: '100vh'
      }}>
        <Paper sx={{
          p: 3,
          mb: 3,
          border: '2px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[10]
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
            {data.title}
          </Typography>

          {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error} - Event logging features disabled
              </Alert>
          )}

          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: 'secondary.main' }} />
              </Box>
          ) : (
              <>
                <Box sx={{ my: 2 }}>
                  <Typography variant="h6" sx={{ color: 'info.main' }}>
                    {timeLeft}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Start: {dayjs(data.startTime).format('DD.MM.YYYY HH:mm')}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    End: {dayjs(data.endTime).format('DD.MM.YYYY HH:mm')}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 2,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <TextField
                      label="Bid Amount (ETH)"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => handleBidAmountChange(e.target.value)}
                      disabled={isBidding || !data.contractAddress}
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderColor: 'divider',
                          '&:hover fieldset': { borderColor: 'primary.main' }
                        }
                      }}
                      inputProps={{
                        step: '0.001',
                        min: '0',
                        pattern: '^\\d+(\\.\\d{1,18})?$',
                        style: { color: theme.palette.text.primary }
                      }}
                  />

                  <Button
                      variant="contained"
                      onClick={handlePlaceBid}
                      disabled={!bidAmount || isBidding || !data.contractAddress}
                      sx={{
                        bgcolor: 'secondary.main',
                        '&:hover': { bgcolor: 'secondary.dark' },
                        minWidth: 120
                      }}
                  >
                    {isBidding ? (
                        <CircularProgress size={24} sx={{ color: 'common.white' }} />
                    ) : 'Place Bid'}
                  </Button>

                  {data.contractAddress && (
                      <>
                        <Button
                            variant="outlined"
                            onClick={() => finalize({
                              address: data.contractAddress!,
                              abi: [{
                                inputs: [],
                                name: 'finalize',
                                outputs: [],
                                stateMutability: 'nonpayable',
                                type: 'function'
                              }],
                              functionName: 'finalize'
                            })}
                            sx={{
                              borderColor: 'warning.main',
                              color: 'warning.main',
                              '&:hover': { borderColor: 'warning.dark' }
                            }}
                        >
                          Finalize
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => withdraw({
                              address: data.contractAddress!,
                              abi: [{
                                inputs: [],
                                name: 'withdraw',
                                outputs: [],
                                stateMutability: 'nonpayable',
                                type: 'function'
                              }],
                              functionName: 'withdraw'
                            })}
                            sx={{
                              borderColor: 'success.main',
                              color: 'success.main',
                              '&:hover': { borderColor: 'success.dark' }
                            }}
                        >
                          Withdraw
                        </Button>
                      </>
                  )}
                </Box>
              </>
          )}
        </Paper>

        {!error && bids.length > 0 && (
            <Paper sx={{
              p: 3,
              mb: 3,
              border: '2px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <EnglishAuctionBidChart
                  bids={bids}
                  title={`Bid History (${bids.length} bids)`}
                  height={400}
                  onPointClick={(bid) => console.log('Selected bid:', bid)}
                  //theme={theme.palette.mode}
              />
            </Paper>
        )}

        {!error && events.length > 0 && (
            <Paper sx={{
              p: 3,
              border: '2px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper'
            }}>
              <EventLogList
                  events={events}
                  isLoading={loading}
                  error={error}
                  title="Auction Events"
                  height={400}
                  onEventClick={(event) => console.log('Selected event:', event)}
              />
            </Paper>
        )}
      </Box>
  );
};