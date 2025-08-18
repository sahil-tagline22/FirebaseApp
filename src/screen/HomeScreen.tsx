import { Text, View } from 'react-native'
import { useAppSelector } from '../redux/Store'

const HomeScreen = () => {

  const user = useAppSelector((state)=>state.auth.user)
  
  return (
    <View>
      <Text>user -: {user?.email}</Text>
    </View>
  )
}

export default HomeScreen

