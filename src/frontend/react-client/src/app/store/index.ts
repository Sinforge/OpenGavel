import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { rootReducer } from './rootReducer';
import { baseApi } from "../../shared/api/baseApi";
import { auctionApi } from "../../shared/api/auctionApi";
import {authApi} from "../../shared/api/authApi";
import {
    useDispatch as useReduxDispatch,
    useSelector as useReduxSelector,
    type TypedUseSelectorHook
} from 'react-redux'

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(baseApi.middleware)
            .concat(auctionApi.middleware)
            .concat(authApi.middleware)
});


export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useAppDispatch = () => useReduxDispatch<AppDispatch>()

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;