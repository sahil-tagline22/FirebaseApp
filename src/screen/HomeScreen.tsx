import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useEffect } from 'react';
import { GetUser } from '../api/requests/RegisterUserRequests';
import { PostTask } from '../api/requests/addTaskRequests';

export type ApiData = {
  id : string;
  name : string;
  email : string;
  phone: string;
  address : string;
  company : string
};

const HomeScreen = () => {

  const styles = useStyle();
  const color = useThemeColor();

  useEffect(()=>{
   getCourantUser();
  },[])

  const getCourantUser = async ()=>{
    try{
      const user = await GetUser();
    }catch(error){
      console.log("🚀 ~ getCourantUser ~ error:", error)
    }
    // console.log("🚀 ~ HomeScreen ~ getCourantUser:", user?.data.data.user.id)
    // console.log("🚀 ~ HomeScreen ~ getCourantUser:", user?.data.data.user.name)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textContainer}>hello</Text>
    </View>
  );
};

export default HomeScreen;

const useStyle = () => {
  const color = useThemeColor();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backGroundColor,
    },
    itemContainer: {
      flex: 1,
      backgroundColor: color.backGroundColor,
      marginHorizontal: 10,
      paddingHorizontal: 10,
      marginTop: 10,
      height: 150,
      borderRadius: 10,
      gap: 2,
      justifyContent: 'center',
      borderColor: color.borderColor,
      borderWidth: 1,
      marginBottom:15
    },
    textContainer: {
      color: color.text,
    },
  });
};
