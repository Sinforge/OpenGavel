import axios from 'axios';
import { store } from '../../app/store';

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5289",
});

axiosInstance.interceptors.request.use((config) => {
    const { jwt } = store.getState().auth;
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});