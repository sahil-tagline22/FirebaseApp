import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import fireStore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native-gesture-handler';
import { colors } from '../theme/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';

interface ChatScreenProps {
  navigation : NativeStackNavigationProp<RootStackParamList,'chat'>
}

const ChatScreen = ({ navigation }:ChatScreenProps) => {
  const route = useRoute<RouteProp<RootStackParamList,'chat'>>();
  const { userId, sentToUid } = route.params;
  const chatId = [userId, sentToUid].sort().join('_');
  console.log(userId, sentToUid);

  const [messages, setMessages] = useState<any[]>([]);
  console.log("get massage -->",messages);

  useEffect(() => {
    const getAllMsg = async () =>
      await fireStore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(data => {
          const allMsg = data.docs.map(item => {
            return {
              ...item.data(),
              createdAt: item.data().createdAt.toDate(),
            };
          });
          setMessages(allMsg);
        });
    getAllMsg();
  }, [chatId]);

  const onSend = (messagesArray:any[]) => {
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
    fireStore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(userMsg);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={()=>navigation.goBack()}>
          <Icon name='arrow-back-ios-new' color="#000" size={30}  />
        </TouchableOpacity>
        <Text style={styles.textTitle}>Chat</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId,
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    height: 60,
    elevation: 4,
    backgroundColor: 'rgb(255, 255, 255)',
    borderBottomColor: 'rgb(216, 216, 216)',
    borderBottomWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backIcon: {
    marginLeft: 5,
  },
  textTitle: {
    marginLeft: 150,
    fontSize: 20,
  },
});
