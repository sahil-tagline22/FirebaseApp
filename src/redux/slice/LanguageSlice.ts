import { createSlice } from "@reduxjs/toolkit";

export const LanguageSlice = createSlice({
    name:"language",
    initialState:{
        lan:null
    },
    reducers:{
        changeLanguage : (state,action) =>{
            state.lan = action.payload
        }
    }
})

export const {changeLanguage} = LanguageSlice.actions
export default LanguageSlice.reducer