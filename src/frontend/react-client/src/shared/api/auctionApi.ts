import { baseLotApi } from './baseLotApi';
import {
    CreateAuctionRequest,
    GetAuctionResponse, GetAuctionsRequest, GetAuctionsResponse,
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
            query: (body) => ({ url: '/commands/auction/create', method: 'POST', data: body }),
            invalidatesTags: [{ type: 'Auctions', id: 'LIST' }],
        }),
        getUserAuctions: builder.query<GetUserAuctionsResponse, GetUserAuctionsRequest>({
            query: (params) => ({ url: '/queries/auction/my', method: 'POST', data: params }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.auctions.map(a => ({ type: 'Auctions' as const, id: a.id })),
                        { type: 'Auctions', id: 'LIST' }
                    ]
                    : [{ type: 'Auctions', id: 'LIST' }],
        }),
        openAuction: builder.mutation<void, OpenAuctionRequest>({
            query: (body) => ({ url: '/commands/auction/deploy', method: 'POST', data: body }),
            invalidatesTags: [{ type: 'Auctions', id: 'LIST' }],
        }),
        getAuctions: builder.query<GetAuctionsResponse, GetAuctionsRequest>({
            query: (body) => ({
                url: '/queries/auction',
                method: 'POST',
                data: body,
            }),
        }),
    }),
});

export const {
    useGetAuctionQuery,
    useCreateAuctionMutation,
    useGetUserAuctionsQuery,
    useOpenAuctionMutation,
    useGetAuctionsQuery,
    useLazyGetAuctionsQuery
} = auctionApi;