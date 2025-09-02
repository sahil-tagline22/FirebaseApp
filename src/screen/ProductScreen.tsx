import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import { useThemeColor } from '../hooks/useThemeColor';
import { colors } from '../theme/Colors';

type Product = {
  category: string;
  description: string;
  id: number;
  image: string;
  price: number;
  rating: { rate: number; count: number };
  title: string;
};

const ProductScreen = () => {
  const styles = useStyle();
  const [products, SetProducts] = useState<Product[]>([]);
  console.log('🚀 ~ ProductScreen ~ product:', products);

  // All Product Fetch
  const ProductFetch = async () => {
    const getAllProduct = await axios.get('https://fakestoreapi.com/products');
    SetProducts(getAllProduct.data);
  };
  useEffect(() => {
    ProductFetch();
  }, []);

  //Product Item Render
  const renderItem = ({ item }) => (
    <View style={styles.renderItemContainer}>
      <Image source={{ uri: item.image }} style={styles.imageContainer} />
      <View>
        <Text style={styles.containerCategory}>category :- {item.category}</Text>
        <Text style={styles.containerDis}>dis :- 
          {item.description.length > 25 ? item.description.substring(0, 25) + '...' : item.description}
        </Text>
        <Text style={styles.containerCategory}>$ :- {item.price}</Text>
        <Text style={styles.containerDis}>title :- {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}</Text>
        <Text style={styles.containerCategory}>⭐ {item.rating.rate}</Text>
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
      paddingBottom : h('15%')
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
      
    }
  });
};
