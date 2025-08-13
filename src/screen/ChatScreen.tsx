import { useRoute } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import fireStore from '@react-native-firebase/firestore'

const ChatScreen = () => {

  const route = useRoute();
  const {userId,sentToUid} = route.params;
  console.log(userId,sentToUid);

  const [messages, setMessages] = useState([])
  console.log("massages",messages);

  useEffect(() => {
    const getAllMsg = async ()=>{
      const msg = await fireStore().collection('chats').doc('123456789').collection('messages').orderBy('createdAt','desc').get()
      console.log("msg", msg);

      const allMsgMap = msg.docs.map(item=>{
        return{
          ...item.data(),
          createdAt :item.data.createdAt
        };
      });
      setMessages(allMsgMap);
    }
    getAllMsg();
  }, [])

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
    fireStore().collection('chats').doc('123456789').collection('messages').add(userMsg);
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