import type { RouteObject } from "react-router-dom";
import {CreateAuctionPage} from "../../pages/create-auction";
import {AuctionPage} from "../../pages/auction";
import {UserAuctionsPage} from "../../pages/user-auctions";
import {ConnectWalletPage} from "../../pages/connect-wallet/ui/ConnectWalletPage";
import {AuthPage} from "../../pages/authorize/ui/AuthPage";

export const generalRoutes: RouteObject[] = [
    {
        path: "/auctions/create",
        element: <CreateAuctionPage/>
    },
    {
        path: "/auctions/my",
        element: <UserAuctionsPage/>
    },
    {
        path: "/connect",
        element: <ConnectWalletPage/>
    },
    {
        path: "/auth",
        element: <AuthPage/>
    }
]

export const uniqueRoutes: RouteObject[] = [
    {
        path: "/auctions/:id",
        element: <AuctionPage/>
    }
]

export const routeConfig: RouteObject[] = generalRoutes.concat(uniqueRoutes);