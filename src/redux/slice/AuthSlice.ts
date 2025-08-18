import { createSlice } from '@reduxjs/toolkit';

export interface User {
  multiFactor: {
    enrolledFactors: any[]; 
  };
  metadata: {
    lastSignInTime: number;
    creationTime: number;
  };
  photoURL: string | null;
  phoneNumber: string | null;
  tenantId: string | null;
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  uid: string;
  email: string | null;
  providerData: {
    email: string | null;
    providerId: string;
    photoURL: string | null;
    phoneNumber: string | null;
    displayName: string | null;
    uid: string;
  }[];
  providerId: string;
}

interface AuthStateType {
  user: User | null;
}

const initialState: AuthStateType = {
  user: null,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: state => {
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;
