import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '../../theme/Colors'
import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';

interface inputTextProps {
  placeHolder : string,
  values : string,
  handleChange :  ((text: string) => void) | undefined,
  label : string,
  touched : boolean | undefined,
  errors : string | undefined
}

const InputText:React.FC<inputTextProps> = ({placeHolder,values,handleChange,touched,errors}) => {
  return (
    <View>
        <TextInput 
            placeholder={placeHolder} 
            style={styles.textInput} 
            value={values} 
            onChangeText={handleChange} 
        />
        {touched && errors && (<Text style={styles.errorText}>{errors}</Text>)}
    </View>
  )
}

export default InputText

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#fff',
    marginHorizontal: w('4%'),
    fontSize: h('2.3%'),
    paddingLeft: w('2%'),
    borderRadius: w('3%'),
    marginTop: w('6%'),
    // marginBottom: 5,
    height:h('6%'),
    borderWidth:w('0.2%')
  },
  errorText:{
    fontSize:h('2%'),
    color:colors.text.danger,
    // marginBottom:-5,
    marginLeft:w('6%')
  }
})