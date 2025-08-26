import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: TokenState = {
  accessToken: null,
  refreshToken: null,
};


export const AccessAndRefreshSlice = createSlice({
    name : 'token',
    initialState,
    reducers:{
        setAccessToken : (state,action:PayloadAction<string | null>) => {
            state.accessToken = action.payload
        },
        setRefreshToken : (state,action:PayloadAction<string | null>) => {
            state.refreshToken = action.payload
        },
        resetToInitialState : (state) => {
            state.accessToken = null
            state.refreshToken = null
        }
    }
})

export const {setAccessToken,setRefreshToken,resetToInitialState} = AccessAndRefreshSlice.actions
export default AccessAndRefreshSlice.reducer