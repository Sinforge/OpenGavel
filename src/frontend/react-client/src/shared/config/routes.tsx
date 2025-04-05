import type { RouteObject } from "react-router-dom";
import {CreateAuctionPage} from "../../pages/create-auction";
import {AuctionPage} from "../../pages/auction";
import {UserAuctionsPage} from "../../pages/user-auctions";

export const routeConfig: RouteObject[] = [
    {
        path: "/auctions/create",
        element: <CreateAuctionPage/>
    },
    {
        path: "/auctions/:id",
        element: <AuctionPage/>
    },
    {
        path: "/auctions/my",
        element: <UserAuctionsPage/>
    }
];