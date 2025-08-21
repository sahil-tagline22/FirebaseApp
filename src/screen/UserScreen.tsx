import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '../assets/Images'
import { colors } from '../theme/Colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParamList'
import IconDisplay from '../components/IconPrint/IconDisplay'
import { getApp } from '@react-native-firebase/app'
import {getFirestore,collection,query,where,getDocs} from '@react-native-firebase/firestore'
import {getAuth} from '@react-native-firebase/auth'
import { useThemeColor } from '../hooks/useThemeColor'

interface UserScreenProps {
    navigation : NativeStackNavigationProp<RootStackParamList,'userScreen'> 
}

const UserScreen = ({navigation}:UserScreenProps) => {

    const [users,setUsers] = useState<any[]>([]);
    console.log("users get from data base-->" ,users);
    const [id,setId] = useState<string>();
    const color = useThemeColor();
    const styles = useStyle();

    useEffect(()=>{
        const fetchUser = async()=>{ 
            const app = getApp();
            const auth = getAuth(app);
            const fireStore = getFirestore(app);

            const userid = auth.currentUser?.uid;
            console.log("id",userid);
            setId(userid);
            if(userid){
                const usersRef = collection(fireStore,'users');
                const q = query(usersRef,where('uid', '!=',userid ));
                const users = await getDocs(q);
                
                const allUsers = users.docs.map(item=>item.data());
                setUsers(allUsers);
            }
        }
        fetchUser();
    },[])
    console.log("users",users);
    
  return (
      <View style={styles.container}>
        <SafeAreaView>
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
                    <TouchableOpacity style={styles.chatIcon} onPress={()=>navigation.navigate("chat",{userId : id!, sentToUid : item.uid})}>
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



const useStyle = ()=>{
    const color = useThemeColor();

    return StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:color.backGroundColor,
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
}