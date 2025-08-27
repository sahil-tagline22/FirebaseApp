import { endpoints } from '../endpoints';


//get data
export const getUserData = async () => {
  try {
    const response = await fetch(endpoints.getUserData);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('getUserData not working proper...!');
  }
};

//post data
export const postUserData = async () => {
  try {
    const users = await fetch(endpoints.postUserData, {
      method: 'post',
      body: JSON.stringify({
        id: 20,
        name: "hello",
        email: "hello.kumar@example.com",
        phone: "+91-9988774454",
        address: "surat, India",
        company: "dell"
    }),
      headers: { 'Content-type': 'application/json' },
    });
    const data = await users.json();
    return data;
  } catch (error) {
    console.log('post data error ...!');
  }
};

//put data 
export const putUserData = async () => {
  try {
    const users = await fetch(endpoints.putUserData, {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        "name": 'sahil',
      }),
    });
    const data = await users.json();
    console.log("🚀 ~ putUserData ~ data:", data)
    return data;
  } catch (error) {
    console.log("🚀 ~ putUserData ~ error:", error)
  }
};

// patch data 
export const patchUserData = async () => {
  try {
    const users = await fetch(endpoints.patchUserData, {
      method: 'patch',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        body : "sahil"
      }),
    });
    const data = await users.json();
    console.log("🚀 ~ patchUserData ~ data:", data);
    return data;
  } catch (error) {
   console.log("🚀 ~ patchUserData ~ error:", error);
  }
};

// delete data 
export const deleteUserData = async (id:number) => {
  try {
    const url = `${endpoints.deleteUserdata}${id}`
    console.log("🚀 ~ deleteUserData ~ url:", url)
    const users = await fetch(`${endpoints.deleteUserdata}${id}`, {
      method: 'delete',
    });
    const data = await users.json();
    console.log("🚀 ~ deleteUserData ~ data:", data)
    return data;
  } catch (error) {
   console.log("🚀 ~ deleteUserData ~ error:", error)
  }
};
