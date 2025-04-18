import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    CircularProgress,
    Stack, Avatar, FormControlLabel, Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLazyGetAuctionsQuery} from "../../../shared/api/auctionApi";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import {useNavigate} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {AuctionType} from "../../../entities/AuctionType";
import {chains} from "../../../app/providers/WagmiProvider";

const AuctionListPage = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        name: null,
        type: null,
        chainId: null,
        startDate: null,
        endDate: null,
        includeClosed: false
    });
    const navigate = useNavigate();
    const [trigger, { data, isLoading, isFetching }] = useLazyGetAuctionsQuery();

    useEffect(() => {
        const { page, limit, ...restFilters } = filters;
        trigger({
            offset: (page - 1) * limit,
            limit,
            ...restFilters
        });
    }, [filters, trigger]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleRowClick = (id: string) => {
        navigate(`/auctions/${id}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Auctions
            </Typography>

            {/* Фильтры */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={2} sx={{ mb: 3 }}>
                <TextField
                    variant="outlined"
                    placeholder="Search auctions..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    sx={{ maxWidth: 400 }}
                />

                <Stack direction="row" spacing={2}>
                    <FormControl sx={{ minWidth: 180 }}>
                        <InputLabel>Auction Type</InputLabel>
                        <Select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            label="Auction Type"
                        >
                            <MenuItem value={null!}>All</MenuItem>
                            {Object.values(AuctionType).map(key => <MenuItem value={key}>{AuctionType[key]}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Chain</InputLabel>
                        <Select
                            value={filters.chainId}
                            onChange={(e) => handleFilterChange('chainId', e.target.value)}
                            label="Chain"
                        >
                            <MenuItem value={null!}>All</MenuItem>
                            {chains.map(chain => <MenuItem value={chain.id}>{chain.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {/* Добавляем DatePicker */}
                    <Stack direction="row" spacing={2}>
                        <DateTimePicker
                            label="Start Date"
                            value={filters.startDate}
                            onChange={(date) => handleFilterChange('startDate', date)}
                            sx={{ width: 200 }}
                        />
                        <DateTimePicker
                            label="End Date"
                            value={filters.endDate}
                            onChange={(date) => handleFilterChange('endDate', date)}
                            sx={{ width: 200 }}
                        />
                    </Stack>

                    {/* Добавляем Switch для включения закрытых аукционов */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filters.includeClosed}
                                onChange={(e: any) => handleFilterChange('includeClosed', e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Include closed auctions"
                    />
                </Stack>
            </Stack>
            </LocalizationProvider>


            {/* Таблица */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Chain</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Owner</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.items.map((auction: any) => (
                                <TableRow
                                    key={auction.id}
                                    hover
                                    onClick={() => handleRowClick(auction.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <Typography fontWeight="500">{auction.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {auction.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={auction.type}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar
                                                //src={CHAIN_ICONS[auction.chainId.toString()]}
                                                sx={{ width: 24, height: 24 }}
                                            />
                                            {CHAINS.find(c => c.id === auction.chainId)?.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={auction.isClosed ? 'Closed' : 'Active'}
                                            color={auction.isClosed ? 'default' : 'success'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontFamily: 'monospace' }}
                                        >
                                            {shortenAddress(auction.ownerAddress)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Пагинация */}
            {data && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={Math.ceil(data.totalCount / filters.limit)}
                        page={filters.page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                        disabled={isFetching}
                    />
                </Box>
            )}
        </Box>
    );
};

// Вспомогательные константы
const CHAINS = [
    { id: 1, name: 'Ethereum' },
    { id: 56, name: 'BNB Chain' },
    { id: 137, name: 'Polygon' }
];

const CHAIN_ICONS = {
    1: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    56: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    137: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
};

const shortenAddress = (address: string) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

export default AuctionListPage;