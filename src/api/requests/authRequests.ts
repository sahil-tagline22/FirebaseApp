import { appNavigationRef } from '../../navigation/appNavigationRef';
import {
  setAccessToken,
  resetToInitialState,
} from '../../redux/slice/AccessAndRefreshSlice';
import { store } from '../../redux/Store';
import { axiosClient } from '../api';
import { endpoints } from '../endpoints';

export const apiRefreshToken = async () => {
  try {
    const refreshToken  = store.getState().token.refreshToken;
    console.log("🚀 ~ apiRefreshToken ~ refreshToken:", refreshToken)

    if (!refreshToken) {
      store.dispatch(resetToInitialState());
      appNavigationRef.current?.reset({
        routes : [{name : 'login'}]
      });
      return null;
    }

      const response = await axiosClient.post(endpoints.refresh_token, {refreshToken : refreshToken});
     
      if (response.data.data.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        // const newRefreshToken = response.data.data.refreshToken;

        store.dispatch(setAccessToken(newAccessToken));
        // store.dispatch(setRefreshToken(newRefreshToken));

        return newAccessToken;
      } else {
        store.dispatch(resetToInitialState());
        appNavigationRef.current?.reset({
          routes : [{name : "login"}],
        });
        return null;
      }
    } catch (error) {
      console.log("❌ Refresh token API failed:", error);
      
      store.dispatch(resetToInitialState());
      appNavigationRef.current?.reset({
        routes : [{name : "login"}],
      });
      return null;
  }
};