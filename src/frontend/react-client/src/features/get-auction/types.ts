import {EthAddress} from "../../shared/api/types";

interface DecodedEventLog {
    eventName: string;
    args: Record<string, string>;
    transactionHash: string;
    address: EthAddress;
    blockNumber: bigint;
    timestamp: Date;
}