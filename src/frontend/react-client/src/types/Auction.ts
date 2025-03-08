import { Bid } from "./Bid";

export interface AuctionBase {
    id: string;
    owner: string;
    type: 'blind' | 'english' | 'dutch';
    startTime: Date;
    endTime: Date;
    status: 'active' | 'completed' | 'canceled';
  }
  
  export interface BlindAuction extends AuctionBase {
    bids: Bid[];
    revealPeriod: number;
  }
  
  export interface EnglishAuction extends AuctionBase {
    currentBid: number;
    bidHistory: Bid[];
  }
  
  export interface DutchAuction extends AuctionBase {
    currentPrice: number;
    priceDecreaseRate: number;
  }