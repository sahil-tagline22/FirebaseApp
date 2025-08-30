import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native-gesture-handler';
import { colors } from '../theme/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from '@react-native-firebase/firestore';
import { Images } from '../assets/Images';
import { useAppTranslation } from '../hooks/useAppTranslation';
import { useThemeColor } from '../hooks/useThemeColor';
import { useAppSelector } from '../redux/Store';
import analytics from '@react-native-firebase/analytics';

interface ChatScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'chat'>;
}

const ChatScreen = ({ navigation }: ChatScreenProps) => {

  const route = useRoute<RouteProp<RootStackParamList, 'chat'>>();
  const { userId, sentToUid } = route.params;
  const chatId = [userId, sentToUid].sort().join('_');
  console.log(userId, sentToUid);

  const [messages, setMessages] = useState<IMessage[]>([]);
  console.log('get massage -->', messages);

  const {t} = useAppTranslation();
  const color = useThemeColor();
  const styles = useStyle();

  //analytics
  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'ChatScreen',
      screen_class: 'ChatScreen',
    });
    
  }, []);

  useEffect(() => {
    const app = getApp();
    const fireStore = getFirestore(app);

    const massage = collection(
      doc(collection(fireStore, 'chats'), chatId),
      'messages',
    );

    const q = query(massage, orderBy('createdAt', 'desc'));

    const getAllMsg = onSnapshot(q, data => {
      const allMsg = data.docs.map(item => ({
        ...item.data(),
        createdAt: item.data().createdAt.toDate(),
      }));
      setMessages(allMsg);
    });

    return getAllMsg;
  }, [chatId]);

  const onSend = async (messagesArray: any[]) => {
    console.log(messagesArray);
    const msg = messagesArray[0];
    const userMsg = {
      ...msg,
      sentBy: userId,
      sentTo: sentToUid,
      createdAt: new Date(),
    };
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, userMsg),
    );
    const app = getApp();
    const fireStore = getFirestore(app);
    const masses = collection(
      doc(collection(fireStore, 'chats'), chatId),
      'messages',
    );

    await addDoc(masses, userMsg);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back-ios-new" color={color.text} size={30} />
            </TouchableOpacity>
            <Text style={styles.textTitle}>Chat</Text>
          </View>
          <GiftedChat
            placeholder={t('enter_value')}
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: userId,
              avatar: Images.user,
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const useStyle = () =>{
  const color = useThemeColor();
  const theme = useAppSelector(state=> state.theme.theme);
  const mobileTheme = useColorScheme();

  return StyleSheet.create({

    header: {
      height: 60,
      elevation: 4,
      // backgroundColor: 'rgb(255, 255, 255)',
      borderBottomColor: theme === "light" || mobileTheme === "light" ? 'rgb(216, 216, 216)' : "",
      backgroundColor:color.header,
      borderBottomWidth: 2,
      alignItems: 'center',
      flexDirection: 'row',
    },
    container: {
      flex: 1,
      backgroundColor: color.backGroundColor,
    },
    backIcon: {
      marginLeft: 5,
    },
    textTitle: {
      marginLeft: 150,
      fontSize: 20,
      color:color.text
    },
  });
}
