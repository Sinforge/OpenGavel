import React, { useEffect, useMemo, useState } from 'react';
import { decodeEventLog, Abi } from 'viem';
import { formatUnits } from 'viem/utils';
import { usePublicClient } from 'wagmi';

interface DecodedEventLog {
    eventName: string | undefined;
    args: Record<string, string>;
    transactionHash: string;
    address: string;
    blockNumber: bigint;
    timestamp?: number;
}

interface EventLogListProps {
    contractAddress: `0x${string}`;
    abi: Abi;
    title?: string;
    height?: number;
    onEventClick?: (event: DecodedEventLog) => void;
}

const BLOCK_STEP = BigInt(10000);

const EventLogList: React.FC<EventLogListProps> = ({
                                                       contractAddress,
                                                       abi,
                                                       title = 'Contract Events',
                                                       height = 400,
                                                       onEventClick
                                                   }) => {
    const publicClient = usePublicClient();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentRange, setCurrentRange] = useState<{
        startBlock: bigint;
        endBlock: bigint;
    } | null>(null);

    const eventNames = useMemo(() => {
        return abi.filter(item => item.type === 'event').map(event => event.name);
    }, [abi]);

    useEffect(() => {
        const initializeBlockRange = async () => {
            if (!publicClient) return;

            try {
                const latestBlock = await publicClient.getBlockNumber();
                const startBlock = latestBlock > BLOCK_STEP
                    ? latestBlock - BLOCK_STEP
                    : BigInt(0);

                setCurrentRange({
                    startBlock,
                    endBlock: latestBlock
                });
            } catch (err) {
                setError('Failed to initialize block range');
            }
        };

        initializeBlockRange();
    }, [publicClient]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                if (!publicClient || !contractAddress || !abi || !currentRange) return;

                setIsLoading(true);

                console.log('Fetching logs for blocks:',
                    Number(currentRange.startBlock),
                    '-',
                    Number(currentRange.endBlock));

                const logs = await publicClient.getLogs({
                    address: contractAddress,
                    fromBlock: currentRange.startBlock,
                    toBlock: currentRange.endBlock,
                });

                console.log('Raw logs data:', logs);
                setLogs(logs);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching logs:', err);
                setError(err?.message || 'Failed to fetch logs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, [contractAddress, abi, publicClient, currentRange]);

    const handleNextPage = () => {
        if (!currentRange) return;
        const newStart = currentRange.startBlock - BLOCK_STEP;
        setCurrentRange({
            startBlock: newStart < BigInt(0) ? BigInt(0) : newStart,
            endBlock: currentRange.startBlock
        });
    };

    const handlePrevPage = () => {
        if (!currentRange) return;
        setCurrentRange({
            startBlock: currentRange.endBlock,
            endBlock: currentRange.endBlock + BLOCK_STEP
        });
    };

    const decodedLogs = useMemo(() => {
        return logs
            .map((log): DecodedEventLog | null => {
                try {
                    const { eventName, args } = decodeEventLog({
                        abi,
                        data: log.data,
                        topics: log.topics
                    });

                    if (eventNames === undefined || !eventNames.includes(eventName!)) {
                        console.warn('Skipping unknown event:', eventName);
                        return null;
                    }

                    return {
                        eventName,
                        args: processEventArgs(args),
                        transactionHash: log.transactionHash,
                        address: log.address,
                        blockNumber: log.blockNumber,
                        timestamp: log.timestamp
                    };
                } catch (e) {
                    console.error('Error decoding log:', e);
                    return null;
                }
            })
            .filter((log): log is DecodedEventLog => log !== null);
    }, [logs, abi, eventNames]);

    const processEventArgs = (args: unknown): Record<string, string> => {
        const processed: Record<string, string> = {};

        if (args && typeof args === 'object') {
            for (const [key, value] of Object.entries(args)) {
                try {
                    if (typeof value === 'bigint') {
                        processed[key] = `${formatUnits(value, 18)} ETH`;
                    } else if (typeof value === 'object' && value !== null) {
                        processed[key] = JSON.stringify(value, (_, v) =>
                            typeof v === 'bigint' ? v.toString() : v
                        );
                    } else {
                        processed[key] = String(value);
                    }
                } catch (e) {
                    console.warn(`Error processing argument ${key}:`, e);
                    processed[key] = 'N/A';
                }
            }
        }

        return processed;
    };

    return (
        <div className="event-log-container" style={{ height: `${height}px`, overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-center">{title}</h3>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={!currentRange}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        ← Newer
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={!currentRange || currentRange.startBlock <= BigInt(0)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Older →
                    </button>
                </div>
            </div>

            {currentRange && (
                <div className="text-sm text-gray-600 mb-2 text-center">
                    Blocks: #{currentRange.startBlock.toString()} - #{currentRange.endBlock.toString()}
                </div>
            )}

            {isLoading && <div className="text-center py-4">Loading events...</div>}

            {error && (
                <div className="text-center text-red-500 py-4">
                    {error.includes('filter') ? 'Event filtering not supported by provider' : error}
                </div>
            )}

            {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left border-b">Event</th>
                            <th className="p-2 text-left border-b">Transaction</th>
                            <th className="p-2 text-left border-b">Block</th>
                            <th className="p-2 text-left border-b">Parameters</th>
                        </tr>
                        </thead>

                        <tbody>
                        {decodedLogs.map((log, index) => (
                            <tr
                                key={index}
                                onClick={() => onEventClick?.(log)}
                                className="hover:bg-gray-50 cursor-pointer border-b"
                            >
                                <td className="p-2 font-medium">{log.eventName}</td>
                                <td className="p-2 font-mono">
                                    <a
                                        href={`https://etherscan.io/tx/${log.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {log.transactionHash.substring(0, 6)}...{log.transactionHash.slice(-4)}
                                    </a>
                                </td>
                                <td className="p-2">#{log.blockNumber.toString()}</td>
                                <td className="p-2">
                                    {Object.entries(log.args).map(([key, value]) => (
                                        <div key={key} className="text-sm">
                                            <span className="font-semibold">{key}:</span> {value}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!decodedLogs.length && !isLoading && !error && (
                <div className="text-center text-gray-500 mt-4">
                    No events found in this block range
                </div>
            )}
        </div>
    );
};

export default EventLogList;