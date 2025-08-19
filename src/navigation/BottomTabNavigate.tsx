import React, { useCallback } from 'react';
import HomeScreen from '../screen/HomeScreen';
import ThemeScreen from '../screen/ThemeScreen';
import UserScreen from '../screen/UserScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconDisplay from '../components/IconPrint/IconDisplay';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/Colors';
import auth from '@react-native-firebase/auth';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '../redux/Store';
import { logoutUser } from '../redux/slice/AuthSlice';

const Bottom = createBottomTabNavigator();

interface BottomTabNavigateProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'drawerHome'>;
}

interface BottomTabBarIconProps {
  focused: boolean; 
  color: string;   
  size: number; 
}

const BottomTabNavigate = ({ navigation }: BottomTabNavigateProps) => {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(() => {
    auth().signOut();
    dispatch(logoutUser());
    navigation.replace('login');
    console.log('user logout');
  }, [dispatch, navigation]);

  const headerRight = useCallback(
    () => (
      <TouchableOpacity style={styles.btnContainer} onPress={handleLogout}>
        <Text style={styles.btnText}>LogOut</Text>
      </TouchableOpacity>
    ),
    [handleLogout],
  );

  const tabBarIcon = useCallback(
    (props:BottomTabBarIconProps & {name: 'home' | 'light-mode' | 'group';}) => (
      <IconDisplay name={props.name} color={props.color} size={props.size} />
    ),
    [],
  );

  return (
    <Bottom.Navigator
      screenOptions={{
        headerRight: headerRight,
        tabBarActiveTintColor:"blue"
      }}
    >
      <Bottom.Screen
        name="drawerHome"
        component={HomeScreen}
        options={{
          tabBarIcon: (props:BottomTabBarIconProps) => tabBarIcon({ ...props, name: 'home' }),
          headerTitle: 'Home',
          headerTitleAlign: 'center',
          title: 'Home',
        }}
      />

      <Bottom.Screen
        name="drawerTheme"
        component={ThemeScreen}
        options={{
          tabBarIcon: (props:BottomTabBarIconProps) => tabBarIcon({ ...props, name: 'light-mode' }),
          headerTitle: 'Theme',
          headerTitleAlign: 'center',
          title: 'Theme',
        }}
      />

      <Bottom.Screen
        name="userScreen"
        component={UserScreen}
        options={{
          tabBarIcon: (props:BottomTabBarIconProps) => tabBarIcon({ ...props, name: 'group' }),
          headerTitle: 'User-Chat',
          headerTitleAlign: 'center',
          title: 'User-chat',
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomTabNavigate;

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: colors.button.button,
    height: 30,
    width: 70,
    marginRight: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    color: colors.text.inverted,
  },
});
