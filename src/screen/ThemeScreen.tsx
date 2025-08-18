import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import getRemoteConfig from '@react-native-firebase/remote-config';

const ThemeScreen = () => {
  const [theme, setTheme] = useState<string>();
  useEffect(() => {
    const appTheme = async () => {
      try {
        await getRemoteConfig().setDefaults({ app_theme: 'light' });

        await getRemoteConfig().fetch(0);
        await getRemoteConfig().activate();

        const Theme = getRemoteConfig().getValue('app_theme').asString();
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
