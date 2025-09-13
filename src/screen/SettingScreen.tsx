import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import FastImage from "@d11/react-native-fast-image";
import { Blurhash } from "react-native-blurhash";
import LottieView from 'lottie-react-native'
import { heightScale, moderateScale, widthScale } from '../hooks/useDimensions'

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
  
  //permission to user to access photo-gallery
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
  
  //blurhash image 
  const [loaded, setLoaded] = useState<boolean>(false);  const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
  const image = "https://i.pinimg.com/736x/fb/fd/c3/fbfdc3c9726bb72ddd547779e3aa2fa7.jpg";
  
  return (
    <ScrollView>
    <View style={styles.container}>

      {/* lottie implement */}
      <View style={styles.lottieContainer}>
        <LottieView source={Images.locationMap} autoPlay loop style={styles.lottieItem}/>
        <LottieView source={Images.location} autoPlay loop style={styles.lottieItem}/> 
      </View>

      {/* date implement */}
      <View>
         <DatePicker date={date} onDateChange={setDate} />
      </View>

      {/* theme dropdown  */}
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

      {/* Language dropdown  */}
      <Dropdown
        style={[styles.dropdownContainer,{marginBottom:heightScale(30)}]}
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

      {/* image picker */}
      <TouchableOpacity onPress={onPress}>
        {
          filePath ? 
          <View>
            <FastImage source={{uri : filePath}} style={styles.selectedImage} />
          </View>
          :
          <View style={styles.imageContainer}>
            <FastImage source={Images.ImagePlaceHolder} style={styles.imagePlaceholder} />
            <Text style={styles.imageText}>Select you Image</Text>
          </View>
        }
      </TouchableOpacity>

      {/* blurhash image loader */}
      <View style={styles.selectedImage}>
        {
          !loaded && (<Blurhash blurhash={blurhash} style={styles.selectedImage}/> )
        }
        <Image source={{uri:image}} style={styles.selectedImage} onLoadEnd={()=>setLoaded(true)}/>
      </View>

    </View>
    </ScrollView>
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
      height:heightScale(40),
      width:widthScale(300),
      borderColor:color.borderColor,
      borderWidth:moderateScale(1),
      paddingHorizontal:widthScale(10),
      borderRadius:moderateScale(8),
      backgroundColor:color.backGroundColor,
      // marginBottom : 10
    },
    ToggleContainer:{
      marginBottom:20
    },
    text : {
      color : color.text
    },
    imageContainer:{
      backgroundColor:"white",
      height:heightScale(200),
      width:widthScale(300),
      marginBottom:heightScale(30),
      justifyContent:"center",
      alignItems:"center",
      borderRadius:moderateScale(10),
      elevation:10,
    },
    imagePlaceholder : {
      height:heightScale(50),
      width:widthScale(50),
    },
    imageText : {
      fontSize:moderateScale(15),
      fontWeight:'700'
    },
    selectedImage:{
      height:heightScale(200),
      width:widthScale(300),
      marginBottom:heightScale(30),
      borderRadius:moderateScale(10),
      elevation:10,
    },
    lottieContainer : {
      flexDirection:"row",
    },
    lottieItem:{
      height:50,
      width:50
    }
  })
}