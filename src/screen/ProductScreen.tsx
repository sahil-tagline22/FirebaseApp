import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { useThemeColor } from '../hooks/useThemeColor';
import { colors } from '../theme/Colors';
import { useProductCart } from '../hooks/useProductCart';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
};

interface ProductScreenProps {
  navigation : NativeStackNavigationProp<RootStackParamList,'product'>
}

const ProductScreen = ({navigation}:ProductScreenProps) => {
  const styles = useStyle();
  const color = useThemeColor();
  const [products, SetProducts] = useState<Product[]>([]);

  const addToCart = useProductCart((state) => state.addToCart);
  const removeFromCart = useProductCart((state) => state.removeFromCart);
  const totalProduct = useProductCart((state) => state.totalCartProduct);

  //check in cart product in exist or not
  const isInCart = (id:number) => {
    return totalProduct.some(item => item.id === id);
  }

  // All Product Fetch
  const ProductFetch = async () => {
    const getAllProduct = await axios.get('https://fakestoreapi.com/products');
    SetProducts(getAllProduct.data);
  };
  useEffect(() => {
    ProductFetch();
  }, []);

  // header count change 
  const headerRight = useCallback(()=>(
    <View style={styles.cartCount}>
     <Text style={styles.cartCountText}>{totalProduct.length}</Text>
    </View>
  ),[totalProduct.length,styles.cartCount,styles.cartCountText])

  //header 
  useLayoutEffect(() => {
  navigation.setOptions({
    title: 'Products',
    headerRight: headerRight,
    headerTitleAlign: 'center',
    headerStyle: { backgroundColor: color.header},
    headerTitleStyle: { color: color.headerText}
  });
}, [navigation,headerRight,color.header,color.headerText]);


  //Product Item Render
  const renderItem = ({ item }:{item:Product}) => {
     const inCart = isInCart(item.id);
    return(
    <View style={styles.renderItemContainer}>
      <Image source={{ uri: item.image }} style={styles.imageContainer} />
      <View>
        <View>
          <Text style={styles.containerCategory}>category :- {item.category}</Text>
          <Text style={styles.containerDis}>dis :- 
            {item.description.length > 25 ? item.description.substring(0, 25) + '...' : item.description}
          </Text>
          <Text style={styles.containerCategory}>$ :- {item.price}</Text>
          <Text style={styles.containerDis}>title :- {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
          <Text style={styles.containerCategory}>⭐ {item.rating.rate}</Text>
          <TouchableOpacity 
          style={styles.addToCartBtn} 
          onPress={()=> isInCart(item.id) ? removeFromCart(item.id) : addToCart(item)}>
            <Text style={styles.addToCartBtnText}>{isInCart(item.id) ? 'remove to cart' : 'Add To Cart'}</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.addRemoveBtnContainer}>
          <TouchableOpacity>
            <Icon name="add" size={30} color={color.borderColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="remove" size={30} color={color.borderColor} />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default ProductScreen;

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.screen,
      // width: w('100%'),
      // height: h('100%'),
      flex: 1,
      paddingBottom : h('2%'),
    },
    renderItemContainer: {
      width: w('100%'),
      height: h('18%'),
      backgroundColor: color.backGroundColor,
      alignSelf: 'center',
      marginTop: h('1%'),
      flexDirection: 'row',
      gap: w('2%'),
      borderRadius:w('3%'),
    },
    imageContainer: {
      width: 120,
      height: 120,
      alignSelf: 'center',
      marginLeft:10,
    },
    containerCategory:{
      fontSize : h('2%'),
      color : color.text
    },
    containerDis:{
      fontSize : h('1.5%'),
      color : color.text
    },
    addRemoveBtnContainer:{
      flexDirection:"row",
      gap:20,
      alignSelf:"center"
    },
    addToCartBtn : {
      backgroundColor : color.btnColor,
      height: h('4%'),
      width: w('60%'),
      justifyContent:"center",
      alignItems:"center",
      borderRadius:10,
    },
    addToCartBtnText:{
      fontSize : h('2%'),
      color : color.text
    },
    cartCount : {
      backgroundColor : colors.destructive,
      height:h('4%'),
      width : w('8%'),
      justifyContent:"center",
      alignItems:"center",
      borderRadius:w('4%'),
    },
    cartCountText : {
      fontSize : h('2.5%'),
      color : color.headerText
    }
  });
};
