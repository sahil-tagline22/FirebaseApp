import {
  Button,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Images } from '../assets/Images';
import { colors } from '../theme/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import IconDisplay from '../components/IconPrint/IconDisplay';
import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { useThemeColor } from '../hooks/useThemeColor';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { heightScale, moderateScale, widthScale } from '../hooks/useDimensions';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

// const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

// const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);

interface UserScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'userScreen'>;
}

const UserScreen = ({ navigation }: UserScreenProps) => {
  const [users, setUsers] = useState<any[]>([]);
  console.log('users get from data base-->', users);
  const [id, setId] = useState<string>();
  // const color = useThemeColor();
  const styles = useStyle();

  //analytics
  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'UserScreen',
      screen_class: 'UserScreen',
    });
    crashlytics().log('AboutScreen mounted');
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const app = getApp();
      const auth = getAuth(app);
      const fireStore = getFirestore(app);

      const userid = auth.currentUser?.uid;
      console.log('id', userid);
      setId(userid);
      if (userid) {
        const usersRef = collection(fireStore, 'users');
        const q = query(usersRef, where('uid', '!=', userid));
        const getAllUsers = await getDocs(q);

        const allUsers = getAllUsers.docs.map((item: any) => item.data());
        setUsers(allUsers);
      }
    };
    fetchUser();
  }, []);
  console.log('users', users);

  //interstitial
  const [loadedInterstitial, setLoadedInterstitial] = useState(false);
  const [interstitial, setInterstitial] = useState(
    InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL),
  );
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoadedInterstitial(true);
        console.log('Interstitial Ad loaded ✅');
      },
    );

    const unsubscribeClose = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Interstitial Ad closed ✅');
        setLoadedInterstitial(false);
        const newInterstitial = InterstitialAd.createForAdRequest(
          TestIds.INTERSTITIAL,
        );
        setInterstitial(newInterstitial);
        newInterstitial.load();

        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
      },
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClose();
    };
  }, [interstitial]);
  const showInterstitialAd = () => {
    if (loadedInterstitial) {
      interstitial.show();
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true);
      }
    } else {
      console.log('Interstitial ad not loaded ❌');
    }
  };

  //rewarded
  const [rewarded, setRewarded] = useState(
    RewardedAd.createForAdRequest(TestIds.REWARDED),
  );
  const [loadedRewarded, setLoadedRewarded] = useState(false);
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoadedRewarded(true);
        console.log('Rewarded Ad loaded ✅');
      },
    );

    const unsubscribeClose = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        console.log('User earned reward ✅');
        setLoadedRewarded(false);
        const newRewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);
        setRewarded(newRewarded);
        newRewarded.load();

        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
      },
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClose();
    };
  }, [rewarded]);
  const showRewardedAd = () => {
    if (loadedRewarded) {
      rewarded.show();
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true);
      }
    } else {
      console.log('Rewarded ad not loaded ❌');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.userListContainer}>
              <View style={styles.imageContainer}>
                <Image source={Images.user} style={styles.image} />
              </View>
              <View style={styles.nameEmailContainer}>
                <Text style={styles.userValue}>{item.name}</Text>
                <Text style={styles.userValue}>{item.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.chatIcon}
                onPress={() =>
                  navigation.navigate('chat', {
                    userId: id!,
                    sentToUid: item.uid,
                  })
                }
              >
                <IconDisplay name="chat" color="#000" size={40} />
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
      <View style={styles.adMobView}>
        <Button title="Interstitial" onPress={showInterstitialAd} />
        <Button title="Rewarded" onPress={showRewardedAd} />
      </View>
    </View>
  );
};

export default UserScreen;

const useStyle = () => {
  const color = useThemeColor();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backGroundColor,
    },
    userListContainer: {
      backgroundColor: colors.screen,
      height: heightScale(80),
      borderRadius: moderateScale(10),
      marginHorizontal: widthScale(10),
      marginVertical: heightScale(12),
      flexDirection: 'row',
      gap: widthScale(20),
      elevation: moderateScale(5),
      shadowColor: '#000',
      alignItems: 'center',
    },
    imageContainer: {
      backgroundColor: colors.background,
      height: heightScale(70),
      width: widthScale(70),
      borderRadius: moderateScale(30),
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: widthScale(10),
    },
    image: {
      height: heightScale(50),
      width: widthScale(50),
    },
    nameEmailContainer: {
      justifyContent: 'center',
    },
    userValue: {
      fontSize: moderateScale(20),
    },
    chatIcon: {
      width: widthScale(50),
      height: heightScale(50),
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      right: 0,
      bottom: 10,
    },
    adMobView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
  });
};
