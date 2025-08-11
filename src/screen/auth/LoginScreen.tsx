import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { colors } from '../../theme/Colors';
import { Formik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';

// interface FormikYup {
//   values : {email:string,password:string};
//   errors : {email:string,password:string};
//   handleChange : (e: React.ChangeEvent<any>)=> void;
//   touched : {email:string,password:string};
//   handleSubmit : (e?: React.FormEvent<HTMLFormElement> | undefined) => void
// }

const LoginScreen = () => {
  return (
    <Formik
      initialValues={{
        email : '',
        password : ''
      }}

      onSubmit={(values) => {
        console.log(values);
        values.email = ""
        values.password = ""
      }}

      validationSchema={yup.object().shape({
        email : yup.string()
                  .matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'email is not valid.!')
                  .required('please enter email.!'),
        password : yup.string()
                      .matches(/^.{6,}$/,'password must be 6 characters')
                      .required('please enter password')
      })}>

      {({values,errors,handleChange,touched,handleSubmit,})=>(
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>

            {/* <TextInput 
              placeholder="Enter email" 
              style={styles.textInput} 
              value={values.email} 
              onChangeText={handleChange('email')} 
            />
            {touched.email && errors.email && (<Text style={styles.errorText}>{errors.email}</Text>)} */}

            <InputText 
              placeHolder={"enter email"} 
              values={values.email} 
              handleChange={handleChange('email')} 
              label={'email'} 
              touched={touched.email} 
              errors={errors.email}
            />

            <InputText 
              placeHolder={"enter password"} 
              values={values.password} 
              handleChange={handleChange('password')} 
              label={'password'} 
              touched={touched.password} 
              errors={errors.password}
            />


            {/* <TextInput placeholder="Enter password" style={styles.textInput} value={values.password} onChangeText={handleChange('password')} />
            {touched.password && errors.password && (<Text style={styles.errorText}>{errors.password}</Text>)} */}

            <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </Formik>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: colors.background,
  },
  loginContainer: {
    backgroundColor: colors.screen,
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 250,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 20,
    fontWeight: '700',
  },
  // textInput: {
  //   backgroundColor: '#fff',
  //   marginHorizontal: 10,
  //   fontSize: 20,
  //   paddingLeft: 10,
  //   borderRadius: 10,
  //   marginTop: 30,
  //   marginBottom: 5,
  // },
  loginBtn: {
    backgroundColor: colors.button.button,
    height:40,
    width:200,
    alignSelf:"center",
    marginTop:35,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center"
  },
  btnText:{
    fontSize:20,
    color : colors.text.inverted
  },
  errorText:{
    fontSize:15,
    color:"red",
    marginBottom:-10,
    marginLeft:15
  }
});
