import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import { WagmiWrapper } from './providers/WagmiProvider';
import { router } from '../pages/Router';
import { SnackbarProvider, useSnackbar } from 'notistack';
import {ThemeWrapper} from "../shared/theme/ThemeWrapper";

export const App = () =>  {
    const { enqueueSnackbar } = useSnackbar();
    enqueueSnackbar('Wallet connected successfully', { variant: 'success' });

    return (
        <ThemeWrapper>
            <SnackbarProvider maxSnack={3}>
                <StoreProvider>
                    <WagmiWrapper>
                        <RouterProvider router={router}>
                        </RouterProvider>
                    </WagmiWrapper>
                </StoreProvider>
            </SnackbarProvider>
        </ThemeWrapper>
    );
}