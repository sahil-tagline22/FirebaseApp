import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useThemeColor } from '../hooks/useThemeColor';
import { paginationApiCall } from '../api/requests/paginationRequests';
import { Text } from 'react-native-gesture-handler';
import analytics from '@react-native-firebase/analytics';

type Item = {
  body: string;
  id: number;
  title: string;
  userId?: number;
};

const AboutScreen = () => {
  const [screenLoader, setScreenLoader] = useState<boolean>(true);
  const [data, setData] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  console.log('🚀 ~ AboutScreen ~ currentPage:', currentPage);
  const [loader, setLoader] = useState(false);
  console.log('🚀 ~ AboutScreen ~ loader:', loader);
  const [moreData, setMoreData] = useState(true);
  console.log('🚀 ~ AboutScreen ~ moreData:', moreData);
  const [refreshing, setRefreshing] = useState(false);

  const color = useThemeColor();
  const styles = useStyle();

  //analytics
  useEffect(() => {
    analytics().logScreenView({
      screen_name: 'AboutScreen',
      screen_class: 'AboutScreen',
    });
    
  }, []);

  const initialApiCall = async (page: number) => {
    try {
      if (!data && setScreenLoader(true)) setLoader(true);
      const response = await paginationApiCall(page);
      console.log('🚀 ~ initialApiCall ~ response:', response);
      if (response?.data.length < 10) {
        setMoreData(false);
        setLoader(true);
        return;
      }
      setData(page === 1 ? response?.data : [...data, ...response?.data]);
      setRefreshing(false);
      setScreenLoader(false);
      setLoader(false);
    } catch (error) {
      console.log('🚀 ~ initialApiCall ~ error:', error);
    }
  };
  
  useEffect(() => {
    initialApiCall(currentPage);
  }, []);

  const reRenderApiCall = () => {
    if (!loader || moreData) {
      initialApiCall(currentPage + 1);
      setCurrentPage(currentPage+1)
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    initialApiCall(1);
    setCurrentPage(1);
    setMoreData(true);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.id}</Text>
      <Text style={styles.itemText}>{item.title}</Text>
      <Text style={styles.itemBodyText}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {screenLoader ? (
        <ActivityIndicator
          size={'large'}
          color={color.loader}
          style={styles.mainLoaderContainer}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          onEndReached={reRenderApiCall}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={
            <View style={styles.loadingContainer}>
              {moreData ? (
                <ActivityIndicator size={'large'} color={color.loader} />
              ) : null}
            </View>
          }
        />
      )}
    </View>
  );
};

export default AboutScreen;

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backGroundColor,
    },
    mainLoaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContainer: {
      backgroundColor: color.backGroundColor,
      marginHorizontal: 10,
      marginVertical: 10,
      borderColor: color.borderColor,
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    itemText: {
      fontSize: 20,
      color: color.text,
      textAlign: 'center',
    },
    itemBodyText: {
      textAlign: 'center',
      color: color.text,
    },
    loadingContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 10,
    },
  });
};
