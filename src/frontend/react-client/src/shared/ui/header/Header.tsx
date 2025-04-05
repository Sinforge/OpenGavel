import { AppBar, Toolbar, Button, Select, MenuItem, Box, SelectChangeEvent } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/auctions/my"
                    >
                        My Auctions
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/auth"
                    >
                        Authorize
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};