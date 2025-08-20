import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {Dropdown} from 'react-native-element-dropdown'
import i18next from 'i18next'

const language = [
  {label: 'English', value : 'en'},
  {label: 'Hindi', value : 'hi'},
  {label: 'Gujarati', value : 'gu'},
  {label: 'Panjabi', value : 'pa'},
  {label: 'bengali', value : 'bn'},
]

const SettingScreen = () => {

  const [value,setValue] = useState<string | null>("en");

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdownContainer}
        data={language}
        value={value}
        onChange={item => {
          setValue(item.value);
          i18next.changeLanguage(item.value);
        }}
        labelField={'label'}
        valueField={'value'}
      />
      <Text>{value}</Text>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    dropdownContainer:{
      height:30,
      width:300,
      borderColor:"gray",
      borderWidth:1,
      paddingHorizontal:8,
      borderRadius:8,
      backgroundColor:"white"
    }
})