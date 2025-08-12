import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'

const HomeScreen = () => {
  const [user,setUser] = useState();

  useEffect(()=>{
    const userGet = ()=>{
      const user = auth().currentUser;
      setUser(user.email);
      console.log("user",user.email);
    }
    userGet();
  },[])

  return (
    <View>
      <Text>user :{user}</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})