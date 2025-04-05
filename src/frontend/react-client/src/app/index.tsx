import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from './providers/StoreProvider';
import { WagmiWrapper } from './providers/WagmiProvider';
import { router } from '../pages/Router';
import {Header} from "../shared/ui/header/Header";


export const App = () =>  {
    console.log("in app")
    return (
        <StoreProvider>
            <WagmiWrapper>
                <RouterProvider router={router}>
                    <Header />
                </RouterProvider>
            </WagmiWrapper>
        </StoreProvider>
    );
}