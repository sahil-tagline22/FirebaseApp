import {MMKV} from 'react-native-mmkv';

export const mmkv = new MMKV();

export const setMMKVString = (key : string,value : string) => mmkv.set(key,value);
export const getMMKVString = (key : string) => mmkv.getString(key);
export const removeMMKVKey = (key : string) => mmkv.delete(key);