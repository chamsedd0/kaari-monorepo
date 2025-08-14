import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';
import Photoshoot from '~/../assets/Icon_Photoshoot.svg';

export type BookPhotoshootButtonProps = {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
};

export default function BookPhotoshootButton({ title = 'Book a Photoshoot', onPress, disabled, style }: BookPhotoshootButtonProps) {
  return (
    <PressableSurface
      onPress={onPress}
      disabled={disabled}
      className="rounded-2xl"
      pressedClassName="opacity-90"
      disabledClassName="opacity-50"
      style={[{ backgroundColor: colors.gray700, height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }, style]}
    >
      <View style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Photoshoot width={18} height={18} fill={colors.gray700} />
      </View>
      <Text style={{ color: colors.white, fontWeight: '800' }}>{title}</Text>
    </PressableSurface>
  );
}


