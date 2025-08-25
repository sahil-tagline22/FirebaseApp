import { useColorScheme } from "react-native";
import { useAppSelector } from "../redux/Store";
import { ThemeColor } from "../theme/ThemeColor";

export const useThemeColor = () => {
    const theme = useAppSelector(state => state.theme.theme)
    // const mobileTheme = Appearance.getColorScheme();
    const mobileTheme = useColorScheme();

    const returnTheme = theme === "light" ? ThemeColor.lightTheme : 
                        theme === "dark" ?  ThemeColor.DarkTheme : 
                        theme === "auth" || mobileTheme === "light" ? ThemeColor.lightTheme : ThemeColor.DarkTheme

    return returnTheme;
}