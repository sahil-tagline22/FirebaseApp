import { Text, View } from 'react-native'
import { useAppSelector } from '../redux/Store'
import { useEffect, useState } from 'react'
import fireStore from '@react-native-firebase/firestore'

const HomeScreen = () => {

  const [users,setUsers] = useState<any[]>([]);
  const user = useAppSelector((state)=>state.auth.user)

  useEffect(()=>{
    const getAllUser = async()=>{
      const getUsers = await fireStore().collection('users').get();
      const user = getUsers.docs.map((item)=>item.data())
      setUsers(user);
      console.log("all user ger -->", users);
    }
    getAllUser();
  },[])
  
  return (
    <View>
      <Text>user -: {user?.email}</Text>
    </View>
  )
}

export default HomeScreen

