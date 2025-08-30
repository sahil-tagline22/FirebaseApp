import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import {getRemoteConfig,setDefaults,fetchAndActivate,getValue} from '@react-native-firebase/remote-config';
import analytics from '@react-native-firebase/analytics';

const ThemeScreen = () => {
  const [theme, setTheme] = useState<string>();

  //analytics
  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'ThemeScreen',
      screen_class: 'ThemeScreen',
    });
    
  }, []);

  useEffect(() => {
    const appTheme = async () => {
      try {
        const app = getApp();
        const remoteConfig = getRemoteConfig(app);

        await setDefaults(remoteConfig,{ app_theme: 'light' });

        await fetchAndActivate(remoteConfig);
        
        const Theme = getValue(remoteConfig,'app_theme').asString();
        setTheme(Theme);
      } catch (error) {
        console.log(error);
        setTheme('light');
      }
    };
    appTheme();
  }, []);

  if (!theme) {
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={'large'} />
    </View>;
  }

  const checkTheme = theme === "light"

  return (
    <View style={[styles.container,{backgroundColor : checkTheme ? "#fff" : "#000"}]}>
      <Text style={{color : checkTheme ? "#000" : "#fff"}}>{theme}</Text>
    </View>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});
