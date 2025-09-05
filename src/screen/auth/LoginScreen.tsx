import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { FacebookAuthProvider } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';


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
            //backAnd side user store 
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

    //useLogin with google authentication-------------->
    useEffect(()=>{
      GoogleSignin.configure({
        webClientId: '742734159624-k1vf8d1j883lb09kijmpmmcdcok4jje8.apps.googleusercontent.com',
      });
    },[])

  const  onGoogleButtonPress =async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    console.log("🚀 ~ onGoogleButtonPress ~ signInResult:", signInResult)

    // Try the new style of google-sign in result, from v13+ of that module
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
      console.log("🚀 ~ onGoogleButtonPress ~ idToken:", idToken)
    }
    if (!idToken) {
      throw new Error('No ID token found');
    }

    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);
    console.log("🚀 ~ onGoogleButtonPress ~ googleCredential:", googleCredential)

    // Sign-in the user with the credential
    return signInWithCredential(getAuth(), googleCredential);
  }



  //user login with faceBook---------------->
  const onFacebookButtonPress = async () => {
    try{
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log("🚀 ~ onFacebookButtonPress ~ result:", result)

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccessToken
      const data = await AccessToken.getCurrentAccessToken();
      console.log("🚀 ~ onFacebookButtonPress ~ data:", data)

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      console.log("🚀 ~ onFacebookButtonPress ~ facebookCredential:", facebookCredential)

      const user = await signInWithCredential(getAuth(), facebookCredential);
      console.log("🚀 ~ onFacebookButtonPress ~ user:", user)

      // Sign-in the user with the credential
      return user.user
    }catch(error){
      console.log("🚀 ~ onFacebookButtonPress ~ error:", error)
    }
  }

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

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.googleBtnContainer} onPress={onGoogleButtonPress}>
                <Text style={styles.googleLoginBtnText}>Google Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.googleBtnContainer} onPress={onFacebookButtonPress}>
                <Text style={styles.googleLoginBtnText}>FaceBook Login</Text>
              </TouchableOpacity>
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
  },
  googleBtnContainer:{
    backgroundColor : colors.button.button,
    height : h('4%'),
    width : w('30%'),
    borderRadius : w('1%'),
    marginLeft : 50,
    marginTop : 10,
    justifyContent:'center',
    alignItems : 'center'
  },
  googleLoginBtnText:{
    fontSize : h('1.8%'),
    color : colors.text.inverted
  },
  socialContainer:{
    flexDirection:"row"
  }

});
}
