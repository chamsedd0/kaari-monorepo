import React from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import { colors } from '~/theme/colors';

export type GenericHeaderProps = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  backgroundImageUri?: string;
  style?: ViewStyle | ViewStyle[];
};

export default function GenericHeader({ title, subtitle, left, right, backgroundImageUri, style }: GenericHeaderProps) {
  return (
    <View style={[{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.white }, style]}>
      {!!backgroundImageUri && (
        <Image source={{ uri: backgroundImageUri }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {!!left && <View>{left}</View>}
        {!!right && <View>{right}</View>}
      </View>
      <View style={{ marginTop: 12 }}>
        <Text style={{ color: colors.gray700, fontSize: 22, fontWeight: '800' }}>{title}</Text>
        {!!subtitle && <Text style={{ color: colors.gray500, marginTop: 4 }}>{subtitle}</Text>}
      </View>
    </View>
  );
}


