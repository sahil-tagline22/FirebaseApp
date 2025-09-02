import React, { useCallback } from 'react';
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import UserScreen from '../screen/UserScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconDisplay from '../components/IconPrint/IconDisplay';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/Colors';
import auth from '@react-native-firebase/auth';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../redux/Store';
import { logoutUser } from '../redux/slice/AuthSlice';

import { useAppTranslation } from '../hooks/useAppTranslation';
import SettingScreen from '../screen/SettingScreen';
import { useThemeColor } from '../hooks/useThemeColor';
import { resetToInitialState } from '../redux/slice/AccessAndRefreshSlice';
import AboutScreen from '../screen/AboutScreen';
import { Images } from '../assets/Images';

const Bottom = createBottomTabNavigator();

interface BottomTabNavigateProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'drawerHome'>;
}

interface BottomTabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const BottomTabNavigate = ({ navigation }: BottomTabNavigateProps) => {
  const dispatch = useAppDispatch();
  const styles = useStyle();
  const { t } = useAppTranslation();
  const color = useThemeColor();

  const handleLogout = useCallback(() => {
    auth().signOut();
    dispatch(logoutUser());
    dispatch(resetToInitialState());
    navigation.replace('login');
    console.log('user logout');
  }, [dispatch, navigation]);

  //logoutBtn create Button
  const headerRight = useCallback(
    () => (
      <TouchableOpacity style={styles.btnContainer} onPress={handleLogout}>
        <Text style={styles.btnText}>{t('logout')}</Text>
      </TouchableOpacity>
    ),
    [handleLogout, t,styles.btnContainer,styles.btnText],
  );

  //product list Button
  const listProduct = useCallback(
    () => (
      <TouchableOpacity style={styles.btnListOfProduct} onPress={()=>navigation.navigate('product')}>
        <Image source={Images.shopping} style={styles.imageCart} tintColor={color.activeIconColor} />
      </TouchableOpacity>
    ),
    [navigation,color.activeIconColor,styles.btnListOfProduct,styles.imageCart],
  );

  const tabBarIcon = useCallback(
    (
      props: BottomTabBarIconProps & {
        name: 'home' | 'light-mode' | 'group' | 'settings' | 'info';
      },
    ) => (
      <IconDisplay name={props.name} color={props.color} size={props.size} />
    ),
    [],
  );

  return (
    <Bottom.Navigator
      screenOptions={{
        headerLeft: headerRight,
        headerRight : listProduct,
        tabBarActiveTintColor: color.activeIconColor,
        tabBarInactiveTintColor: color.inActiveColor,
        headerStyle: { backgroundColor: color.header },
        headerTitleStyle: { color: color.headerText },
        tabBarStyle: { backgroundColor: color.footer },
      }}
    >
      <Bottom.Screen
        name="drawerHome"
        component={HomeScreen}
        options={{
          tabBarIcon: (props: BottomTabBarIconProps) =>
            tabBarIcon({ ...props, name: 'home' }),
          headerTitle: t('home'),
          headerTitleAlign: 'center',
          title: t('home'),
        }}
      />

      <Bottom.Screen
        name="drawerAbout"
        component={AboutScreen}
        options={{
          tabBarIcon: (props: BottomTabBarIconProps) =>
            tabBarIcon({ ...props, name: 'info' }),
          headerTitle: t('about'),
          headerTitleAlign: 'center',
          title: t('about'),
        }}
      />

      <Bottom.Screen
        name="drawerTheme"
        component={ThemeScreen}
        options={{
          tabBarIcon: (props: BottomTabBarIconProps) =>
            tabBarIcon({ ...props, name: 'light-mode' }),
          headerTitle: t('theme'),
          headerTitleAlign: 'center',
          title: t('theme'),
        }}
      />

      <Bottom.Screen
        name="userScreen"
        component={UserScreen}
        options={{
          tabBarIcon: (props: BottomTabBarIconProps) =>
            tabBarIcon({ ...props, name: 'group' }),
          headerTitle: t('user_chat'),
          headerTitleAlign: 'center',
          title: t('user_chat'),
        }}
      />

      <Bottom.Screen
        name="setting"
        component={SettingScreen}
        options={{
          tabBarIcon: (props: BottomTabBarIconProps) =>
            tabBarIcon({ ...props, name: 'settings' }),
          headerTitle: t('setting'),
          headerTitleAlign: 'center',
          title: t('setting'),
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomTabNavigate;

const useStyle = () =>{
  const color = useThemeColor();
 return StyleSheet.create({
  btnContainer: {
    backgroundColor: colors.button.button,
    height: 30,
    width: 70,
    marginLeft: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    color: colors.text.inverted,
  },
  btnListOfProduct:{
    marginRight:15
  },
  imageCart:{
    height:35,
    width: 35,
  }
});
}
