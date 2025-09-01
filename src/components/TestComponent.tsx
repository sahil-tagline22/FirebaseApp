import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Triangle = () => {
  return (
    <View style={styles.triangle}>
        <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // Color of the triangle
  },
});

export default Triangle;