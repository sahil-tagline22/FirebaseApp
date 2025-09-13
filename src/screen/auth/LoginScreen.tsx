import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../theme/Colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import InputText from '../../components/textInputFild/InputText';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { loginUser } from '../../redux/slice/AuthSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { LoginUser } from '../../api/requests/RegisterUserRequests';
import {
  setAccessToken,
  setRefreshToken,
} from '../../redux/slice/AccessAndRefreshSlice';
import analytics from '@react-native-firebase/analytics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useThemeColor } from '../../hooks/useThemeColor';
import { OnGoogleButtonPress } from '../../api/requests/socials/GoogleAuthentication';
import { onFacebookButtonPress } from '../../api/requests/socials/FacebookAuthentication';
import { onMicrosoftButtonPress } from '../../api/requests/socials/MicrosiftAuthentication';
import { authorize } from 'react-native-app-auth';
import auth from '@react-native-firebase/auth';
import { heightScale, moderateScale, widthScale } from '../../hooks/useDimensions';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'login'>;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { t } = useAppTranslation();
  const styles = useStyle();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const user = useAppSelector(state => state.auth.user);
  console.log('🚀 ~ LoginScreen ~ user:', user);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: yup
        .string()
        .email('please enter valid email')
        .required('please enter email.!'),
      password: yup
        .string()
        .min(6, 'password must be 6 characters')
        .required('please enter password'),
    }),

    onSubmit: async values => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        //save user in redux
        dispatch(loginUser(user.user));

        //analytics
        await analytics().logEvent('login', {
          email: values.email,
        });

        //login user, store token in redux-persisted
        const response = await LoginUser({
          email: values.email,
          password: values.password,
        });
        if (response?.data.data) {
          dispatch(setAccessToken(response?.data.data.accessToken));
          dispatch(setRefreshToken(response?.data.data.refreshToken));
        }

        //navigate user home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'bottom' }],
        });

        //reset form
        formik.resetForm();
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
          Alert.alert('Alert', 'email and password invalid');
        } else {
          console.log(error);
          Alert.alert(
            'Login Failed',
            'Something went wrong. Please try again.',
          );
        }
      } finally {
        setLoading(false);
      }
    },
  });

  //google login
  const onGoogleButtonPress = async () => {
    setLoading(true);
    const googleLogin = await OnGoogleButtonPress();
    setLoading(false);
    console.log(
      '🚀 ~ onGoogleButtonPress ~ googleLogin:',
      googleLogin?.user.email,
    );
    if (googleLogin) {
      dispatch(loginUser(googleLogin.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'bottom' }],
      });
    }
  };

  //Facebook Login
  const onFacebookButton = async () => {
    setLoading(true);
    const facebookLogin = await onFacebookButtonPress();
    setLoading(false);
    console.log(
      '🚀 ~ onFacebookButton ~ facebookLogin:',
      facebookLogin?.user.email,
    );
    if (facebookLogin) {
      dispatch(loginUser(facebookLogin.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'bottom' }],
      });
    }
  };

  //Microsoft Login
  const onMicrosoftButton = async () => {
    setLoading(true);
    const microsoftLogin = await onMicrosoftButtonPress();
    setLoading(false);
    console.log(
      '🚀 ~ onMicrosoftButton ~ microsoftLogin:',
      microsoftLogin?.user.email,
    );
    if (microsoftLogin) {
      dispatch(loginUser(microsoftLogin.user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'bottom' }],
      });
    }
  };

  //Github login
  const githubAuthConfig = {
    clientId: 'Ov23li3l99p34vtETHAa',
    clientSecret: 'e8629929d2346f436d4deae6cba85a9b39d91f2c',
    redirectUrl: 'https://fir-app-5a12b.firebaseapp.com/__/auth/handler', //'com.training_project://oauth', // custom scheme (set in Android & iOS)
    scopes: ['identity', 'user:email'],
    serviceConfiguration: {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
    },
  };

  async function githubLogin() {
    try {
      // 1. Get GitHub OAuth token
      const authResult = await authorize(githubAuthConfig);
      console.log("🚀 ~ githubLogin ~ authResult:", authResult)

      // 2. Create Firebase credential with GitHub token
      const githubCredential = auth.GithubAuthProvider.credential(
        authResult.accessToken,
      );
      console.log("🚀 ~ githubLogin ~ githubCredential:", githubCredential)

      // 3. Sign in to Firebase
      const user = await auth().signInWithCredential(githubCredential);
      console.log("🚀 ~ githubLogin ~ user:", user.user)


      return user;
    } catch (error) {
      console.error('GitHub login error:', error);
    }
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.title}>{t('login_title')}</Text>

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

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={formik.handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>{t('login_btn')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.textLine}>{t('dont_any_account')}</Text>
            <Text
              style={styles.textLogin}
              onPress={() => navigation.replace('registration')}
            >
              {t('registration_message')}
            </Text>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.googleBtnContainer}
              onPress={onGoogleButtonPress}
            >
              <Text style={styles.googleLoginBtnText}>G</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleBtnContainer}
              onPress={onFacebookButton}
            >
              <Text style={styles.googleLoginBtnText}>F</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleBtnContainer}
              onPress={onMicrosoftButton}
            >
              <Text style={styles.googleLoginBtnText}>M</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleBtnContainer}
              onPress={githubLogin}
            >
              <Text style={styles.googleLoginBtnText}>G</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleBtnContainer}>
              <Text style={styles.googleLoginBtnText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={colors.button.button} />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

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
      marginTop: heightScale(200),
    },
    title: {
      textAlign: 'center',
      fontSize: moderateScale(40),
      // marginTop: heightScale(1),
      fontWeight: '700',
      // marginBottom: w('5%'),
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
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    googleBtnContainer: {
      backgroundColor: colors.button.button,
      height: heightScale(40),
      width: widthScale(40),
      borderRadius: moderateScale(10),
      marginTop: heightScale(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    googleLoginBtnText: {
      fontSize: moderateScale(20),
      color: colors.text.inverted,
    },
    loaderOverlay: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
  });
};
