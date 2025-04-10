import { Outlet } from 'react-router-dom';
import {Header} from "./Header";

export const RootLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};