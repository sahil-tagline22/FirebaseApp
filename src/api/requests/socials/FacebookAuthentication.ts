import auth, { FacebookAuthProvider } from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { Alert } from 'react-native';

export const onFacebookButtonPress = async () => {
  try {
    // 🔑 Ensure any cached FB session is cleared
    await LoginManager.logOut();

    // 🔑 Start Facebook Login
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // 🔑 Get the Access Token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining the access token';
    }

    // 🔑 Create a Firebase credential with the token
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

    // 🔑 Sign-in the user with Firebase
    const userCredential = await auth().signInWithCredential(facebookCredential);

    console.log('✅ Facebook login success:', userCredential.user);

    return userCredential;
  } catch (error) {
    console.log('❌ Facebook login error:', error);
    Alert.alert('Facebook Login Failed', 'Please try again.');
  }
};
