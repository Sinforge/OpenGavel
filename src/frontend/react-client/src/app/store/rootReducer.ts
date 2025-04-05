import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '../../features/auth';
import { baseApi } from "../../shared/api/baseApi";

export const rootReducer = combineReducers({
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});