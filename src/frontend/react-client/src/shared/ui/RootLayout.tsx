import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';

export const RootLayout = () => {
    return (
        <>
            <Header />
            <Box
                component="main"
                sx={{
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    minHeight: '100vh',
                    p: { xs: 2, md: 4 }
                }}
            >
                <Outlet />
            </Box>
        </>
    );
};
