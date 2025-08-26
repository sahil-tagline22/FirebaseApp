import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useEffect, useState } from 'react';
import { GetUser } from '../api/requests/RegisterUserRequests';
import { DeleteTask, GetTask, GetTaskById, PostTask, PutTask } from '../api/requests/addTaskRequests';

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
  const [todo,setTodo] = useState([]);
  console.log("🚀 ~ HomeScreen ~ todo:", todo)
  
 
  useEffect(()=>{
  //  getCourantUser();
  //  PostData();
  GetData();
  // GetDataById();
  // PutData();
  // DeleteData();
  },[])

  const getCourantUser = async ()=>{
    try{
      const user = await GetUser();
    }catch(error){
      console.log("🚀 ~ getCourantUser ~ error:", error)
    }
  }
  
  //create data and send to post request in api
  const data = {
    title : 'test1',
    description : 'hello world..!',
    status : 'pending',
    dueDate : new Date() 
  }
  const PostData = async () => {
    try{
      const response = await PostTask(data);
      console.log("🚀 ~ PostData ~ response:", response?.data.data.task)
      setTodo([...todo,response?.data.data.task])
    }catch(error){
      console.log("🚀 ~ PostData ~ error:", error)
    }
  }

  //get all todo 
  const GetData =async ()=>{
    try{
      const response = await GetTask();
      console.log("🚀 ~ GetData ~ response:", response);
      setTodo(response?.data.data.tasks);
    }catch(error){
      console.log("🚀 ~ GetData ~ error:", error);
    }
  }

  //get particular data 
  const GetDataById = async () =>{
    try{
      const response = await GetTaskById('68ad43596c1f8a68c22bf162');
    }catch(error){
      console.log("🚀 ~ GetDataById ~ error:", error)
    }
  }

  //change the value using put requests
  const data1 = {
    title : 'test123',
    description : 'hello world..!',
    status : 'pending',
    dueDate : new Date() 
  }
  const PutData = async () =>{
    try{
      const response = await PutTask('68ad43596c1f8a68c22bf162',data1);
    }catch(error){
      console.log("🚀 ~ GetDataById ~ error:", error)
    }
  }

  //delete data 
  const DeleteData = async ()=>{
    try{
      const response = await DeleteTask('68ad43596c1f8a68c22bf162');
    }catch(error){
      console.log("🚀 ~ DeleteData ~ error:", error)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
      data = {todo}
      keyExtractor = {(item)=>item.id}
      renderItem={({item})=>
        <View>
          <Text>{item.title}</Text>
        </View>
      }
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
