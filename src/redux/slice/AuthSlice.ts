import { createSlice } from "@reduxjs/toolkit";

type User = {
    email : string
}

interface AuthStateType {
    user : User | null
}

const initialState:AuthStateType = {
    user : null
}

export const AuthSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginUser : (state,action) =>{
            state.user = action.payload
        },
        logoutUser : (state)=>{
            state.user = null
        }
    }
})

export const {loginUser,logoutUser} = AuthSlice.actions
export default AuthSlice.reducer