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
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useThemeColor } from '../../hooks/useThemeColor';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { OnGoogleButtonPress } from '../../api/requests/socials/GoogleAuthentication';
import { onFacebookButtonPress } from '../../api/requests/socials/FacebookAuthentication';
import { onMicrosoftButtonPress } from '../../api/requests/socials/MicrosiftAuthentication';
import { authorize } from 'react-native-app-auth';
import auth from '@react-native-firebase/auth';

import { AppleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import  { appleAuth } from '@invertase/react-native-apple-authentication';

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

  //Apple login
  const onAppleButtonPress = async()=> {
    const isSupported = appleAuth.isSupported;
    if(!isSupported) {
      Alert.alert("Apple Sign-In is not supported on this device");
      return;
    }
  // Start the sign-in request
  try {
    
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    console.log("🚀 ~ onAppleButtonPress ~ appleAuthRequestResponse:", appleAuthRequestResponse)

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = AppleAuthProvider.credential(identityToken, nonce);
    console.log("🚀 ~ onAppleButtonPress ~ appleCredential:", appleCredential)

    // Sign the user in with the credential
    const user = await signInWithCredential(getAuth(), appleCredential);
    console.log("🚀 ~ onAppleButtonPress ~ user:", user.user);
    } catch (error) {
      console.log("🚀 ~ onAppleButtonPress ~ error:", error)
    }
    
  }

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

            <TouchableOpacity 
            style={styles.googleBtnContainer}
            onPress={onAppleButtonPress}
            >
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
      width: w('100%'),
      height: h('100%'),
      backgroundColor: colors.screen,
    },
    loginContainer: {
      backgroundColor: color.backGroundColor,
      width: w('90%'),
      height: h('50%'),
      borderRadius: w('10%'),
      marginVertical: h('25%'),
      alignSelf: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: RFPercentage(5),
      marginTop: h('1%'),
      fontWeight: '700',
      marginBottom: w('5%'),
    },
    loginBtn: {
      backgroundColor: colors.button.button,
      height: h('5%'),
      width: w('35%'),
      alignSelf: 'center',
      marginTop: h('3%'),
      borderRadius: w('10%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnText: {
      fontSize: RFPercentage(2.5),
      color: colors.text.inverted,
    },
    footer: {
      flexDirection: 'row',
      gap: h('0.5%'),
      justifyContent: 'center',
      marginTop: h('2%'),
    },
    textLine: {
      fontSize: RFPercentage(1.9),
      fontWeight: '500',
    },
    textLogin: {
      fontSize: RFPercentage(1.9),
      fontWeight: '500',
      color: colors.text.blue,
      borderBottomWidth: 1,
      borderBottomColor: colors.text.blue,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    googleBtnContainer: {
      backgroundColor: colors.button.button,
      height: h('4%'),
      width: w('10%'),
      borderRadius: w('1%'),
      // marginLeft: w('7%'),
      marginTop: h('2%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    googleLoginBtnText: {
      fontSize: h('1.8%'),
      color: colors.text.inverted,
    },
    loaderOverlay: {
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
