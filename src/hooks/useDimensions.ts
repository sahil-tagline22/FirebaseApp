import { Dimensions } from "react-native";

const {width,height} = Dimensions.get('window');

const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

const widthScale = (size:number) => (width / BASE_WIDTH) * size;
const heightScale = (size:number) => (height / BASE_HEIGHT) * size;
const moderateScale = (size:number, factor = 0.5) => size + (widthScale(size) - size) * factor;

export { widthScale, heightScale, moderateScale };