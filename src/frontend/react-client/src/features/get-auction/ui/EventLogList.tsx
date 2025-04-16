import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Paper,
    Divider,
    useTheme,
    CircularProgress,
    Alert
} from '@mui/material';
import { usePublicClient } from 'wagmi';
import { type Abi } from 'viem';
import {EthAddress} from "../../../shared/api/types";

interface EventLogListProps {
    contractAddress: EthAddress;
    abi: Abi;
    title?: string;
    maxItems?: number;
}

interface DecodedEventLog {
    eventName: string;
    args: Record<string, any>;
    transactionHash: string;
    blockNumber: bigint;
    logIndex: number;
}

const MAX_BLOCK_RANGE = BigInt(10000);
const MAX_REQUESTS = 5;
const POLL_INTERVAL = 15000;

const EventLogList: React.FC<EventLogListProps> = ({
                                                       contractAddress,
                                                       abi,
                                                       title = 'Blockchain Events',
                                                       maxItems = 50
                                                   }) => {
    const theme = useTheme();
    const publicClient = usePublicClient();
    const [logs, setLogs] = useState<DecodedEventLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const stablePublicClient = useMemo(
        () => publicClient,
        [publicClient!.chain?.id]
    );

    const getEventColor = useCallback((eventName: string): string => {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main
        ];

        const hash = Array.from(eventName).reduce(
            (acc, char) => acc + char.charCodeAt(0), 0
        );

        return colors[hash % colors.length];
    }, [theme]);

    const formatEventData = useCallback((args: Record<string, any>): string => {
        return Object.entries(args)
            .filter(([key]) => key !== '__length__')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }, []);

    const fetchLogsInRange = useCallback(async (fromBlock: bigint, toBlock: bigint) => {
        try {
            if (!stablePublicClient || !contractAddress || !abi) return [];

            return await stablePublicClient.getContractEvents({
                address: contractAddress!,
                abi,
                fromBlock,
                toBlock,
            });
        } catch (error) {
            console.error(`Error fetching blocks ${fromBlock}-${toBlock}:`, error);
            return [];
        }
    }, [stablePublicClient, contractAddress, abi]);

    const fetchAllLogs = useCallback(async () => {
        if (!contractAddress || !abi || !stablePublicClient) return;

        setLoading(true);

        try {
            const currentBlock = await stablePublicClient.getBlockNumber();
            let toBlock = currentBlock;
            let requests = 0;
            const allLogs = [];

            while (requests++ < MAX_REQUESTS && toBlock > BigInt(0)) {
                const fromBlock = toBlock - MAX_BLOCK_RANGE > BigInt(0)
                    ? toBlock - MAX_BLOCK_RANGE
                    : BigInt(0);

                const logs = await fetchLogsInRange(fromBlock, toBlock);
                allLogs.push(...logs);

                if (fromBlock === BigInt(0)) break;
                toBlock = fromBlock - BigInt(1);
            }

            const newLogs = allLogs
                .filter(newLog =>
                    !logs.some(existingLog =>
                        existingLog.transactionHash === newLog.transactionHash &&
                        existingLog.logIndex === newLog.logIndex
                    )
                )
                .map(log => ({
                    eventName: log.eventName || 'UnknownEvent',
                    args: log.args || {},
                    transactionHash: log.transactionHash,
                    blockNumber: log.blockNumber || BigInt(0),
                    logIndex: Number(log.logIndex)
                }));

            setLogs(prev => {
                const merged = [...newLogs, ...prev]
                    .filter((log, index, self) =>
                            index === self.findIndex(l =>
                                l.transactionHash === log.transactionHash &&
                                l.logIndex === log.logIndex
                            )
                    )
                    .slice(0, maxItems);

                return merged.length === prev.length &&
                merged.every((log, i) => log.transactionHash === prev[i]?.transactionHash)
                    ? prev
                    : merged;
            });

        } catch (err) {
            console.error('Error fetching logs:', err);
            setError('Failed to load event logs');
        } finally {
            setLoading(false);
        }
    }, [stablePublicClient, contractAddress, abi, maxItems, logs, fetchLogsInRange]);

    useEffect(() => {
        if (!contractAddress || !abi) return;

        const controller = new AbortController();
        let timeoutId: NodeJS.Timeout;

        const pollData = async () => {
            try {
                await fetchAllLogs();
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error('Polling error:', err);
                }
            } finally {
                if (!controller.signal.aborted) {
                    timeoutId = setTimeout(pollData, POLL_INTERVAL);
                }
            }
        };

        pollData();

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [fetchAllLogs, contractAddress, abi]);

    const memoizedLogs = useMemo(() => logs, [
        logs.length,
        JSON.stringify(logs.map(log => `${log.transactionHash}-${log.logIndex}`))
    ]);

    if (!contractAddress || !abi) {
        return <Alert severity="warning">Contract address and ABI are required</Alert>;
    }

    if (loading) return <CircularProgress sx={{ mt: 4 }} />;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <Paper sx={{ p: 2, mt: 3, maxHeight: 600, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                {title} ({memoizedLogs.length})
            </Typography>
            <List dense={true}>
                {memoizedLogs.map((log) => (
                    <React.Fragment key={`${log.transactionHash}-${log.logIndex}`}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{
                                    bgcolor: getEventColor(log.eventName),
                                    width: 32,
                                    height: 32
                                }}>
                                    {log.eventName[0]}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        color="text.primary"
                                        sx={{ fontFamily: 'monospace' }}
                                    >
                                        {log.eventName}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            display="block"
                                            color="text.primary"
                                            sx={{ wordBreak: 'break-word' }}
                                        >
                                            {formatEventData(log.args)}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            display="block"
                                            color="text.secondary"
                                            sx={{ mt: 0.5 }}
                                        >
                                            Block: #{log.blockNumber.toString()}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default React.memo(EventLogList);