import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import {  useEffect, useState } from 'react';
import { deleteUserData, getUserData, patchUserData, postUserData, putUserData } from '../api/requests/userRequests';
import { userDeleteData, userGetData, userPatchData, userPostData, userPutData } from '../api/requests/axiosRuests';

export type ApiData = {
  id : string;
  name : string;
  email : string;
  phone: string;
  address : string;
  company : string
};

const HomeScreen = () => {
  const [user, setUser] = useState<ApiData[]>([]);
  const styles = useStyle();
  const color = useThemeColor();

  
  const userDataGet = async () =>{
    const data = await getUserData();
    // const data = await userGetData();
    console.log("🚀 ~ userDataGet ~ data:", data);
    setUser(data);
  }
  
  const userDataPost =  async () => {
    const data = await postUserData();
    // const data = await userPostData();
    console.log("🚀 ~ userDataPost ~ data:", data)
  };
  
  const userDataPut = async () => {
    const data = await putUserData();
    // const data = await userPutData();
    console.log("🚀 ~ userDataPut ~ data:", data);
  };
  
  const userDataPatch = async () => {
    const data = await patchUserData();
    // const data = await userPatchData();
    console.log("🚀 ~ userDataPatch ~ data:", data);
  };
  
  const userDataDelete = async () =>{
    const data = await deleteUserData(20);
    // const data = await userDeleteData();
    console.log("🚀 ~ userDataDelete ~ data:", data);
  }

  useEffect(() => {
    // userDataGet();
    // userDataPost();
    // userDataPut();
    userDataPatch();
    // userDataDelete();
  }, []);

  const renderItem = (item: ApiData) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.textContainer}>id :- {item.id}</Text>
        <Text style={styles.textContainer}>name :- {item.name}</Text>
        <Text style={styles.textContainer}>email :- {item.email}</Text>
        <Text style={styles.textContainer}>phone :- {item.phone}</Text>
        <Text style={styles.textContainer}>address :- {item.address}</Text>
        <Text style={styles.textContainer}>company :- {item.company}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={user}
        keyExtractor={item => item.id}
        renderItem={({ item }) => renderItem(item)}
      />
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
