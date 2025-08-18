import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/AuthSlice'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import logger from "redux-logger"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({
    auth : authReducer
})

const persistConfig = {
    key : 'root',
    storage : AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer:persistedReducer,
    // middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
      middleware: getDefaultMiddleware =>
    __DEV__ && false
      ? getDefaultMiddleware({
          serializableCheck: false,
        }).concat(logger)
      : getDefaultMiddleware({ serializableCheck: false }),
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const persister = persistStore(store);

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;