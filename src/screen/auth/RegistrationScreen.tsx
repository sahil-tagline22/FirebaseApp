import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../theme/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';

const RegistrationScreen = ({navigation}) => {

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      conformPassword: '',
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
        values.conformPassword = '';
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Registration</Text>

        <InputText
          placeHolder={'Enter email'}
          values={formik.values.email}
          handleChange={formik.handleChange('email')}
          label={'email'}
          touched={formik.touched.email}
          errors={formik.errors.email}
        />

        <InputText
          placeHolder={'Enter password'}
          values={formik.values.password}
          handleChange={formik.handleChange('password')}
          label={'password'}
          touched={formik.touched.password}
          errors={formik.errors.password}
        />

        <InputText
          placeHolder={'Re-enter password'}
          values={formik.values.conformPassword}
          handleChange={formik.handleChange('conformPassword')}
          label={'conformPassword'}
          touched={formik.touched.conformPassword}
          errors={formik.errors.conformPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={formik.handleSubmit}>
          <Text style={styles.btnText}>Registration</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.textLine}>I have already account.</Text>
          <Text style={styles.textLogin} onPress={()=>navigation.replace("login")}>Login.!</Text>
        </View>
        
      </View>
    </View>
  );
};

export default RegistrationScreen;

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
    marginVertical: 220,
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
    height: 40,
    width: 200,
    alignSelf: 'center',
    marginTop: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 20,
    color: colors.text.inverted,
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
