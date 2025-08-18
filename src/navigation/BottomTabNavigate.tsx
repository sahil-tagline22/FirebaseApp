import React from 'react';
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import UserScreen from '../screen/UserScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconDisplay from '../components/IconPrint/IconDisplay';


const Bottom = createBottomTabNavigator();

const BottomTabNavigate = () => {

  return (
    <Bottom.Navigator>
      <Bottom.Screen
        name="drawerHome"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconDisplay name={"home"} color={color} size={size} />
          ),
          headerTitle: 'Home',
          headerTitleAlign: 'center',
          title:"Home"
        }}
        />

      <Bottom.Screen
        name="drawerTheme"
        component={ThemeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconDisplay name="light-mode" color={color} size={size} />
          ),
          headerTitle: 'Theme',
          headerTitleAlign: 'center',
          title:"Theme"
        }}
      />

      <Bottom.Screen
        name="userScreen"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconDisplay name="group" color={color} size={size} />
          ),
          headerTitle: 'User-Chat',
          headerTitleAlign: 'center',
          title: 'User-chat',
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomTabNavigate;