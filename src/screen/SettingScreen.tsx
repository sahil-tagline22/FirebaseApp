import { StyleSheet, Switch, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Dropdown} from 'react-native-element-dropdown'
import i18next from 'i18next'
import { useAppDispatch, useAppSelector } from '../redux/Store'
import { changeLanguage } from '../redux/slice/LanguageSlice'
import ToggleSwitch from 'toggle-switch-react-native'
import { changeTheme } from '../redux/slice/ThemeSlice'


const languages = [
  {label: 'English', value : 'en'},
  {label: 'Hindi', value : 'hi'},
  {label: 'Gujarati', value : 'gu'},
  {label: 'Panjabi', value : 'pa'},
  {label: 'bengali', value : 'bn'},
]

const SettingScreen = () => {

  const dispatch = useAppDispatch();
  const language = useAppSelector(state=>state.language.lan)
  console.log("language -->",language);
  const theme = useAppSelector(state=>state.theme.theme)
  console.log("theme -->",theme);

  const [value,setValue] = useState<string | null>(language);
  const [isEnable,setIsEnable] = useState(false);

  useEffect(()=>{
    if(!language){
      return;
    }else{
      i18next.changeLanguage(language);
    }
  },[language])

  useEffect(()=>{
    if(isEnable){
      dispatch(changeTheme("dark"))
    }else{
      dispatch(changeTheme("light"))
    }
  },[isEnable,dispatch])

  const ToggleSwitchBtn = ()=> setIsEnable(prev => !prev)

  return (
    <View style={styles.container}>
      <View style={styles.ToggleContainer}>
        <ToggleSwitch
          isOn={isEnable}
          onColor={"black"}
          offColor={"gray"}
          label={isEnable ? "dark" : "light"}
          onToggle={ToggleSwitchBtn}
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
    },
    ToggleContainer:{
      marginBottom:30
    }
})