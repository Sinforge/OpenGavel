import {AuctionType} from "../../entities/AuctionType";
import {AuctionStatus} from "../../entities/AuctionStatus";

export type EthAddress = `0x${string}` | undefined;

export type AuthRequest = {
    address: EthAddress
    signature: string
    message: string
}

export type AuthResponse = {
    token: string
}

export type CreateAuctionRequest = {
    ownerAddress: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    type: AuctionType
    configuration: AuctionConfiguration
}

export type BlindAuctionConfiguration = {
    _owner: EthAddress
    _itemName: string
    _startPrice: string
    _endTimestamp: number
    _maximumBids: number
}


export type EnglishAuctionConfiguration = {
    _owner: EthAddress
    _itemName: string
    _startPrice: string
    _endTimestamp: number
}

export type AuctionConfiguration = BlindAuctionConfiguration | EnglishAuctionConfiguration

export type GetAuctionResponse = {
    ownerAddress: EthAddress
    contractAddress?: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date,
    type: AuctionType
    status: AuctionStatus
    configuration: any
}

export type GetUserAuctionsRequest = {
    address: EthAddress
}

export type GetUserAuctionsAuctionModel = {
    id: string;
    contractAddress?: EthAddress;
    title: string
    description: string
    startTime: Date
    endTime: Date
    type: AuctionType
    status: AuctionStatus
    configuration: any
}

export type GetUserAuctionsResponse = {
    auctions: GetUserAuctionsAuctionModel[]
}

export type OpenAuctionRequest = {
    id: string
    chainId: number
    contractAddress: EthAddress
}

