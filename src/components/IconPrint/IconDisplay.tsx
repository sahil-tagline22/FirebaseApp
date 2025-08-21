import { View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

type IconDisplayProps = {
  color: string;
  size: number;
  name: 'home' | 'light-mode' | 'group' | 'chat' | 'settings';
};

const IconDisplay = ({ color, size, name }: IconDisplayProps) => {
  return (
    <View>
      <Icon name={name} color={color} size={size} />
    </View>
  );
};

export default IconDisplay;
