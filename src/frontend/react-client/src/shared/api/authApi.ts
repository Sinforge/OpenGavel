import {baseApi} from "./baseApi";
import {AuthRequest, AuthResponse} from "./types";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        authorize: builder.mutation<AuthResponse, AuthRequest>({
            query: (body) => ({
                url: `/auth`,
                method: 'POST',
                data: body
            }),
        })
    }),
})

export const { useAuthorizeMutation} = authApi