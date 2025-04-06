import {EthAddress} from "../shared/api/types";

export class BlindAuctionConfiguration implements Deployable {
    private readonly _owner: EthAddress
    private readonly _itemName: string
    private readonly _startPrice: BigInt
    private readonly _endTimestamp: number
    private readonly _maximumBids: number

    constructor(config: any){
        this._owner = config["_owner"]
        this._itemName = config["_itemName"]
        this._startPrice = BigInt(config["_startPrice"])
        this._endTimestamp = config["_endTimestamp"]
        this._maximumBids = config["_maximumBids"]
    }

    public getContractArgs(): any[] {
        return [
            this._owner,
            this._itemName,
            this._startPrice,
            this._endTimestamp,
            this._maximumBids
        ];
    }
}

export interface Deployable {
    getContractArgs() : any[];
}

export class EnglishAuctionConfiguration implements Deployable {
    private readonly _owner: EthAddress
    private readonly _itemName: string
    private readonly _startPrice: BigInt
    private readonly _endTimestamp: number
    constructor(
        config: any
    ) {
        this._owner = config["_owner"];
        this._itemName = config["_itemName"];
        this._startPrice = BigInt(config["_startPrice"]);
        this._endTimestamp = config["_endTimestamp"];
}

    public getContractArgs(): any[] {
        return [
            this._owner,
            this._itemName,
            this._startPrice,
            this._endTimestamp,
        ]
    }
}

export type AuctionConfiguration = BlindAuctionConfiguration | EnglishAuctionConfiguration