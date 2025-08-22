// import { StyleSheet } from 'react-native'
import React, { useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import LoginScreen from '../screen/auth/LoginScreen';
import RegistrationScreen from '../screen/auth/RegistrationScreen';
import HomeDrawer from './BottomTabNavigate';
import ChatScreen from '../screen/ChatScreen';
import { useAppSelector } from '../redux/Store';
import i18next from 'i18next';
import { StatusBar, useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStackNavigator = () => {

  const theme = useAppSelector(state=>state.theme.theme);
  const mobileTheme = useColorScheme();

  const language = useAppSelector(state=>state.language.lan)
  console.log("language -->",language);

  const user = useAppSelector(state => state.auth.user);
  console.log('redux persist data-->', user);

  const initialRouteName = useMemo(() => (user ? 'bottom' : 'login'), [user]);

  useEffect(()=>{
    if(!language){
      return;
    }else{
      i18next.changeLanguage(language);
    }
  },[language])

  return (
    <NavigationContainer>
      <StatusBar
          translucent
          hidden={false}
          barStyle={theme === 'light' || mobileTheme === "light"  ? 'light-content' : 'dark-content'}
        />
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="bottom"
          component={HomeDrawer}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default HomeStackNavigator;

// const styles = StyleSheet.create({})
