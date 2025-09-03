import { axiosClient } from "../api"
import { endpoints } from "../endpoints"

export interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  dueDate: string | Date;
  createdAt?: string;
  updatedAt?: string;
}

export const PostTask = async (task:Omit<Task, | 'id' | 'createdAt' | 'updatedAt'>)=>{
    try{
        console.log("🚀 ~ PostTask ~ task:", task)
        const response = await axiosClient.post(endpoints.postTask,task)
        console.log("🚀 ~ postTask ~ response:", response)
        return response;
    }catch(error){
        console.log("🚀 ~ PostTask ~ error:", error)
    }
}

export const GetTask = async () =>{
    try{
        const response = await axiosClient.get(endpoints.getTask)
        console.log("🚀 ~ GetTask ~ response:", response)
        return response;
    }catch(error){
        console.log("🚀 ~ GetTask ~ error:", error);
    }
}

export const GetTaskById = async (id:string) =>{
    try{
        const response = await axiosClient.get(`${endpoints.getTaskById}${id}`)
        console.log("🚀 ~ GetTaskById ~ response:", response)
        return response.data.data;
    }catch(error){
        console.log("🚀 ~ GetTaskById ~ error:", error);
    }
}

export const PutTask = async (id:string,data:Partial<Task>) =>{
    console.log("🚀 ~ PutTask ~ id:", id)
    console.log("🚀 ~ putTask ~ data:", data)
    try{
        const response = await axiosClient.put(`${endpoints.putTask}${id}`,data)
        console.log("🚀 ~ PutTask ~ response:", response);
        return response.data.data;
    }catch(error){
        console.log("🚀 ~ PutTask ~ error:", error);
    }
}

export const DeleteTask = async (id:string) =>{
    try{
        const response = await axiosClient.delete(`${endpoints.deleteTask}${id}`)
        console.log("🚀 ~ DeleteTask ~ response:", response)
        return response.data;
    }catch(error){
        console.log("🚀 ~ DeleteTask ~ error:", error)
    }
}