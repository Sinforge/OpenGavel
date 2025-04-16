import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../../features/auth';
import {baseAuthApi, baseLotApi} from "../../shared/api/baseLotApi";

export const rootReducer = combineReducers({
    auth: authReducer,
    [baseLotApi.reducerPath]: baseLotApi.reducer,
    [baseAuthApi.reducerPath]: baseAuthApi.reducer,
});