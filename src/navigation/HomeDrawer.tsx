import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ChatScreen from '../screen/ChatScreen';

const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='home' component={HomeScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='home' color={color} size={size} />)
      }} />

      <Drawer.Screen name='theme' component={ThemeScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='light-mode' color={color} size={size} />)
      }} />

      <Drawer.Screen name='chat' component={ChatScreen} options={{
        drawerIcon:({color,size})=>(<Icon name='chat' color={color} size={size} />)
      }} />
    </Drawer.Navigator>
  )
}

export default HomeDrawer

const styles = StyleSheet.create({})