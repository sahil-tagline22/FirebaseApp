import { createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "../types/RootStackParamList";

export const appNavigationRef = createNavigationContainerRef<RootStackParamList>();


export const navigate = <Name extends keyof RootStackParamList>(name : Name,params? : RootStackParamList[Name]) =>{
    if(appNavigationRef.isReady()){
        appNavigationRef.navigate(name, params);
    }
}

export const resetToLogin = () => {
    if (appNavigationRef.isReady()) {
        appNavigationRef.reset({
            index: 0,
            routes: [{ name: "login" }],
        });
    }
};