import {axiosInstanceAuth, axiosInstanceLot} from "./client";
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

const axiosBaseQueryAuth = ({ baseUrl = '' }: AxiosBaseQueryArgs = {}) =>
    async ({ url, method, data, params, headers }: AxiosQueryArgs) => {
        try {
            const result = await axiosInstanceAuth({
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

const axiosBaseQueryLot = ({ baseUrl = '' }: AxiosBaseQueryArgs = {}) =>
    async ({ url, method, data, params, headers }: AxiosQueryArgs) => {
        try {
            const result = await axiosInstanceLot({
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

export const baseLotApi = createApi({
    reducerPath: 'api/lot',
    baseQuery: axiosBaseQueryLot(),
    endpoints: () => ({}),
    tagTypes: ['Auctions'],
});

export const baseAuthApi = createApi({
    reducerPath: 'api/auth',
    baseQuery: axiosBaseQueryAuth(),
    endpoints: () => ({}),
    tagTypes: ['Auctions'],
});