import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useEffect, useState } from 'react';
import { deleteUserData, getUserData, patchUserData, postUserData, putUserData } from '../api/requests/userRequests';

export type ApiData = {
  id : string;
  name : number;
  email : string;
  phone: string;
  address : string;
  company : string
};

const HomeScreen = () => {
  const [user, setUser] = useState<ApiData[]>([]);
  const styles = useStyle();
  const color = useThemeColor();

  useEffect(() => {
    userDataGet();
    // userDataPost();
    // userDataPut();
    // userDataPatch();
    userDataDelete();
  }, []);

  const userDataGet = async () =>{
    const data = await getUserData();
    console.log("get data print -->",data);
    setUser(data);
  }

  const userDataPost = async () => {
    const data = await postUserData();
    console.log('post data print --> ', data);
  };

  const userDataPut = async () => {
    const data = await putUserData();
    console.log('put data print --> ', data);
  };

  const userDataPatch = async () => {
    const data = await patchUserData();
    console.log('patch data print --> ', data);
    setUser(data);
  };

  const userDataDelete = async () =>{
    const data = await deleteUserData();
    console.log("user data delete successfully...!",data)
  }

  const renderItem = (item: ApiData) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.textContainer}>User id :- {item.id}</Text>
        <Text style={styles.textContainer}>User name :- {item.name}</Text>
        <Text style={styles.textContainer}>User email :- {item.email}</Text>
        <Text style={styles.textContainer}>User phone :- {item.phone}</Text>
        <Text style={styles.textContainer}>User address :- {item.address}</Text>
        <Text style={styles.textContainer}>User company :- {item.company}</Text>
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
    },
    textContainer: {
      color: color.text,
    },
  });
};
