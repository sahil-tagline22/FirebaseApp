import { mmkv } from "./mmkv";


const mmkvStorage = {
    getItem : (key : string):string | null =>{
        return mmkv.getString(key) ?? null;
    },
    setItem : (key :string, value : string):void =>{
        mmkv.set(key,value);
    },
    removeItem : (key : string) : void => {
        mmkv.delete(key);
    } 
}

export const zustandStorage = mmkvStorage