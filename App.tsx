import { persister, store} from './src/redux/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import HomeStackNavigator from './src/navigation/HomeStackNavigator';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { FcmToken } from './src/hooks/useFcmTocken';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MapScreen from './src/screen/MapScreen';


const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // FCM token get and user permission get
  FcmToken();
  
  // Foreground massage send to user 
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  
  return (
    // <Provider store={store}>
    //   <PersistGate persistor={persister}>
    //     <SafeAreaProvider>
    //       <HomeStackNavigator />
    //     </SafeAreaProvider>
    //   </PersistGate>
    // </Provider>
    <>
    <MapScreen />
    </>
  );
};

export default App;
