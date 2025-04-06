import { AppBar, Toolbar, Button, Box} from '@mui/material';
import {Link, RouteObject} from 'react-router-dom';
import {generalRoutes} from "../config/routes";

export const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {generalRoutes.map((route : RouteObject) =>
                        <Button
                            color="inherit"
                            key={route.id}
                            component={Link}
                            to={route.path!}>
                            {route.path}
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};