import {AuctionType} from "../../../entities/AuctionType";
import {EthAddress} from "../../../shared/api/types";

export type AuctionFormData = {
    auctionType: AuctionType;
    ownerAddress: EthAddress;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    startPrice: string;
    bidAmount?: number;
    bidStep?: number;
};
