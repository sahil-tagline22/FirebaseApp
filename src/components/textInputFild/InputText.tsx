import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '../../theme/Colors'

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
    marginHorizontal: 10,
    fontSize: 20,
    paddingLeft: 10,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 5,
  },
  errorText:{
    fontSize:15,
    color:colors.text.danger,
    marginBottom:-10,
    marginLeft:15
  }
})