import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Images } from '../../assets/Images';
import { colors } from '../../theme/Colors';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector } from '../../redux/Store';

const CustomDrawer = ({ navigation, props }) => {
  const loginUser = useAppSelector(state => state.auth.user);
  console.log('login user email get in home screen -->', loginUser?.email);

  const handleLogout = () => {
    auth().signOut();
    navigation.replace('login');
    console.log('user logout');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={Images.user} style={styles.userImage} />
        <Text style={styles.userDetail}>{loginUser?.email}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.footerContainer} onPress={handleLogout}>
        <Icon name="logout" color="#000" size={25} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    flex: 0.3,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: -40,
    borderBottomWidth: 2,
    borderBottomColor: colors.separator,
  },
  userImage: {
    backgroundColor: colors.screen,
    height: 120,
    width: 120,
    marginTop: 30,
    borderRadius: 60,
  },
  userDetail: {
    marginTop: 5,
    fontSize: 18,
  },
  footerContainer: {
    paddingBottom: 50,
    paddingLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 15,
  },
});
