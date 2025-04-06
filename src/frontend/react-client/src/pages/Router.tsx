import { createBrowserRouter } from "react-router-dom";
import { routeConfig } from "../shared/config/routes";
import {RootLayout} from "../shared/ui/RootLayout";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: routeConfig
    }
]);