import axios from 'axios';
import { store } from '../redux/Store';
import { handleAccessToken } from '../redux/slice/AccessAndRefreshSlice';
import { getCurrentDateTime, getFullUrl } from '../utils/helperFunctions';
import { endpoints } from './endpoints';

export const baseUrl = 'http://192.168.0.59:3000';

export const axiosClient = axios.create({
  baseURL: baseUrl,
  // headers : {'Content-Type' : 'application/json'}
});

axiosClient.defaults.headers.common['Content-Type'] = 'application/json';

// Only log if DEBUG_MODE is enabled (replace with __DEV__ in React Native if needed)
const isDebug = __DEV__; // fallback to __DEV__ for React Native

axiosClient.interceptors.request.use(
  requestConfig => {
    const token = store.getState().token.accessToken;
    // const refresh = store.getState().token.refreshToken;
   if (requestConfig.url === endpoints.refresh_token) {
    //   requestConfig.headers.Authorization = `Bearer ${refresh}`;
    } else if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    if (isDebug) {
      console.log(
        `📡 [API CALL] ${requestConfig.method?.toUpperCase()} ${getCurrentDateTime()} ${getFullUrl(
          requestConfig,
        )}`,
        requestConfig.headers,
        requestConfig.data || '',
      );
    }
    return requestConfig;
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

    if (error.response?.status === 401 && error.config.url !== endpoints.refresh_token) {
      originalRequest._retry = true;
      const refreshToken = store.getState().token.refreshToken;
      console.log('🚀 ~ refreshToken:', refreshToken);
      if (refreshToken) {
        try {
          const response = await axiosClient.post('/api/auth/refresh', {
            token: refreshToken,
          });
          console.log('🚀 ~ response:', response);
          const newAccessToken = response.data.data.accessToken;

          store.dispatch(handleAccessToken(newAccessToken));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        } catch (tokenRefreshError) {
          console.log('🚀 ~ error:', tokenRefreshError);
        }
      }
    }
    if (isDebug) {
      const endTime = new Date();
      const startTime = error.config?.metadata?.startTime;
      const duration = startTime
        ? `${endTime.getTime() - startTime.getTime()}ms`
        : "N/A";

      if (error.response) {
        console.log(
          `🚫 [API ERROR RESPONSE] ${error.config.method?.toUpperCase()} ${getCurrentDateTime()} ${
            error.config.url
          } (${duration})`,
          error.response.data
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


// import axios from "axios";
// import * as config from "../config";
// import { t } from "i18next";
// import { useUserStore } from "@/store/useUserStore";
// import { useThemeStore } from "@/store/useThemeStore";
// import {
//   getApiErrorStatusCode,
//   getCurrentDateTime,
//   getFullUrl,
// } from "@/utils/helperFunctions";
// import { endpoints } from "./endpoints";
// import { apiRefreshToken } from "./requests/authRequests";

// const axiosClient = axios.create({
//   baseURL: config.API_DOMAIN,
//   // timeout: 5000,
//   timeoutErrorMessage: t("server_request_timeout_error"),
// });

// axiosClient.defaults.headers.common["Content-Type"] = "application/json";

// // Only log if DEBUG_MODE is enabled (replace with __DEV__ in React Native if needed)
// const isDebug = __DEV__; // fallback to __DEV__ for React Native

// axiosClient.interceptors.request.use(
//   (requestConfig) => {
//     const token = useUserStore.getState().accessToken;

//     if (requestConfig.url == endpoints.refresh_token) {
//       requestConfig.headers.Authorization = `Bearer ${
//         useUserStore.getState().refreshToken
//       }`;
//     } else if (token) {
//       requestConfig.headers.Authorization = `Bearer ${token}`;
//     }

//     requestConfig.headers["Accept-Language"] =
//       useThemeStore.getState().app_language;

//     if (isDebug) {
//       console.log(
//         `📡 [API CALL] ${requestConfig.method?.toUpperCase()} ${getCurrentDateTime()} ${getFullUrl(
//           requestConfig
//         )}`,
//         requestConfig.headers,
//         requestConfig.data || ""
//       );
//     }

//     return requestConfig;
//   },
//   (error) => {
//     if (isDebug) {
//       console.log("❌ [REQUEST ERROR] ${getCurrentDateTime()} ", error);
//     }
//     return Promise.reject(error);
//   }
// );

// axiosClient.interceptors.response.use(
//   (response) => {
//     if (isDebug) {
//       const endTime = new Date();
//       const startTime = response.config.metadata?.startTime;
//       const duration = startTime
//         ? `${endTime.getTime() - startTime.getTime()}ms`
//         : "N/A";
//       console.log(
//         `✅ [API RESPONSE] ${response.config.method?.toUpperCase()} ${getCurrentDateTime()} ${
//           response.config.url
//         } (${duration})`,
//         response
//       );
//     }
//     return response;
//   },
//   async (error) => {
//     const statusCode = getApiErrorStatusCode(error);
//     if (statusCode == 401 && error.config.url != endpoints.refresh_token) {
//       // Refreshing token on 401 error
//       apiRefreshToken();
//     }

//     if (isDebug) {
//       const endTime = new Date();
//       const startTime = error.config?.metadata?.startTime;
//       const duration = startTime
//         ? `${endTime.getTime() - startTime.getTime()}ms`
//         : "N/A";

//       if (error.response) {
//         console.log(
//           `🚫 [API ERROR RESPONSE] ${error.config.method?.toUpperCase()} ${getCurrentDateTime()} ${
//             error.config.url
//           } (${duration})`,
//           error.response.data
//         );
//       } else if (error.request) {
//         console.log(`⚠️ [NO RESPONSE RECEIVED]`, error.request);
//       } else {
//         console.log(`❗ [UNEXPECTED ERROR]`, error.message);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosClient;
