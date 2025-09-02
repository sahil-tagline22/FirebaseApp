import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { useThemeColor } from '../hooks/useThemeColor';
import { colors } from '../theme/Colors';
import { useProductCart } from '../hooks/useProductCart';
// import Icon from 'react-native-vector-icons/MaterialIcons';

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
};

const ProductScreen = ({navigation}) => {
  const styles = useStyle();
  const color = useThemeColor();
  const [products, SetProducts] = useState<Product[]>([]);
  console.log('🚀 ~ ProductScreen ~ product:', products);

  const addToCart = useProductCart((state) => state.addToCart);
  const totalProduct = useProductCart((state) => state.totalCartProduct);
  console.log("🚀 ~ ProductScreen ~ totalProduct:", totalProduct)

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
  ),[totalProduct.length,styles.cartCount])

  //header 
  navigation.setOptions({
      headerRight:headerRight
  });


  //Product Item Render
  const renderItem = ({ item }:{item:Product}) => (
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
          <TouchableOpacity style={styles.addToCartBtn} onPress={()=>addToCart(item)}>
            <Text style={styles.addToCartBtnText}>Add To Cart</Text>
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ProductScreen;

const useStyle = () => {
  const color = useThemeColor();
  return StyleSheet.create({
    container: {
      backgroundColor: colors.screen,
      width: w('100%'),
      height: h('100%'),
      paddingBottom : h('14%')
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
      fontSize : h('2%')
    },
    containerDis:{
      fontSize : h('1.5%')
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
      backgroundColor : color.header,
      height:h('4%'),
      width : w('8%'),
      justifyContent:"center",
      alignItems:"center",
      borderRadius:w('4'),
    },
    cartCountText : {
      fontSize : h('2.5'),
      color : color.headerText
    }
  });
};
