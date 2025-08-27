import axios, { AxiosInstance } from 'axios';
import { store } from '../redux/Store';
import { getCurrentDateTime, getFullUrl } from '../utils/helperFunctions';
import { endpoints } from './endpoints';
import { apiRefreshToken } from './requests/authRequests';

export const baseUrl = 'http://192.168.0.59:3000';

export const axiosClient:AxiosInstance = axios.create({
  baseURL: baseUrl,
  // headers : {'Content-Type' : 'application/json'}
});

axiosClient.defaults.headers.common['Content-Type'] = 'application/json';

// Only log if DEBUG_MODE is enabled (replace with __DEV__ in React Native if needed)
const isDebug = __DEV__; // fallback to __DEV__ for React Native

axiosClient.interceptors.request.use(
  config => {
    const accessToken = store.getState().token.accessToken;
    console.log("🚀 ~ accessToken:", accessToken)
    const refreshToken = store.getState().token.refreshToken;
    console.log("🚀 ~ refreshToken:", refreshToken)

    if (config.url === endpoints.refresh_token) {
      config.headers.Authorization = `Bearer ${refreshToken}`;
    } else if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (isDebug) {
      console.log(
        `📡 [API CALL] ${config.method?.toUpperCase()} ${getCurrentDateTime()} ${getFullUrl(
          config,
        )}`,
        config.headers,
        config.data || '',
      );
    }
    return config;
  },
  error => {
    if (isDebug) {
      console.log('❌ [REQUEST ERROR] ${getCurrentDateTime()} ', error);
    }
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  response => {
    if (isDebug) {
      const endTime = new Date();
      const startTime = response.config.metadata?.startTime;
      const duration = startTime
        ? `${endTime.getTime() - startTime.getTime()}ms`
        : 'N/A';
      console.log(
        `✅ [API RESPONSE] ${response.config.method?.toUpperCase()} ${getCurrentDateTime()} ${
          response.config.url
        } (${duration})`,
        response,
      );
    }
    return response;
  },

  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== endpoints.refresh_token
    ) {
      originalRequest._retry = true;

      const newAccessToken = await apiRefreshToken();
      console.log("🚀 ~ newAccessToken:", newAccessToken)

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      }
    }
    if (isDebug) {
      const endTime = new Date();
      const startTime = error.config?.metadata?.startTime;
      const duration = startTime
        ? `${endTime.getTime() - startTime.getTime()}ms`
        : 'N/A';

      if (error.response) {
        console.log(
          `🚫 [API ERROR RESPONSE] ${error.config.method?.toUpperCase()} ${getCurrentDateTime()} ${
            error.config.url
          } (${duration})`,
          error.response.data,
        );
      } else if (error.request) {
        console.log(`⚠️ [NO RESPONSE RECEIVED]`, error.request);
      } else {
        console.log(`❗ [UNEXPECTED ERROR]`, error.message);
      }
    }
    return Promise.reject(error);
  },
);