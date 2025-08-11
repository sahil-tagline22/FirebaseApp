import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { colors } from '../../theme/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';

// interface FormikYup {
//   values : {email:string,password:string};
//   errors : {email:string,password:string};
//   handleChange : (e: React.ChangeEvent<any>)=> void;
//   touched : {email:string,password:string};
//   handleSubmit : (e?: React.FormEvent<HTMLFormElement> | undefined) => void
// }

const LoginScreen = ({navigation}) => {

  const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: yup.object().shape({
        email: yup
          .string()
          .matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'email is not valid.!')
          .required('please enter email.!'),
        password: yup
          .string()
          .matches(/^.{6,}$/, 'password must be 6 characters')
          .required('please enter password'),
        conformPassword: yup
          .string()
          .oneOf([yup.ref('password')], 'Passwords does not match')
          .required('please enter conformpassword'),
      }),
      onSubmit: values => {
          console.log(values);
          values.email = '';
          values.password = '';
      },
    });

  return (
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>

            <InputText 
              placeHolder={"enter email"} 
              values={formik.values.email} 
              handleChange={formik.handleChange('email')} 
              label={'email'} 
              touched={formik.touched.email} 
              errors={formik.errors.email}
            />

            <InputText 
              placeHolder={"enter password"} 
              values={formik.values.password} 
              handleChange={formik.handleChange('password')} 
              label={'password'} 
              touched={formik.touched.password} 
              errors={formik.errors.password}
            />

            <TouchableOpacity style={styles.loginBtn} onPress={formik.handleSubmit}>
              <Text style={styles.btnText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.textLine}>Dont any account.</Text>
              <Text style={styles.textLogin} onPress={()=>navigation.replace("registration")}>Registration.!</Text>
            </View>

          </View>
        </View>
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
  },
  footer:{
    flexDirection:"row",
    gap:10,
    justifyContent:"center",
    marginTop:10
  },
  textLine:{
    fontSize:15,
    fontWeight:"500"
  },
  textLogin:{
    fontSize:15,
    fontWeight:"500",
    color:colors.text.blue,
    borderBottomWidth:1,
    borderBottomColor:colors.text.blue
  }
});
