import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Dropdown} from 'react-native-element-dropdown'
import i18next from 'i18next'
import { useAppDispatch, useAppSelector } from '../redux/Store'
import { changeLanguage } from '../redux/slice/LanguageSlice'

import { changeTheme } from '../redux/slice/ThemeSlice'
import { useThemeColor } from '../hooks/useThemeColor'


const languages = [
  {label: 'English', value : 'en'},
  {label: 'Hindi', value : 'hi'},
  {label: 'Gujarati', value : 'gu'},
  {label: 'Panjabi', value : 'pa'},
  {label: 'bengali', value : 'bn'},
]

const themes = [
  {label: 'Light', value : 'light'},
  {label: 'Dark', value : 'dark'},
  {label: 'Auto', value : 'auto'},
]

const SettingScreen = () => {

  const color = useThemeColor();
  const styles = useStyle();

  const dispatch = useAppDispatch();
  const language = useAppSelector(state=>state.language.lan)
  console.log("language -->",language);
  const theme = useAppSelector(state=>state.theme.theme)
  console.log("theme -->",theme);

  const [value,setValue] = useState<string | null>(language);
  useEffect(()=>{
    if(!language){
      return;
    }else{
      i18next.changeLanguage(language);
    }
  },[language])



  return (
    <View style={styles.container}>

      <View style={styles.ToggleContainer}>
        <Dropdown
          style={styles.dropdownContainer}
          data={themes}
          value={theme}
          onChange={item => {
            dispatch(changeTheme(item.value));
          }}
          labelField={'label'}
          valueField={'value'}
          selectedTextStyle={{color:color.text}}
        />
      </View>

      <Dropdown
        style={styles.dropdownContainer}
        data={languages}
        value={value}
        onChange={item => {
          setValue(item.value);
          dispatch(changeLanguage(item.value));
        }}
        labelField={'label'}
        valueField={'value'}
        selectedTextStyle={{color:color.text}}
      />
      {/* <Text style={styles.text}>{value}</Text> */}

    </View>
  )
}

export default SettingScreen

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:color.backGroundColor
    },
    dropdownContainer:{
      height:30,
      width:300,
      borderColor:color.borderColor,
      borderWidth:1,
      paddingHorizontal:8,
      borderRadius:8,
      backgroundColor:color.backGroundColor
    },
    ToggleContainer:{
      marginBottom:30
    },
    text : {
      color : color.text
    }
  })
}