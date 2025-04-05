import {axiosInstance} from "./client";
import {createApi} from "@reduxjs/toolkit/query/react";

interface AxiosBaseQueryArgs {
    baseUrl?: string;
}

interface AxiosQueryArgs {
    url: string;
    method: string;
    data?: any;
    params?: any;
    headers?: any;
}

const axiosBaseQuery = ({ baseUrl = '' }: AxiosBaseQueryArgs = {}) =>
    async ({ url, method, data, params, headers }: AxiosQueryArgs) => {
        try {
            const result = await axiosInstance({
                url: baseUrl + url,
                method,
                data,
                params,
                headers,
            });
            return { data: result.data };
        } catch (axiosError: any) {
            const err = axiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    endpoints: () => ({}),
    tagTypes: ['Auctions'],
});