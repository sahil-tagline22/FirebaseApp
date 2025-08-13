import { useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import fireStore from '@react-native-firebase/firestore'

const ChatScreen = () => {

  const route = useRoute();
  const {userId,sentToUid} = route.params;
  const chatId = [userId,sentToUid].sort().join('_');
  console.log(userId,sentToUid);

  const [messages, setMessages] = useState([])
  console.log("massages",messages);

  useEffect(() => {
      const getAllMsg = async() => await fireStore().collection('chats').doc(chatId).collection('messages').orderBy('createdAt','desc').onSnapshot((data)=>{
          const allMsg = data.docs.map((item)=>{
            return{
              ...item.data(),createdAt : item.data().createdAt.toDate()
            }
          })
          setMessages(allMsg)
        })
      getAllMsg();
  }, [chatId])

  const onSend = (messagesArray) => {
    console.log(messagesArray);
    const msg = messagesArray[0];
    const userMsg = {
      ...msg,
      sentBy : userId,
      sentTo : sentToUid,
      createdAt : new Date()
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, userMsg),
    )
    fireStore().collection('chats').doc(chatId).collection('messages').add(userMsg);
  };

  return(
    <View style={{flex:1}}>
      <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: userId,
      }}
    />
    </View>
  )
}

export default ChatScreen;