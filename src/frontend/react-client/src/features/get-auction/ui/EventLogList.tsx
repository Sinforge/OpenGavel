import React from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Link,
    Box
} from '@mui/material';
import {EthAddress} from "../../../shared/api/types";

interface DecodedEventLog {
    eventName: string;
    args: Record<string, string>;
    transactionHash: string;
    address: EthAddress;
    blockNumber: bigint;
    timestamp: Date;
}

interface EventLogListProps {
    events: DecodedEventLog[];
    title?: string;
    height?: number;
    isLoading?: boolean;
    error?: string | null;
    onEventClick?: (event: DecodedEventLog) => void;
}

const EventLogList: React.FC<EventLogListProps> = ({
                                                       events,
                                                       title = 'Contract Events',
                                                       height = 400,
                                                       isLoading = false,
                                                       error = null,
                                                       onEventClick
                                                   }) => {
    return (
        <Box sx={{ maxHeight: height, overflowY: 'auto' }}>
            <Typography variant="h6" align="center" gutterBottom>
                {title}
            </Typography>

            {isLoading && (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error.includes('filter') ? 'Event filtering not supported by provider' : error}
                </Alert>
            )}

            {!isLoading && !error && (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Event</TableCell>
                                <TableCell>Transaction</TableCell>
                                <TableCell>Block</TableCell>
                                <TableCell>Parameters</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.map((log, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    onClick={() => onEventClick?.(log)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell>{log.eventName}</TableCell>
                                    <TableCell>
                                        <Link
                                            href={`https://etherscan.io/tx/${log.transactionHash}`}
                                            target="_blank"
                                            rel="noopener"
                                            underline="hover"
                                        >
                                            {log.transactionHash.slice(0, 6)}...{log.transactionHash.slice(-4)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>#{log.blockNumber.toString()}</TableCell>
                                    <TableCell>
                                        {Object.entries(log.args).map(([key, value]) => (
                                            <Box key={key} sx={{ fontSize: 13 }}>
                                                <strong>{key}:{value as any}</strong>
                                            </Box>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {!events.length && !isLoading && !error && (
                <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 2 }}>
                    No events found
                </Typography>
            )}
        </Box>
    );
};

export default EventLogList;