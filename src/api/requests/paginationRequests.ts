import axios from "axios"

export const paginationApiCall = async (page:number) =>{
    try{
        const request = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`);
        console.log("🚀 ~ paginationApiCall ~ request:", request)
        return request;
    }catch(error){
        console.log("🚀 ~ paginationApiCall ~ error:", error);  
    }
}