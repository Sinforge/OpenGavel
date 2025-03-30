import type {
    GetAuctionContractResponse
} from './types';
import { blockAxios } from './axios';

export const BlockchainApi = {

    async getEnglishAuctionContract(): Promise<GetAuctionContractResponse> {
        const response = await blockAxios.get("contract/english");

        return response.data;
    },

    async getBlindAuctionContract(): Promise<GetAuctionContractResponse> {
        const response = await blockAxios.get("contract/blind");

        return response.data;
    }
}