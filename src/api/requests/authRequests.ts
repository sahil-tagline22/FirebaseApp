import { appNavigationRef } from '../../navigation/appNavigationRef';
import {
  handleAccessToken,
  handleCleanToken,
  handleRefreshToken,
} from '../../redux/slice/AccessAndRefreshSlice';
import { store, useAppDispatch } from '../../redux/Store';
import { axiosClient } from '../api';
import { endpoints } from '../endpoints';

export const apiRefreshToken = async () => {
  try {
    const refreshToken  = store.getState().token.refreshToken;

    if (!refreshToken) {
      store.dispatch(handleCleanToken());
      appNavigationRef.current?.reset({
        routes : [{name : 'login'}]
      });
      return null;
    }

      const response = await axiosClient.post(endpoints.refresh_token, {token : refreshToken});
     
      if (response.data.data.accessToken && response.data.data.refreshToken) {
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        store.dispatch(handleAccessToken(newAccessToken));
        store.dispatch(handleRefreshToken(newRefreshToken));

        return newAccessToken;
      } else {
        store.dispatch(handleCleanToken());
        appNavigationRef.current?.reset({
          routes : [{name : "login"}],
        });
        return null;
      }
    } catch (error) {
      console.log("❌ Refresh token API failed:", error);
      
      store.dispatch(handleCleanToken());
      appNavigationRef.current?.reset({
        routes : [{name : "login"}],
      });
      return null;
  }
};

// export const apiRefreshToken = async () => {
//   try {
//     const refresh_token = useUserStore.getState().accessToken;
//     if (refresh_token) {
//       const response = await axiosClient.post(endpoints.refresh_token);
//       const device_id = await getDeviceID();
//       console.log("🚀 ~ apiRefreshToken ~ device_id:", device_id);
//       if (response.data.data.accessToken && response.data.data.refreshToken) {
//         useUserStore.getState().setAccessToken(response.data.data.accessToken);
//         useUserStore
//           .getState()
//           .setRefreshToken(response.data.data.refreshToken);
//       } else {
//         try {
//           useUserStore.getState().resetToInitialState();
//           appNavigationRef.current?.reset({
//             routes: [{ name: "SignUpScreen" }],
//           });
//         } catch (error) {
//           console.log("🚀 ~ apiRefreshToken ~ error:", error);
//         }
//       }
//     }
//   } catch (error) {
//     const statusCode = getApiErrorStatusCode(error);
//     if (statusCode == 401) {
//       showErrorAlert("Session expired, please login again", error);
//       useUserStore.getState().resetToInitialState();
//       appNavigationRef.current?.reset({ routes: [{ name: "SignUpScreen" }] });
//     }
//   }
// };
