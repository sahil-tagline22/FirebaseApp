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
import {getAuth,signInWithEmailAndPassword} from '@react-native-firebase/auth'
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { LoginUser } from '../../api/requests/RegisterUserRequests';
import { setAccessToken, setRefreshToken } from '../../redux/slice/AccessAndRefreshSlice';
import analytics from '@react-native-firebase/analytics'
import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useThemeColor } from '../../hooks/useThemeColor';
import { RFPercentage } from "react-native-responsive-fontsize";


interface LoginScreenProps {
  navigation : NativeStackNavigationProp<RootStackParamList,"login">
}

const LoginScreen = ({navigation}:LoginScreenProps) => {

  const {t} = useAppTranslation();
  const styles = useStyle();

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
              // navigation.replace("bottom");
            }

            //analytics
            await analytics().logEvent('login',{
              email : values.email,
              password : values.password
            })

            //login user, store token in redux-persist
            const data = {
              email : values.email,
              password : values.password
            }
            const response = await LoginUser(data);
            console.log("🚀 ~ LoginScreen ~ response:", response)
            dispatch(setAccessToken(response?.data.data.accessToken))            
            dispatch(setRefreshToken(response?.data.data.refreshToken))            
            navigation.replace("bottom");
            
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
      <KeyboardAwareScrollView>
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
              <Text style={styles.textLogin} onPress={()=>navigation.replace("registration")}>{t('registration_message')}</Text>
            </View>

          </View>
        </View>
      </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const useStyle =()=>{ 
  const color = useThemeColor();
  return StyleSheet.create({
  container: {
    width: w('100%'),
    height: h('100%'),
    backgroundColor: colors.screen,
  },
  loginContainer: {
    backgroundColor: color.backGroundColor,
    width: w('90%'),
    height: h('50%'),
    borderRadius: w('10%'),
    marginVertical:h('25%'),
    alignSelf:"center"
  },
  title: {
    textAlign: 'center',
    fontSize: RFPercentage(5),
    marginTop: h('1%'),
    fontWeight: '700',
    marginBottom:w('5%')
  },
  loginBtn: {
    backgroundColor: colors.button.button,
    height:h('5%'),
    width:w('35%'),
    alignSelf:"center",
    marginTop:h('3%'),
    borderRadius:w('10%'),
    justifyContent:"center",
    alignItems:"center"
  },
  btnText:{
    fontSize:RFPercentage(2.5),
    color : colors.text.inverted
  },
  footer:{
    flexDirection:"row",
    gap:h('0.5%'),
    justifyContent:"center",
    marginTop:h('2%')
  },
  textLine:{
    fontSize:RFPercentage(1.9),
    fontWeight:"500"
  },
  textLogin:{
    fontSize:RFPercentage(1.9),
    fontWeight:"500",
    color:colors.text.blue,
    borderBottomWidth:1,
    borderBottomColor:colors.text.blue
  }

});
}
