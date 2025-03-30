import type {
    CreateBlindAuctionRequest,
    CreateEnglishAuctionRequest, GetBlindAuctionDeployOptionsResponse,
    GetBlindAuctionResponse, GetEnglishAuctionDeployOptionsResponse,
    GetEnglishAuctionResponse, GetUserAuctionsRequest, GetUserAuctionsResponse
} from './types';
import { lotAxios } from './axios';

export const AuctionApi = {
    async createBlindAuction(params: CreateBlindAuctionRequest): Promise<any> {
        const response = await lotAxios.post("commands/Auction/blind", params);

        return response.data;
    },

    async createEnglishAuction(params: CreateEnglishAuctionRequest): Promise<any> {
        const response = await lotAxios.post("commands/Auction/english", params);

        return response.data;
    },

    async getBlindAuction(id: string): Promise<GetBlindAuctionResponse> {
        const response = await lotAxios.get("queries/Auction/blind/" + id);

        return response.data;
    },

    async getEnglishAuction(id: string): Promise<GetEnglishAuctionResponse> {
        const response = await lotAxios.get("queries/Auction/english/" + id);

        return response.data;
    },

    async getBlindAuctionDeployOptions(id: string): Promise<GetBlindAuctionDeployOptionsResponse> {
        const response = await lotAxios.get("queries/Auction/blind/" + id + "/deploy");

        return response.data;
    },

    async getEnglishAuctionDeployOptions(id: string): Promise<GetEnglishAuctionDeployOptionsResponse> {
        const response = await lotAxios.get("queries/Auction/english/" + id + "/deploy");

        return response.data;
    },

    async getUserAuctions(params: GetUserAuctionsRequest): Promise<GetUserAuctionsResponse> {
        const response = await lotAxios.post("queries/Auction/my", params);

        return response.data;
    }
}