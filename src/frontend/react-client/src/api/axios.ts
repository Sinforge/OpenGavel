import axios, {AxiosInstance} from 'axios';

const commonConfig = {
    withCredentials: true,
    timeout: 10000,
};

export const authAxios = axios.create({
    ...commonConfig,
    baseURL: "http://localhost:5000",
});

export const lotAxios = axios.create({
    ...commonConfig,
    baseURL: "http://localhost:5139/api/v1/",
});

export const blockAxios = axios.create({
    ...commonConfig,
    baseURL: "http://localhost:5001/api/v1/",
});


/*
const setupProtectedApi = (instance : AxiosInstance) => {
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                window.location.href = '/login?reason=session_expired';
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

setupProtectedApi(authAxios);
setupProtectedApi(lotAxios);
*/

