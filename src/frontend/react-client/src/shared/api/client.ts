import axios from 'axios';
import { store } from '../../app/store';

export const axiosInstanceAuth = axios.create({
    baseURL: "http://localhost:5289",
});

axiosInstanceAuth.interceptors.request.use((config) => {
    const { jwt } = store.getState().auth;
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});

export const axiosInstanceLot = axios.create({
    baseURL: "http://localhost:5139/api/v1",
});

axiosInstanceLot.interceptors.request.use((config) => {
    const { jwt } = store.getState().auth;
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});