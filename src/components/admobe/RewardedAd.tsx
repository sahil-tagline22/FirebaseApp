import { useEffect, useState } from 'react';
import { Button } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ 
  ? TestIds.REWARDED 
  : 'ca-app-pub-3940256099942544/5224354917'; // your real ad unit

export default function RewardedAdScreen() {
  const [rewarded, setRewarded] = useState(
    RewardedAd.createForAdRequest(adUnitId)
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('Rewarded Ad loaded ✅');
      }
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward:', reward);
      }
    );

    // Load ad
    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, [rewarded]); // 👈 dependency: new instance

  const showRewardedAd = () => {
    if (loaded) {
      rewarded.show();
      setLoaded(false);

      // 👇 Create a new instance and load for the next time
      const newRewarded = RewardedAd.createForAdRequest(adUnitId);
      setRewarded(newRewarded);
    } else {
      console.log('Rewarded ad not loaded ❌');
    }
  };

  return <Button title="Rewarded" onPress={showRewardedAd} />;
}
