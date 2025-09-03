import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Dropdown} from 'react-native-element-dropdown'
import i18next from 'i18next'
import { useAppDispatch, useAppSelector } from '../redux/Store'
import { changeLanguage } from '../redux/slice/LanguageSlice'

import { changeTheme } from '../redux/slice/ThemeSlice'
import { useThemeColor } from '../hooks/useThemeColor'
import { Images } from '../assets/Images'
import { launchImageLibrary } from "react-native-image-picker";
import DatePicker from 'react-native-date-picker'


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

  //permission to user to access camera
  const [filePath, setFilePath] = useState<string>();

  const onPress = () => {
    const options = {
      mediaType: 'image',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (item) => {
      console.log("🚀 ~ onPress ~ item:", item)
      setFilePath(item.assets?.[0]?.uri)
    });
  };

  //date picker 
   const [date, setDate] = useState(new Date())
  // const [open, setOpen] = useState(false)

  return (
    <View style={styles.container}>

      <View>
         <DatePicker date={date} onDateChange={setDate} />
      </View>

      <TouchableOpacity onPress={onPress}>
        {
          filePath ? 
          <Image source={{uri : filePath}} style={styles.selectedImage} />
          :
          <View style={styles.imageContainer}>
            <Image source={Images.ImagePlaceHolder} style={styles.imagePlaceholder} />
            <Text style={styles.imageText}>Select you Image</Text>
          </View>
        }
      </TouchableOpacity>

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
    },
    imageContainer:{
      backgroundColor:"white",
      height:150,
      width:250,
      marginBottom:30,
      justifyContent:"center",
      alignItems:"center",
      borderRadius:10,
      // borderWidth:1,
      elevation:10,
      shadowColor:"blue"
    },
    imagePlaceholder : {
      height:50,
      width:50
    },
    imageText : {
      fontSize:15,
      fontWeight:'700'
    },
    selectedImage:{
      height:150,
      width:250,
      marginBottom:30,
      borderRadius:10,
      elevation:10,
      shadowColor:"blue",
    }
  })
}