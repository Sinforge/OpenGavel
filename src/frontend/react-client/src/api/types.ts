import AuctionType from "../types/AuctionType";
import AuctionStatus from "../types/AuctionStatus";

export type EthAddress = `0x${string}` | undefined;

export type AuthRequest = {
    address: EthAddress
    signature: string
    message: string
}

export type AuthResponse = {
    token: string
}

export type CreateBlindAuctionRequest = {
    ownerAddress: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidAmount: number
}

export type CreateEnglishAuctionRequest = {
    ownerAddress: EthAddress,
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidStep: number
}

export type GetEnglishAuctionResponse = {
    ownerAddress: EthAddress
    contractAddress?: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidStep: number
}

export type GetBlindAuctionResponse = {
    ownerAddress: EthAddress
    contractAddress?: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidAmount: number
}

export type GetEnglishAuctionDeployOptionsResponse = {
    ownerAddress: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidStep: number
}

export type GetBlindAuctionDeployOptionsResponse = {
    ownerAddress: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date
    startPrice: number
    bidAmount: number
}

export type GetUserAuctionsRequest = {
    address: EthAddress
}

export type GetUserAuctionsAuctionModel = {
    id: string;
    contractAddress?: EthAddress;
    title: string;
    status: AuctionStatus;
    type: AuctionType;
}
export type GetUserAuctionsResponse = {
    auctions: GetUserAuctionsAuctionModel[]
}

export type GetAuctionContractResponse = {
    abi: string,
    bytecode: '0x${string}'
}