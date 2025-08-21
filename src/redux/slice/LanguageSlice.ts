import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Language = {
    lan? : string
}

interface LanguageSliceType {
    lan? : Language
}

const initialState : LanguageSliceType = {
    lan : undefined
}

export const LanguageSlice = createSlice({
    name:"language",
    initialState,
    reducers:{
        changeLanguage : (state,action:PayloadAction<Language | undefined>) =>{
            state.lan = action.payload
        }
    }
})

export const {changeLanguage} = LanguageSlice.actions
export default LanguageSlice.reducer