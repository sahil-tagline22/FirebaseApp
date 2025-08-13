import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import UserScreen from '../screen/UserScreen';
import { Text } from 'react-native-gesture-handler';
import { colors } from '../theme/Colors';
import CustomDrawer from '../components/customDrawer/CustomDrawer';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {

  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerTitle: 'Home',
          headerTitleAlign: 'center',
        }}
      />

      <Drawer.Screen
        name="theme"
        component={ThemeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="light-mode" color={color} size={size} />
          ),
          headerTitle: 'Theme',
          headerTitleAlign: 'center',
        }}
      />

      <Drawer.Screen
        name="userScreen"
        component={UserScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="group" color={color} size={size} />
          ),
          title: 'User-chat',
          headerTitle: 'User-Chat',
          headerTitleAlign: 'center',
        }}
      />
    </Drawer.Navigator>
  );
};

export default HomeDrawer;

const styles = StyleSheet.create({
  logoutBtn: {
    backgroundColor: colors.button.button,
    marginRight: 10,
    height: 30,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10
  },
  logoutText: {
    fontSize: 15,
    color: colors.text.inverted,
  },
});
