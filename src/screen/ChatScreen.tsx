import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { Images } from '../assets/Images'
import { colors } from '../theme/Colors'

const ChatScreen = () => {

    const [users,setUsers] = useState(null);

    useEffect(()=>{
        const userid = auth().currentUser?.uid;
        console.log("id",userid);
        const getUsers = async ()=>{
            const getAllUser = await fireStore().collection('users').where('uid','!=',userid).get()
            const allUser = getAllUser.docs.map((item)=>item.data())
            setUsers(allUser);
        }
        getUsers();
    },[])
    console.log("users",users);
    
  return (
    <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} />
        <FlatList
            data={users}
            keyExtractor={(index)=>index}
            renderItem={({item})=>(
                <View style={styles.userListContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={Images.user} style={styles.image} />
                    </View>
                    <View style={styles.nameEmailContainer}>
                        <Text style={styles.userValue}>{item.name}</Text>
                        <Text style={styles.userValue}>{item.email}</Text>
                    </View>
                </View>
            )} 
        />
        
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.background,
    },
    userListContainer:{
        backgroundColor:colors.screen,
        height: 70,
        borderRadius:5,
        marginHorizontal:10,
        marginTop:20,
        flexDirection:"row",
        gap:20,
        shadowColor:"#000",
        elevation:10
    },
    imageContainer:{
        backgroundColor:colors.background,
        height:60,
        width:60,
        borderRadius:30,
        alignItems:"center",
        justifyContent:"center",
        marginTop:5,
        marginLeft:10
    },
    image:{
        height:50,
        width:50,
    },
    nameEmailContainer:{
        justifyContent:"center"
    },
    userValue:{
        fontSize:20
    }
})