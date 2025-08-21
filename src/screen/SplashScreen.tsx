import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Images } from '../assets/Images'

const CustomScreen = () => {
  return (
   
        <LinearGradient colors={['#29f29b','#03a4f6']} style={styles.linearGradient}> 
            <View style={styles.imageContainer}>
                <Image source={Images.splashIcon} style={styles.image}  />
                <Text style={styles.titleText}>Live Chat</Text>
            </View>
       </LinearGradient> 
    
  )
}

export default CustomScreen

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    linearGradient:{
        flex:1,
        paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
    },
    image:{
        height:200,
        width:200
    },
    imageContainer:{
        flex:1,
        position:"absolute",
        top:200,
        right:110,
        alignItems:"center"
    },
    titleText:{
        marginTop:20,
        fontSize:50,
        
    }
})