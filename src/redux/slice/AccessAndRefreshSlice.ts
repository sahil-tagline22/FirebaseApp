import { createSlice } from "@reduxjs/toolkit";

export const AccessAndRefreshSlice = createSlice({
    name : 'token',
    initialState:{
        accessToken : null,
        refreshToken : null,
    },
    reducers:{
        setAccessToken : (state,action) => {
            state.accessToken = action.payload
        },
        setRefreshToken : (state,action) => {
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