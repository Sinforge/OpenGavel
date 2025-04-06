import { baseApi } from './baseApi';
import {
    CreateAuctionRequest,
    GetAuctionResponse,
    GetUserAuctionsRequest,
    GetUserAuctionsResponse,
} from './types';

export const auctionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAuction: builder.query<GetAuctionResponse, string>({
            query: (auctionId) => ({
                url: `/queries/auction/${auctionId}`,
                method: 'GET',
            }),
        }),
        createAuction: builder.mutation<void, CreateAuctionRequest>({
            query: (body) => ({
                url: '/commands/auction/create',
                method: 'POST',
                data: body,
            }),
        }),
        getUserAuctions: builder.query<GetUserAuctionsResponse, GetUserAuctionsRequest>({
            query: (params) => ({
                url: '/queries/auction/my',
                method: 'POST',
                data: params,
            }),
        }),
    }),
});

export const {
    useGetAuctionQuery,
    useCreateAuctionMutation,
    useGetUserAuctionsQuery,
} = auctionApi;