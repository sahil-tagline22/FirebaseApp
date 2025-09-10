import { getAuth, GoogleAuthProvider, signInWithCredential } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

export const OnGoogleButtonPress = async () => {
    try {
      GoogleSignin.configure({
        webClientId:
          '742734159624-k1vf8d1j883lb09kijmpmmcdcok4jje8.apps.googleusercontent.com',
        offlineAccess: false,
        scopes: ['profile', 'email'],
      });

      await GoogleSignin.hasPlayServices();

      // 🔑 This will remove any cached account
      await GoogleSignin.signOut();

      const signInResult = await GoogleSignin.signIn();
      console.log('🚀 ~ onGoogleButtonPress ~ signInResult:', signInResult);

      const { idToken } = await GoogleSignin.getTokens();
      console.log("🚀 ~ OnGoogleButtonPress ~ idToken:", idToken)

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      const user = await signInWithCredential(getAuth(), googleCredential);

      return user;

    } catch (error) {
      console.log('🚀 ~ onGoogleButtonPress ~ error:', error);
      Alert.alert('Google Login Failed', 'Please try again.');
    }
  };