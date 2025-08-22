import axios from "axios"
import { endpoints } from "../endpoints"

interface Data {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
}

const data:Data = {
    id: '20',
    name: "hello",
    email: "hello.kumar@example.com",
    phone: "+91-9988774454",
    address: "surat, India",
    company: "dell"
}

//get data 
export const userGetData = async () =>{
    const response = await axios.get(endpoints.getUserData);
    console.log("🚀 ~ userGetData ~ response:", response)
    return response.data
}

// post data
export const userPostData = async () =>{
    const response = await axios.post(endpoints.postUserData,data);
    console.log("🚀 ~ userGetData ~ response:", response)
    // return response.data
}

//put data 
export const userPutData = async() =>{
    const response = await axios.put(endpoints.putUserData,{name : "hello"});
    console.log("🚀 ~ userPutData ~ response:", response)
}

//patch data
export const userPatchData = async () => {
    const response = await axios.patch(endpoints.patchUserData,{name:"sahil"});
    console.log("🚀 ~ userPatchData ~ response:", response)
}

//delete data 
export const userDeleteData = async ()=>{
    const response = await axios.delete(endpoints.deleteUserdata);
    console.log("🚀 ~ userDeleteData ~ response:", response)
}