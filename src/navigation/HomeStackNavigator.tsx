// import { StyleSheet } from 'react-native'
import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import LoginScreen from '../screen/auth/LoginScreen';
import RegistrationScreen from '../screen/auth/RegistrationScreen';
import HomeDrawer from './BottomTabNavigate';
import ChatScreen from '../screen/ChatScreen';
import { useAppSelector } from '../redux/Store';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeStackNavigator = () => {
  const user = useAppSelector(state => state.auth.user);
  console.log('redux persist data-->', user);

  const initialRouteName = useMemo(() => (user ? 'bottom' : 'login'), [user]);

  return (
    <NavigationContainer>
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
