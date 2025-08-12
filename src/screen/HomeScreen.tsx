import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeScreen = ({user}) => {
  console.log("user data" , user);
  return (
    <View>
      <Text>user : {user.email}</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})