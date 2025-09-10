import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';
import { useThemeColor } from '../hooks/useThemeColor';
import { useProductCart } from '../store/useProductCart';
import { colors } from '../theme/Colors';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppTranslation } from '../hooks/useAppTranslation';

interface CartNavigationProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'cart'>;
}

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
  quantity?: number;
  newPrice : number
};

const CartScreen = ({ navigation }: CartNavigationProps) => {
  const color = useThemeColor();
  const styles = useStyle();
  const totalProduct = useProductCart(state => state.totalCartProduct);
  const increaseItemQuantity = useProductCart(state => state.increaseItemQuantity);
  const { t } = useAppTranslation();

  // Header style create
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('cart'),
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: color.header },
      headerTitleStyle: { color: color.headerText },
      headerTintColor: color.headerText,
    });
  }, [color.header, color.headerText, navigation]);

  // render item list
  const renderItem = ({ item }: { item: Product }) => {
    console.log('🚀 ~ renderItem ~ item:', item);
    return (
      <View style={styles.renderItemContainer}>
        <Image source={{ uri: item.image }} style={styles.imageContainer} />
        <View>
          <View>
            <Text style={styles.containerCategory}>
              category :- {item.category}
            </Text>
            <Text style={styles.containerDis}>
              dis :-
              {item.description.length > 25
                ? item.description.substring(0, 25) + '...'
                : item.description}
            </Text>
            <Text style={styles.containerCategory}>$ :- {item.price === item.newPrice ? item.price : item.newPrice}</Text>
            <Text style={styles.containerDis}>
              title :-{' '}
              {item.title.length > 20
                ? item.title.substring(0, 20) + '...'
                : item.title}
            </Text>
            <Text style={styles.containerCategory}>⭐ {item.rating.rate}</Text>
            <View style={styles.addRemoveBtnContainer}>
              <TouchableOpacity onPress={()=>increaseItemQuantity(item.id,'increment')}>
                <Icon name="add" size={30} color={color.borderColor} />
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity onPress={()=>increaseItemQuantity(item.id,'decrement')}>
                <Icon name="remove" size={30} color={color.borderColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={totalProduct}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListTopMargin}
      />
    </View>
  );
};

export default CartScreen;

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.screen,
      flex: 1,
      paddingBottom: h('2%'),
    },
    renderItemContainer: {
      width: w('100%'),
      height: h('18%'),
      backgroundColor: color.backGroundColor,
      alignSelf: 'center',
      marginTop: h('1%'),
      flexDirection: 'row',
      gap: w('2%'),
      borderRadius: w('3%'),
    },
    imageContainer: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginLeft: 10,
    },
    containerCategory: {
      fontSize: h('2%'),
      color: color.text,
    },
    containerDis: {
      fontSize: h('1.5%'),
      color: color.text,
    },
    addRemoveBtnContainer: {
      flexDirection: 'row',
      gap: 10,
      alignSelf: 'center',
      alignItems: 'center',
    },
    flatListTopMargin : {
      paddingTop: 10
    }
  });
};
