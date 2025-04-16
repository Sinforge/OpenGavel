import React, { useCallback, useEffect, useState} from 'react';
import {
  useWriteContract,
  useAccount,
  usePublicClient
} from 'wagmi';
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
import { parseEther, decodeEventLog } from 'viem';
import type { Abi } from 'viem';
import { EthAddress, GetAuctionResponse } from "../../../shared/api/types";
import EnglishAuctionBidChart from "../../../features/get-auction/ui/EnglishAuctionBidChart";
import EventLogList from "../../../features/get-auction/ui/EventLogList";

dayjs.extend(duration);

interface Bid {
  amount: bigint;
  bidder: EthAddress;
  blockNumber: bigint;
}

interface ContractData {
  abi: Abi;
}

interface Props {
  data: GetAuctionResponse;
}

export const EnglishAuctionPage: React.FC<Props> = ({ data }) => {
  const { enqueueSnackbar } = useSnackbar();
  const publicClient = usePublicClient();

  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auctionStatus, setAuctionStatus] = useState<'pending' | 'active' | 'ended'>('pending');
  const [timeLeft, setTimeLeft] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [progress, setProgress] = useState(0);

  const { writeContract: placeBid, isPending: isBidding } = useWriteContract({
    mutation: {
      onSuccess: () => {
        enqueueSnackbar('Bid placed successfully!', { variant: 'success' });
        setBidAmount('');
      },
      onError: (error) => {
        enqueueSnackbar(error.message, { variant: 'error' });
      },
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

  useEffect(() => {
    const loadContractData = async () => {
      try {
        const response = await fetch('/contracts/auction.english.json');
        const data: ContractData = await response.json();
        setContractData(data);
      } catch (err) {
        setError('Failed to load contract ABI');
        enqueueSnackbar('Error loading contract ABI', { variant: 'error' });
      }
    };
    loadContractData();
  }, [enqueueSnackbar]);

  const fetchBids = useCallback(async () => {
    if (!contractData?.abi || !publicClient || !data.contractAddress) return [];

    try {
      const currentBlock = await publicClient.getBlockNumber();
      let fromBlock = currentBlock - BigInt(10000);
      if (fromBlock < BigInt(0)) fromBlock = BigInt(0);

      const MAX_REQUESTS = 5;
      let requestCount = 0;
      const allLogs = [];

      while (fromBlock <= currentBlock && requestCount++ < MAX_REQUESTS) {
        const toBlock = fromBlock + BigInt(10000) > currentBlock
            ? currentBlock
            : fromBlock + BigInt(10000);

        try {
          const logs = await publicClient.getContractEvents({
            address: data.contractAddress,
            abi: contractData.abi,
            eventName: 'NewBid',
            fromBlock: fromBlock,
            toBlock: toBlock,
            strict: true
          });

          allLogs.push(...logs);
          setProgress(Math.floor((requestCount / MAX_REQUESTS) * 100));

        } catch (error) {
          console.error(`Error fetching blocks ${fromBlock}-${toBlock}:`, error);
        } finally {
          fromBlock = toBlock + BigInt(1);
        }
      }

      const validBids = allLogs
          .sort((a, b) => Number(a.blockNumber - b.blockNumber))
          .map(log => {
            try {
              const decoded = decodeEventLog({
                abi: contractData.abi,
                data: log.data,
                topics: log.topics,
                eventName: 'NewBid'
              });

              if (!decoded.args || !('bidder' in decoded.args) || !('amount' in decoded.args)) {
                return null;
              }

              return {
                bidder: decoded.args.bidder as EthAddress,
                amount: BigInt(decoded.args.amount as string),
                blockNumber: BigInt(log.blockNumber || 0)
              };
            } catch (e) {
              console.error('Error decoding log:', e);
              return null;
            }
          })
          .filter(Boolean) as Bid[];

      return validBids;

    } catch (error) {
      console.error('Error fetching bids:', error);
      enqueueSnackbar('Error loading bids', { variant: 'error' });
      return [];
    }
  }, [contractData?.abi, data.contractAddress, publicClient, enqueueSnackbar]);

  useEffect(() => {
    const init = async () => {
      if (!publicClient) {
        setError('Blockchain provider not available');
        setLoading(false);
        return;
      }

      try {
        const loadedBids = await fetchBids();
        setBids(loadedBids);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to load bids');
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    if (contractData) {
      init();
    }
  }, [contractData, fetchBids, publicClient]);

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
        abi: contractData?.abi || [],
        functionName: 'bid',
        value: weiValue,
      });
    } catch (error) {
      enqueueSnackbar('Invalid bid amount. Use correct ETH format (e.g. 0.1)', { variant: 'error' });
    }
  };

  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

  return (
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {data.title}
          </Typography>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" color="primary">
              {timeLeft}
            </Typography>
            <Typography variant="body2">
              Start: {dayjs(data.startTime).format('DD.MM.YYYY HH:mm')}
            </Typography>
            <Typography variant="body2">
              End: {dayjs(data.endTime).format('DD.MM.YYYY HH:mm')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
            {auctionStatus === 'active' && (
                <>
                  <TextField
                      label="Bid Amount (ETH)"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => handleBidAmountChange(e.target.value)}
                      disabled={isBidding}
                      sx={{ flex: 1 }}
                      inputProps={{
                        step: "0.001",
                        min: "0",
                        pattern: "^\\d+(\\.\\d{1,18})?$"
                      }}
                  />
                  <Button
                      variant="contained"
                      onClick={handlePlaceBid}
                      disabled={!bidAmount || isBidding || !contractData}
                  >
                    {isBidding ? <CircularProgress size={24} /> : 'Place Bid'}
                  </Button>
                </>
            )}

            <Button
                variant="contained"
                color="secondary"
                onClick={() => finalize({
                  address: data.contractAddress!,
                  abi: contractData?.abi || [],
                  functionName: 'finalize',
                })}
                disabled={auctionStatus !== 'ended' || !contractData}
            >
              Finalize Auction
            </Button>

            <Button
                variant="outlined"
                onClick={() => withdraw({
                  address: data.contractAddress!,
                  abi: contractData?.abi || [],
                  functionName: 'withdraw',
                })}
                disabled={!contractData}
            >
              Withdraw Funds
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <EnglishAuctionBidChart
              bids={bids}
              title={`Bid History (${bids.length} bids)`}
              height={400}
              onPointClick={(bid) => {
                // Обработка клика по точке графика
                console.log('Selected bid:', bid);
              }}
          />
        </Paper>

        <Paper sx={{ p: 3 }}>
          <EventLogList
              contractAddress={data.contractAddress!}
              abi={contractData?.abi!}
              title="Auction Events"
              maxItems={100}
          />
        </Paper>
      </Box>
  );
};