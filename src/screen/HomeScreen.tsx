import { StyleSheet, Text, View } from 'react-native'
import { useAppSelector } from '../redux/Store'
import { useEffect, useState } from 'react'
import {getFirestore,collection,getDocs} from '@react-native-firebase/firestore'
import { useThemeColor } from '../hooks/useThemeColor'

const HomeScreen = () => {

  const styles = useStyle();
  const [users,setUsers] = useState<any[]>([]);
  const user = useAppSelector((state)=>state.auth.user)
  const color = useThemeColor();
  
  useEffect(()=>{
    const getAllUser = async()=>{
      try{
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db,'users'));
        const allUser = querySnapshot.docs.map(item=>item.data())
        setUsers(allUser);
      }
      catch(error){
        console.log("error",error);
      }
      console.log("all user ger -->", users);
    }
    getAllUser();
  },[users])
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>user -: {user?.email}</Text>
    </View>
  )
}

export default HomeScreen

const useStyle = () =>{
  const color = useThemeColor();

  return StyleSheet.create({
    container:{
      flex:1,
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:color.backGroundColor
    },
    text:{
      fontSize:20,
      color: color.text
    }
  })
}
