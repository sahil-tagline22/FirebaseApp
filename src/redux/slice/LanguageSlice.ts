import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
const supportedLanguages  = ['bn' , 'en' , 'gu' , 'hi' , 'pa'] as const;

type supportedLanguage = typeof supportedLanguages[number];

interface LanguageSliceType {
    lan : supportedLanguage
}

const initialState : LanguageSliceType = {
    lan : 'en'
}

export const LanguageSlice = createSlice({
    name:"language",
    initialState,
    reducers:{
        changeLanguage : (state,action:PayloadAction<supportedLanguage>) =>{
            state.lan = action.payload
        }
    }
})

export const {changeLanguage} = LanguageSlice.actions
export default LanguageSlice.reducer