import { axiosClient } from "../api"
import { endpoints } from "../endpoints"

type UserData = {
    name? : string,
    email : string,
    password : string
}

export const RegisterUser = async (data:UserData)=>{
    try{
        const response = await axiosClient.post(endpoints.userRegistration,data);
        return response;
    }catch(error){
        console.log("🚀 ~ RegisterUser ~ error:", error) 
    }
}

export const LoginUser = async (data:UserData)=>{
    try{
        const response = await axiosClient.post(endpoints.userLogin,data);
        return response;
    }catch(error){
        console.log("🚀 ~ RegisterUser ~ error:", error) 
    }
}

export const GetUser = async()=>{
    try{
        const response = await axiosClient.get(endpoints.getCourantUser);
        console.log("🚀 ~ GetUser ~ response:", response)
        return response;
    }catch(error){
        console.log("🚀 ~ GetUser ~ error:", error)
    }
}