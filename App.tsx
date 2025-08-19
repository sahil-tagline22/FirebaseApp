import { persister, store } from './src/redux/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import HomeStackNavigator from './src/navigation/HomeStackNavigator';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';


const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, []);
  
  return (

    <Provider store={store}>
      <PersistGate persistor={persister}>
        <StatusBar
          translucent
          backgroundColor={'#000'}
          hidden={false}
          barStyle={'dark-content'}
        />
        <HomeStackNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
