import {
  Alert,
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
import { useAppDispatch } from '../../redux/Store';
import { loginUser } from '../../redux/slice/AuthSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
// import { getApp } from '@react-native-firebase/app';
import {getAuth,signInWithEmailAndPassword} from '@react-native-firebase/auth'

import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18nextConfig';
const initI18n = i18n;


interface LoginScreenProps {
  navigation : NativeStackNavigationProp<RootStackParamList,"login">
}

const LoginScreen = ({navigation}:LoginScreenProps) => {

  const {t,i18n} = useTranslation();

  const dispatch = useAppDispatch();

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
      }),

      onSubmit: async (values) => {
          try {
            const auth = getAuth();
            const user = await signInWithEmailAndPassword(auth,values.email,values.password)
            console.log("login user -->",user);
            if(user){
              dispatch(loginUser(user.user));
              navigation.replace("bottom");
            }
            values.email = '';
            values.password = '';

          } catch (error:any) {
            if(error.code === "auth/invalid-credential"){
              Alert.alert("Alert","email and password invalid")
            }else{
              console.log(error);
            }
          }

      },
    });

  return (
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <Text style={styles.title}>{t('login_title')}</Text>

            <InputText 
              placeHolder={t("enter_email")} 
              values={formik.values.email} 
              handleChange={formik.handleChange('email')} 
              label={'email'} 
              touched={formik.touched.email} 
              errors={formik.errors.email}
            />

            <InputText 
              placeHolder={t("enter_password")} 
              values={formik.values.password} 
              handleChange={formik.handleChange('password')} 
              label={'password'} 
              touched={formik.touched.password} 
              errors={formik.errors.password}
            />

            <TouchableOpacity style={styles.loginBtn} onPress={formik.handleSubmit}>
              <Text style={styles.btnText}>{t('login_btn')}</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.textLine}>{t('dont_any_account')}</Text>
              <Text style={styles.textLogin} onPress={()=>navigation.replace("registration")}>{t('Registration_message')}</Text>
            </View>

          </View>
        </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 40,
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
