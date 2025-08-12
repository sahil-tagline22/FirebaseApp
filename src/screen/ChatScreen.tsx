import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat'
import auth from '@react-native-firebase/auth'
import fireStore from '@react-native-firebase/firestore'

const ChatScreen = () => {
    const route = useRoute();
    const {sentToName,sentToUid} = route.params;
    const [messages, setMessages] = useState([]);
    const [userId,setUserId] = useState();
 
  useEffect(() => {
    const getUserId = ()=>{
        const getUser = auth().currentUser?.uid;
        console.log("hgdfahdgsfhc",getUser)
        setUserId(getUser);
    }
    getUserId();
  }, [])

  const onSend = (msgArray) => {
    const msg = msgArray[0];
    const userMsg = {
        ...msg,
        sentBy : sentToUid,
        sentTo : userId,
        createAt : new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const chatId = userId > sentToUid ? setUserId + "-" + userId : userId + '-' + setUserId

    fireStore().collection('Chats').doc(chatId).collection('messages').add({...userMsg,createdAt:fireStore.FieldValue.serverTimestamp()});
  };

  const getAllMessage = async () =>{
    const chatId = userId > setUserId ? setUserId+'-'+userId : userId+'-'+sentToUid
    const msgResponse = await fireStore().collection('Chats').doc(chatId).collection('messages').orderBy('createdAt',"desc").get()

    const allTheMsges = msgResponse.docs.map(item=>{
        return{
            ...item.data(),
            createdAt:docSanp.data().createdAt.toData()
        }
    })
    setMessages(allTheMsges)
  }

  useEffect(()=>{
    getAllMessage()
  },[])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: sentToUid,
      }}
    />
  )
}

export default ChatScreen;