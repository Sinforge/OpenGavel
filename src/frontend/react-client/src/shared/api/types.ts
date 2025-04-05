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

export class BlindAuctionConfiguration implements Deployable {

    constructor(
        private readonly _owner: EthAddress,
        private readonly _itemName: string,
        private readonly _startPrice: string, // BigInt cannot be serialized in JSON, convert in BigInt when deploy contract
        private readonly _endTimestamp: number,
        private readonly _maximumBids: number) {
    }

    public getContractArgs(): any[] {
        return [
            this._owner,
            this._itemName,
            //BigInt(this._startPrice),
            this._endTimestamp,
            this._maximumBids
        ];
    }
}

interface Deployable {
    getContractArgs() : any[];
}

export class EnglishAuctionConfiguration implements Deployable {
    constructor(
        private readonly _owner: EthAddress,
        private readonly _itemName: string,
        private readonly _startPrice: string,
        private readonly _endTimestamp: number,
    ) {}

    public getContractArgs(): any[] {
        return [
            this._owner,
            this._itemName,
            //BigInt(this._startPrice),
            this._endTimestamp,
        ]
    }
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

export type GetAuctionResponse = {
    ownerAddress: EthAddress
    contractAddress?: EthAddress
    title: string
    description: string
    startTime: Date
    endTime: Date,
    type: AuctionType
    //status: AuctionStatus
    configuration: AuctionConfiguration
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
    configuration: AuctionConfiguration
}

export type GetUserAuctionsResponse = {
    auctions: GetUserAuctionsAuctionModel[]
}

export type AuctionConfiguration = BlindAuctionConfiguration | EnglishAuctionConfiguration