import { baseLotApi } from './baseLotApi';
import {
    CreateAuctionRequest,
    GetAuctionResponse,
    GetUserAuctionsRequest,
    GetUserAuctionsResponse, OpenAuctionRequest,
} from './types';

export const auctionApi = baseLotApi.injectEndpoints({
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
        openAuction: builder.mutation<void, OpenAuctionRequest>({
            query: (body) => ({
                url: '/commands/auction/deploy',
                method: 'POST',
                data: body
            })
        })
    }),
});

export const {
    useGetAuctionQuery,
    useCreateAuctionMutation,
    useGetUserAuctionsQuery,
    useOpenAuctionMutation,
} = auctionApi;