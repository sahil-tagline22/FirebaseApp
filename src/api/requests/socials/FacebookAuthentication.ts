import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

export const onFacebookButtonPress = async () => {
  try {
    // 🔑 This will remove any cached account
    await LoginManager.logOut();

    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    console.log('🚀 ~ onFacebookButtonPress ~ result:', result);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
    console.log('🚀 ~ onFacebookButtonPress ~ data:', data);

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = FacebookAuthProvider.credential(
      data.accessToken,
    );
    console.log(
      '🚀 ~ onFacebookButtonPress ~ facebookCredential:',
      facebookCredential,
    );

    // Sign-in the user with the credential
    const user = await signInWithCredential(getAuth(), facebookCredential);
    console.log("🚀 ~ onFacebookButtonPress ~ user:", user)

    return user;
  } catch (error) {
    console.log('🚀 ~ onFacebookButtonPress ~ error:', error);
    Alert.alert('Facebook Login Failed', 'Please try again.');
  }
};
