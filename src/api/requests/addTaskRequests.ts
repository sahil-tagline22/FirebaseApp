import { axiosClient } from "../api"
import { endpoints } from "../endpoints"

export const PostTask = async (task)=>{
    try{
        console.log("🚀 ~ PostTask ~ task:", task)
        const response = await axiosClient.post(endpoints.postTask,task)
        console.log("🚀 ~ postTask ~ response:", response)
    }catch(error){
        console.log("🚀 ~ PostTask ~ error:", error)
    }
}