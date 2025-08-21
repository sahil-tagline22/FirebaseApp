import { createSlice } from "@reduxjs/toolkit";

export const ThemeSlice = createSlice({
    name:"theme",
    initialState:{
        theme:null
    },
    reducers:{
        changeTheme : (state,action) =>{
            state.theme = action.payload
        }
    }
})

export const {changeTheme} = ThemeSlice.actions
export default ThemeSlice.reducer