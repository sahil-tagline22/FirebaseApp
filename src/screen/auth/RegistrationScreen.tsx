import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAppDispatch } from '../../redux/Store';
import { loginUser } from '../../redux/slice/AuthSlice';
import {getAuth,createUserWithEmailAndPassword} from '@react-native-firebase/auth'
import { getApp } from '@react-native-firebase/app';
import {getFirestore,doc,setDoc} from '@react-native-firebase/firestore'
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { RegisterUser } from '../../api/requests/RegisterUserRequests';
import { setAccessToken, setRefreshToken } from '../../redux/slice/AccessAndRefreshSlice';
import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';
import { useThemeColor } from '../../hooks/useThemeColor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RFPercentage } from "react-native-responsive-fontsize";

interface RegistrationScreenProps {
  navigation : NativeStackNavigationProp<RootStackParamList,'registration'>
}

const RegistrationScreen = ({navigation}:RegistrationScreenProps) => {

  const {t} = useAppTranslation();
  const styles = useStyle();

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name:'',
      email: '',
      password: '',
      conformPassword: '',
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required('please enter name.!'),
      email: yup
        .string()
        .matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'email is not valid.!')
        .required('please enter email.!'),
      password: yup
        .string()
        .matches(/^.{6,}$/, 'password must be 6 characters')
        .required('please enter password.!'),
      conformPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords does not match')
        .required('please enter conformpassword.!'),
    }),
    onSubmit: async (values) => {
        try{

          //create new user
          const app = getApp();
          const auth = getAuth(app);
          const newUser =  await createUserWithEmailAndPassword(auth,values.email,values.password)
          if(newUser){
            dispatch(loginUser(newUser.user));
            navigation.replace("bottom");
          }

          //store user in firebase
          const db = getFirestore(app);
          await setDoc(doc(db,'users',newUser.user.uid),{
            name : values.name,
            email : newUser.user.email,
            uid : newUser.user.uid
          });

          //accessToken and refreshToken save in redux-persist
          const data = {
            name : values.name,
            email : values.email,
            password : values.password
          }
          const response = await RegisterUser(data);
          console.log("🚀 ~ RegistrationScreen ~ response:", response)
          dispatch(setAccessToken(response?.data.data.accessToken))
          dispatch(setRefreshToken(response?.data.data.refreshToken))

          values.name = '';
          values.email = '';
          values.password = '';
          values.conformPassword = '';
          
        }catch(error:any){
          if(error.code === "auth/email-already-in-use"){
            Alert.alert("Alert","The email address is already in use by another account.")
          }
          console.log("error",error)
        }
    },
  });

  return (
    <KeyboardAwareScrollView>
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>{t('registration_title')}</Text>

        <InputText
          placeHolder={t('enter_userName')}
          values={formik.values.name}
          handleChange={formik.handleChange('name')}
          label={'name'}
          touched={formik.touched.name}
          errors={formik.errors.name}
        />
        
        <InputText
          placeHolder={t('enter_email')}
          values={formik.values.email}
          handleChange={formik.handleChange('email')}
          label={'email'}
          touched={formik.touched.email}
          errors={formik.errors.email}
        />

        <InputText
          placeHolder={t('enter_password')}
          values={formik.values.password}
          handleChange={formik.handleChange('password')}
          label={'password'}
          touched={formik.touched.password}
          errors={formik.errors.password}
        />

        <InputText
          placeHolder={t('re_enter_password')}
          values={formik.values.conformPassword}
          handleChange={formik.handleChange('conformPassword')}
          label={'conformPassword'}
          touched={formik.touched.conformPassword}
          errors={formik.errors.conformPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={formik.handleSubmit}>
          <Text style={styles.btnText}>{t('registration_btn')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.textLine}>{t('i_have_account')}</Text>
          <Text style={styles.textLogin} onPress={()=>navigation.replace("login")}>{t('login_message')}</Text>
        </View>
        
      </View>
    </View>
    </KeyboardAwareScrollView>
  );
};

export default RegistrationScreen;

const useStyle = ()=>{
    const color = useThemeColor();
  return  StyleSheet.create({
  container: {
    width: w('100%'),
    height: h('100%'),
    backgroundColor: colors.screen,
  },
  loginContainer: {
    backgroundColor: color.backGroundColor,
    width: w('90%'),
    height: h('70%'),
    borderRadius: w('10%'),
    marginTop:h('20%'),
    alignSelf:"center"
  },
  title: {
    textAlign: 'center',
    fontSize: RFPercentage(5),
    marginTop: h('1%'),
    fontWeight: '700',
    // marginBottom:w('5%')
  },
  loginBtn: {
    backgroundColor: colors.button.button,
    height:h('5%'),
    width:w('40%'),
    alignSelf:"center",
    marginTop:h('3%'),
    borderRadius:w('10%'),
    justifyContent:"center",
    alignItems:"center"
  },
  btnText: {
    fontSize: RFPercentage(2.5),
    color: colors.text.inverted,
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
