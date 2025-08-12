import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth'
import UserScreen from '../screen/UserScreen';


const Drawer = createDrawerNavigator();


const HomeDrawer = () => {

    const handleLogout = () =>{
        auth().signOut();
        console.log("user logout");
    }

  return (
    <Drawer.Navigator>
      <Drawer.Screen name='home' component={HomeScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='home' color={color} size={size} />),
        headerTitle : "Home",
        headerTitleAlign:"center",
        headerRight:()=>(<Button title='logout' onPress={handleLogout} />)
      }} />

      <Drawer.Screen name='theme' component={ThemeScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='light-mode' color={color} size={size} />),
        headerTitle : "Theme",
        headerTitleAlign:"center"
      }} />

      <Drawer.Screen name='userScreen' component={UserScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='group' color={color} size={size} />),
        title:"User-chat",
        headerTitle : "User-Chat",
        headerTitleAlign:"center",
      }} />

    </Drawer.Navigator>
  )
}

export default HomeDrawer

const styles = StyleSheet.create({})