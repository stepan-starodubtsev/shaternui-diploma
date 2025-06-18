import axios from "axios";
import {BASE_URL} from "./constants.js"

const apiClient = axios.create({
    baseURL: BASE_URL,
});

let _getAuthTokenFunction = () => null;
let _logoutUserFunction = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
};

export const configureApiClientAuth = ({getToken, logout}) => {
    _getAuthTokenFunction = getToken;
    _logoutUserFunction = logout;
};

apiClient.interceptors.request.use(
    (config) => {
        const token = _getAuthTokenFunction();
        if (token && token !== "undefined") {
            config.headers["Authorization"] = `Bearer ${token}`;
        } else {
            delete config.headers["Authorization"];
        }
        return config;
    },
    (error) => {
        console.error('Request error in apiClient interceptor:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            originalRequest &&
            originalRequest.url &&
            (!originalRequest.url.endsWith('/auth/login') ||
                !originalRequest.url.endsWith('/auth/me'))
        ) {
            console.warn('API Client: Received 401 Unauthorized. Logging out user.');
            _logoutUserFunction();
        }
        return Promise.reject(error);
    }
);

export default apiClient;