import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import FemaleIcon from '../../assets/Icon_Female.svg';
import { colors } from '../theme/colors';

type GenderTagProps = {
  label?: string; // optional text
  size?: number; // circular diameter, default 36
  style?: ViewStyle | ViewStyle[];
};

export function GenderTag({ label = '', size = 36, style }: GenderTagProps) {
  return (
    <View className="items-center justify-center rounded-full bg-primary" style={[{ width: size, height: size }, style as any]}>
      <FemaleIcon width={size * 0.5} height={size * 0.5} color={colors.white} />
      {/* Optional annotation beside could be added by caller when needed */}
    </View>
  );
}

export default { GenderTag };


