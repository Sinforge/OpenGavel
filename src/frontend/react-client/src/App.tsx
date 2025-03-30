import ConnectButton from "./components/ConnectButton";
import BlindAuctionPage from "./pages/BlindAuctionPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import {Routes, Route} from 'react-router-dom';
import EnglishAuctionPage from "./pages/EnglishAuctionPage";
import UserAuctionsPage from "./pages/UserAuctionsPage";
import {AppHeader} from "./components/AppHeader";

function App() {
    return (
        <>
            <AppHeader/>
            <Routes>
                <Route path="/" element={<CreateAuctionPage/>}/>
                <Route path="/auctions/blind/:id" element={<BlindAuctionPage/>}/>
                <Route path="/auctions/english/:id" element={<EnglishAuctionPage/>}/>
                <Route path="/auctions/my" element={<UserAuctionsPage/>}/>
                <Route path="/auth" element={<ConnectButton/>}/>
            </Routes>
        </>
    );
}

export default App