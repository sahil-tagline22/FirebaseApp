import { useEffect } from 'react';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const userPermissionGet = async ()=>{
    const getUserPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    if(getUserPermission === PermissionsAndroid.RESULTS.GRANTED){
        console.log("Permission granted");
        getToken();
    }else{
        console.log("permission denied");
    }
}

const getToken = async () =>{
    try{
        const token = await messaging().getToken();
        console.log("🚀 ~ getToken ~ token:", token)
    }catch(error){
        console.log("🚀 ~ getToken ~ error:", error)
    }
}

export const FcmToken = () =>{
    useEffect(()=>{
        userPermissionGet();
    },[])
}