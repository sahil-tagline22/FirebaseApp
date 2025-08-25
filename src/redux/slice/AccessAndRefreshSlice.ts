import { createSlice } from "@reduxjs/toolkit";

export const AccessAndRefreshSlice = createSlice({
    name : 'token',
    initialState:{
        accessToken : null,
        refreshToken : null,
    },
    reducers:{
        handleAccessToken : (state,action) => {
            state.accessToken = action.payload
        },
        handleRefreshToken : (state,action) => {
            state.refreshToken = action.payload
        },
        handleCleanToken : (state) => {
            state.accessToken = null
            state.refreshToken = null
        }
    }
})

export const {handleAccessToken,handleRefreshToken,handleCleanToken} = AccessAndRefreshSlice.actions
export default AccessAndRefreshSlice.reducer