import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {FirebaseAuthTypes} from '@react-native-firebase/auth'

interface AuthStateType {
  user: FirebaseAuthTypes.User | null;
}

const initialState: AuthStateType = {
  user: null,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action:PayloadAction<FirebaseAuthTypes.User>) => {
      state.user = action.payload;
    },
    logoutUser: state => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;
