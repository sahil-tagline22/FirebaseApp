import { axiosClient } from "../api"
import { endpoints } from "../endpoints"

export const RegisterUser = async (data)=>{
    console.log("🚀 ~ RegisterUser ~ data:", data)
    const user = await axiosClient.post(endpoints.userRegistration,data);
    console.log("🚀 ~ RegisterUser ~ user:", user)
}