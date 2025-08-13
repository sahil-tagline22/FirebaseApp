import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Images } from '../../assets/Images'
import { colors } from '../../theme/Colors'
import auth from '@react-native-firebase/auth'
import Icon from 'react-native-vector-icons/MaterialIcons'

const CustomDrawer = (props) => {

    const handleLogout = () => {
      auth().signOut();
      console.log('user logout');
    };

    const [user,setUser] = useState();
      useEffect(()=>{
        const userGet = ()=>{
          const user = auth().currentUser;
          setUser(user.email);
          console.log("user",user.email);
        }
        userGet();
      },[])

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image source={Images.user} style={styles.userImage} />
            <Text style={styles.userDetail}>{user}</Text>
        </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.footerContainer} onPress={handleLogout}>
        <Icon name='logout' color="#000" size={25} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"red"
    },
    imageContainer:{
        flex:0.4,
        alignItems:"center",
        // marginBottom:-10,
        borderBottomWidth:2,
        borderBottomColor:colors.separator
    },
    userImage:{
        backgroundColor:colors.screen,
        height:120,
        width:120,
        marginTop:30,
        borderRadius:60
    },
    userDetail:{
        marginTop:5,
        fontSize:18
    },
    footerContainer:{
      paddingBottom:50,
      paddingLeft:30,
      flexDirection:"row",
      alignItems:"center",
      gap:10
    },
    logoutText:{
      fontSize:15
    }
})