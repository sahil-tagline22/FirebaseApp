import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { useCallback, useEffect, useState } from 'react';
// import { GetUser } from '../api/requests/RegisterUserRequests';
import {
  DeleteTask,
  GetTask,
  GetTaskById,
  PostTask,
  PutTask,
} from '../api/requests/addTaskRequests';
import Icon from 'react-native-vector-icons/MaterialIcons';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { useAppSelector } from '../redux/Store';
import { Scale } from '../hooks/useScale';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

export type ApiData = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'pending' | 'success';
};

type NewTaskData = {
  title: string;
  description: string;
  status: 'pending' | 'success';
  dueDate: Date;
};

const HomeScreen = () => {
  const styles = useStyle();
  const color = useThemeColor();
  const [todo, setTodo] = useState<ApiData[]>([]);
  console.log('🚀 ~ HomeScreen ~ todo:', todo);

  const [title, setTitle] = useState<string>('');
  const [discretion, setDiscretion] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [editTodo, setEditTodo] = useState<boolean>(false);

  const user = useAppSelector(state => state.auth.user);
  console.log('🚀 ~ HomeScreen ~ user:', user);

  //analytics
  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'HomeScreen',
      screen_class: 'HomeScreen',
    });
    crashlytics().log('AboutScreen mounted');
    // crashlytics().crash();
  }, []);

  //get all todo
  const GetData = useCallback(async () => {
    try {
      const response = await GetTask();
      console.log('🚀 ~ GetData ~ response:', response);
      setTodo(response?.data.data.tasks);
    } catch (error) {
      console.log('🚀 ~ GetData ~ error:', error);
    }
  }, []);

  //create data and send to post request in api
  const data = {
    title: title,
    description: discretion,
    status: 'pending',
    dueDate: new Date(),
  };
  const PostData = async () => {
    try {
      const response = await PostTask(data);
      console.log('🚀 ~ PostData ~ response:', response?.data.data.task);
      setTodo([...todo, response?.data.data.task]);
      setTitle('');
      setDiscretion('');
    } catch (error) {
      console.log('🚀 ~ PostData ~ error:', error);
    }
  };

  //delete data
  const DeleteData = async (id: string): Promise<void> => {
    try {
      const response: { success: boolean; message: string } = await DeleteTask(
        id,
      );
      if (response.success === true) {
        const todos = todo.filter(item => item.id !== id);
        setTodo(todos);
      }
    } catch (error) {
      console.log('🚀 ~ DeleteData ~ error:', error);
    }
  };

  //get particular data
  const GetDataById = async (id: string): Promise<void> => {
    try {
      const response: { task: ApiData } = await GetTaskById(id);
      console.log('🚀 ~ GetDataById ~ response:', response.task);
      setTitle(response.task.title);
      setDiscretion(response.task.description);
      setSelectedId(id);
      setEditTodo(true);
    } catch (error) {
      console.log('🚀 ~ GetDataById ~ error:', error);
    }
  };

  //change the value using put requests
  const data1 = {
    title: title,
    description: discretion,
    status: 'pending',
    dueDate: new Date(),
  };
  const PutData = async () => {
    try {
      const response = await PutTask(selectedId, data1);
      console.log('🚀 ~ PutData ~ response:', response.task.title);
      if (response.task) {
        const getTodo = todo.map(item =>
          item.id === selectedId
            ? {
                ...item,
                title: response.task.title,
                description: response.task.description,
              }
            : item,
        );
        setTodo(getTodo);
      }
      setTitle('');
      setDiscretion('');
      setSelectedId('');
      setEditTodo(false);
    } catch (error) {
      console.log('🚀 ~ GetDataById ~ error:', error);
    }
  };

  useEffect(() => {
    GetData();
  }, [GetData]);

  //todo status update
  const handleClick = async (item: ApiData): Promise<void> => {
    const updateData: NewTaskData = {
      title: item.title,
      description: item.description,
      status: 'success',
      dueDate: new Date(),
    };
    try {
      const response: { task: ApiData } = await PutTask(item.id, updateData);
      console.log('🚀 ~ handleClick ~ response:', response);
      if (response.task) {
        const updatedTodo = todo.map<ApiData>(allTodo =>
          allTodo.id === item.id ? { ...allTodo, status: 'success' } : allTodo,
        );
        setTodo(updatedTodo);
      }
    } catch (error) {
      console.log('🚀 ~ GetDataById ~ error:', error);
    }
  };

  // display all todo
  const renderItemList = ({ item }: { item: ApiData }) => (
    <View style={styles.listContainer}>
      <View style={styles.checkOurUncheckContainer}>
        {item.status === 'pending' ? (
          <TouchableOpacity onPress={() => handleClick(item)}>
            <Icon
              name="radio-button-unchecked"
              size={30}
              color={color.borderColor}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={true}>
            <Icon name="check" size={30} color={color.borderColor} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text style={styles.listText}>{item.title}</Text>
        <Text style={styles.listText}>{item.description}</Text>
      </View>
      <View style={styles.deleteEditBtn}>
        {item.status === 'pending' ? (
          <TouchableOpacity
            style={styles.deleteEditBtnContainer}
            onPress={() => GetDataById(item.id)}
          >
            <Icon name="edit" size={30} color={color.text} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={styles.deleteEditBtnContainer}
          onPress={() => DeleteData(item.id)}
        >
          <Icon name="delete" size={30} color={color.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.titleInputfield}
          placeholder="Enter title"
          placeholderTextColor={color.text}
          onChangeText={setTitle}
          value={title}
        />
        <TextInput
          style={styles.desInputfield}
          placeholder="Enter description"
          placeholderTextColor={color.text}
          onChangeText={setDiscretion}
          value={discretion}
        />
        {editTodo ? (
          <TouchableOpacity style={styles.btnContainer} onPress={PutData}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnContainer} onPress={PostData}>
            <Text style={styles.btnText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={todo}
        keyExtractor={item => item.id}
        renderItem={renderItemList}
      />

      <BannerAd
        unitId={TestIds.BANNER} // 👈 Use real Ad Unit ID in production
        size={BannerAdSize.FULL_BANNER}
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
      justifyContent: 'flex-end',
      // alignItems:'center'
    },
    inputContainer: {
      // flex:1,
      height: Scale(200),
      backgroundColor: color.backGroundColor,
      alignItems: 'center',
      borderBottomColor: color.borderColor,
      borderBottomWidth: Scale(3),
    },
    titleInputfield: {
      borderWidth: Scale(1),
      borderColor: color.borderColor,
      height: Scale(45),
      width: Scale(370),
      marginTop: Scale(20),
      paddingHorizontal: Scale(10),
      fontSize: Scale(23),
      color: color.text,
    },
    desInputfield: {
      borderWidth: Scale(1),
      borderColor: color.borderColor,
      height: Scale(45),
      width: Scale(370),
      marginTop: Scale(20),
      paddingHorizontal: Scale(10),
      fontSize: Scale(23),
      color: color.text,
    },
    btnContainer: {
      backgroundColor: color.btnColor,
      height: Scale(40),
      width: Scale(100),
      marginTop: Scale(15),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Scale(10),
    },
    btnText: {
      fontSize: Scale(20),
      color: color.text,
    },
    listContainer: {
      backgroundColor: color.backGroundColor,
      height: Scale(80),
      marginTop: Scale(10),
      paddingLeft: Scale(15),
      borderRadius: Scale(20),
      borderColor: color.borderColor,
      borderWidth: Scale(2),
      marginHorizontal: Scale(3),
      marginBottom: Scale(5),
      alignItems: 'center',
      flexDirection: 'row',
    },
    listText: {
      fontSize: Scale(20),
      color: color.text,
    },
    deleteEditBtnContainer: {
      marginRight: Scale(10),
    },
    deleteEditBtn: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    checkOurUncheckContainer: {
      marginRight: Scale(10),
    },
  });
};
