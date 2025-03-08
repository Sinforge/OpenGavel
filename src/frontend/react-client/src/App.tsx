import ConnectButton from "./components/ConnectButton";
import BlindAuctionPage from "./pages/BlindAuctionPage";
import CreateAuctionPage from "./pages/CreateAuctionPage";
import { Routes, Route } from 'react-router-dom';
import EnglishAuctionPage from "./pages/EnglishAuctionPage";
import DutchAuctionPage from "./pages/DutchAuctionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreateAuctionPage />} />
      <Route path="/auctions/blind/:id" element={<BlindAuctionPage/>}/>
      <Route path="/auctions/english/:id" element={<EnglishAuctionPage/>} />
      <Route path="/auctions/dutch/:id" element={<DutchAuctionPage/>}/>
    </Routes>
  );
  return (
      <div>
        <h1>MetaMask Auth</h1>
        <ConnectButton/>
      </div>
  )
}

export default App