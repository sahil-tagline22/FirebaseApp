import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
console.log("🚀 ~ HomeScreen ~ baseWidth:", screenWidth)
const screenHeight = Dimensions.get('window').height;
console.log("🚀 ~ HomeScreen ~ baseHeight:", screenHeight)

export const BASE_WIDTH = 393;
export const BASE_HEIGHT = 852;

export const Scale = (size:number)=>{return size * (screenWidth/BASE_WIDTH)}