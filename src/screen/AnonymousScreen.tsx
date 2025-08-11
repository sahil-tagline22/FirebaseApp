import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import auth from '@react-native-firebase/auth'

const AnonymousScreen = ({navigation}) => {

    useEffect(()=>{
          const clickButton = async () =>{
            try{
              await auth().signInAnonymously();
              console.log("login successfully");
              navigation.replace("home");
            }
            catch(error){
              console.log("error",error)
            }
          }
          clickButton();
      },[])
    

  return (
    <View>
      <Text>Anonymous</Text>
    </View>
  )
}

export default AnonymousScreen

const styles = StyleSheet.create({})