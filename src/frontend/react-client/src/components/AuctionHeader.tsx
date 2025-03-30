import {Box, Typography, Chip, Link} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import {EthAddress} from "../api/types";

interface Props {
    title: string;
    owner: EthAddress;
    type: string;
}

export default function AuctionHeader({title, owner, type}: Props) {
    return (
        <Box sx={{mb: 3}}>
            <Link component={RouterLink} to="/auctions" sx={{mb: 2, display: 'block'}}>
                ← Back to auction
            </Link>

            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                <Typography variant="h4">{title}</Typography>
                <Chip label={type} color="primary" variant="outlined"/>
            </Box>

            <Typography variant="body1" sx={{mt: 1}}>
                Owner: <strong>{owner}</strong>
            </Typography>
        </Box>
    );
}