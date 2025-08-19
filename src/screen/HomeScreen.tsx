import { StatusBar, Text, View } from 'react-native'
import { useAppSelector } from '../redux/Store'
import { useEffect, useState } from 'react'
import {getFirestore,collection,getDocs} from '@react-native-firebase/firestore'

const HomeScreen = () => {

  const [users,setUsers] = useState<any[]>([]);
  const user = useAppSelector((state)=>state.auth.user)

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
  },[])
  
  return (
    <View>
      <StatusBar backgroundColor={"red"} />
      <Text>user -: {user?.email}</Text>
    </View>
  )
}

export default HomeScreen

