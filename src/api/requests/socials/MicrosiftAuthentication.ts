import auth from '@react-native-firebase/auth';

export const onMicrosoftButtonPress = async () => {
    try {

      if (auth().currentUser) {
        await auth().signOut();
        console.log('Signed out existing user');
      }

      const provider = new auth.OAuthProvider('microsoft.com');
      console.log("🚀 ~ onMicrosoftButtonPress ~ provider:", provider)
      const result = await auth().signInWithPopup(provider);
      console.log("🚀 ~ onMicrosoftButtonPress ~ result:", result)

      return result
    } catch (error) {
      console.error('Microsoft login error:', error);
    }
  };