import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type SelectorRadialProps = {
  label: string;
  selected: boolean;
  onPress?: () => void;
};

export default function SelectorRadial({ label, selected, onPress }: SelectorRadialProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }} onTouchEnd={onPress}>
      <View style={{ width: 20, height: 20, borderRadius: 100, borderWidth: 2, borderColor: selected ? colors.primary : colors.gray300, alignItems: 'center', justifyContent: 'center' }}>
        {selected && <View style={{ width: 10, height: 10, borderRadius: 100, backgroundColor: colors.primary }} />}
      </View>
      <Text style={{ color: colors.gray700, marginLeft: 10 }}>{label}</Text>
    </View>
  );
}


