import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import fireStore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { Images } from '../assets/Images'
import { colors } from '../theme/Colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParamList'
import IconDisplay from '../components/IconPrint/IconDisplay'

interface UserScreenProps {
    navigation : NativeStackNavigationProp<RootStackParamList,'userScreen'> 
}

const UserScreen = ({navigation}:UserScreenProps) => {

    const [users,setUsers] = useState<any[]>([]);
    console.log("users get from data base-->" ,users);
    const [id,setId] = useState<string>();

    useEffect(()=>{
        const userid = auth().currentUser?.uid;
        console.log("id",userid);
        setId(userid);
        const getUsers = async ()=>{
            const getAllUser = await fireStore().collection('users').where('uid','!=',userid).get();
            const allUser = getAllUser.docs.map((item)=>item.data())
            setUsers(allUser);
        }
        getUsers();
    },[])
    console.log("users",users);
    
  return (
      <View style={styles.container}>
        <SafeAreaView>
        <StatusBar barStyle={'dark-content'} />
        <FlatList
            data={users}
            keyExtractor={(item,index)=>index.toString()}
            renderItem={({item})=>(
                <View style={styles.userListContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={Images.user} style={styles.image} />
                    </View>
                    <View style={styles.nameEmailContainer}>
                        <Text style={styles.userValue}>{item.name}</Text>
                        <Text style={styles.userValue}>{item.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.chatIcon} onPress={()=>navigation.navigate("chat",{userId : id, sentToUid : item.uid})}>
                        <IconDisplay name='chat' color="#000" size={40} />
                    </TouchableOpacity>
                </View>
            )} 
        />
        
    </SafeAreaView>
    </View>
  )
}

export default UserScreen

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
        elevation:10,
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
        justifyContent:"center",
    },
    userValue:{
        fontSize:20
    },
    chatIcon:{
        width:50,
        height:50,
        position:"absolute",
        justifyContent:"center",
        alignItems:"center",
        right:0,
        bottom:10

    },
})