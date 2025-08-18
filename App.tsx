import { persister, store } from './src/redux/Store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import HomeStackNavigator from './src/navigation/HomeStackNavigator';



const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persister}>
        <HomeStackNavigator />
      </PersistGate>
    </Provider>
   
  );
};

export default App;
