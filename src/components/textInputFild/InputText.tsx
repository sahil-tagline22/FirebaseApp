import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { colors } from '../../theme/Colors'
import { heightScale, moderateScale, widthScale } from '../../hooks/useDimensions';

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
    fontSize: moderateScale(18),
    paddingLeft: widthScale(10),
    borderRadius: moderateScale(10),
    marginTop: widthScale(15),
    height:heightScale(50),
    borderWidth:moderateScale(1)
  },
  errorText: {
    fontSize: heightScale(15),
    color: colors.text.danger,
    marginTop: heightScale(5), 
    marginLeft: widthScale(8),
  },
})