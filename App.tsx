import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/auth/LoginScreen';
import RegistrationScreen from './src/screen/auth/RegistrationScreen';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, View } from 'react-native';
// import Anonymous from './src/screen/Anonymous';
import { StyleSheet } from 'react-native';
import HomeDrawer from './src/navigation/HomeDrawer';
import ChatScreen from './src/screen/ChatScreen';
import SplashScreen from './src/screen/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    try {
      auth().onAuthStateChanged(data => {
        setUser(data);
        if (loader) {
          setLoader(false);
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  // if (loader) {
  //   return (
  //     <View style={styles.loaderContainer}>
  //       <ActivityIndicator size={'large'} color={'blue'} />
  //     </View>
  //   );
  // }
  // const initialRouteName = user ? 'drawer' : 'login'
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='splash' component={SplashScreen} options={{headerShown:false}} />
        <Stack.Screen name='login' component={LoginScreen} options={{headerShown: false,}} />
        <Stack.Screen name='registration' component={RegistrationScreen} />
        <Stack.Screen name='drawer' component={HomeDrawer} />
        <Stack.Screen name='chat' component={ChatScreen} />
        {/* {user ? (
          <>
            <Stack.Screen
              name="drawer"
              component={HomeDrawer}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="chat"
              component={ChatScreen}
              options={{ headerShown: true }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="registration"
              component={RegistrationScreen}
              options={{
                headerShown: false,
              }}
            />
          </>
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
