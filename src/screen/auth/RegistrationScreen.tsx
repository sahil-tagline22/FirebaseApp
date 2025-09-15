import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAppDispatch } from '../../redux/Store';
import { loginUser } from '../../redux/slice/AuthSlice';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, setDoc } from '@react-native-firebase/firestore';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { RegisterUser } from '../../api/requests/RegisterUserRequests';
import {
  setAccessToken,
  setRefreshToken,
} from '../../redux/slice/AccessAndRefreshSlice';
import { useThemeColor } from '../../hooks/useThemeColor';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { heightScale, moderateScale, widthScale } from '../../hooks/useDimensions';

interface RegistrationScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'registration'>;
}

const RegistrationScreen = ({ navigation }: RegistrationScreenProps) => {
  const { t } = useAppTranslation();
  const styles = useStyle();

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      conformPassword: '',
    },
    validationSchema: yup.object().shape({
      name: yup.string().required('please enter name.!'),
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
    onSubmit: async values => {
      try {
        //create new user
        const app = getApp();
        const auth = getAuth(app);
        const newUser = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        if (newUser) {
          dispatch(loginUser(newUser.user));
          navigation.replace('bottom');
        }

        //store user in firebase
        const db = getFirestore(app);
        await setDoc(doc(db, 'users', newUser.user.uid), {
          name: values.name,
          email: newUser.user.email,
          uid: newUser.user.uid,
        });

        //accessToken and refreshToken save in redux-persist
        const data = {
          name: values.name,
          email: values.email,
          password: values.password,
        };
        const response = await RegisterUser(data);
        console.log('🚀 ~ RegistrationScreen ~ response:', response);
        dispatch(setAccessToken(response?.data.data.accessToken));
        dispatch(setRefreshToken(response?.data.data.refreshToken));

        values.name = '';
        values.email = '';
        values.password = '';
        values.conformPassword = '';
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert(
            'Alert',
            'The email address is already in use by another account.',
          );
        }
        console.log('error', error);
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

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={formik.handleSubmit}
          >
            <Text style={styles.btnText}>{t('registration_btn')}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.textLine}>{t('i_have_account')}</Text>
            <Text
              style={styles.textLogin}
              onPress={() => navigation.replace('login')}
            >
              {t('login_message')}
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RegistrationScreen;

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.screen,
    },
    loginContainer: {
      backgroundColor: color.backGroundColor,
      width: widthScale(350),
      borderRadius: moderateScale(20),
      alignSelf: 'center',
      paddingVertical: heightScale(20),
      paddingHorizontal: widthScale(20),
      marginTop: heightScale(150),
    },
    title: {
      textAlign: 'center',
      fontSize: moderateScale(40),
      // marginTop: h('1%'),
      fontWeight: '700',
      // marginBottom:w('5%')
    },
    loginBtn: {
      backgroundColor: colors.button.button,
      height: heightScale(50),
      width: widthScale(150),
      alignSelf: 'center',
      marginTop: heightScale(25),
      borderRadius: moderateScale(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      fontSize: moderateScale(20),
      color: colors.text.inverted,
    },
    footer: {
      flexDirection: 'row',
      gap: widthScale(5),
      justifyContent: 'center',
      marginTop: heightScale(15),
    },
    textLine: {
      fontSize: moderateScale(15),
      fontWeight: '500',
    },
    textLogin: {
      fontSize: moderateScale(15),
      fontWeight: '500',
      color: colors.text.blue,
      borderBottomWidth: moderateScale(1),
      borderBottomColor: colors.text.blue,
    },
  });
};
