import {AuthRequest, AuthResponse} from "./types";
import {baseAuthApi} from "./baseLotApi";

export const authApi = baseAuthApi.injectEndpoints({
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