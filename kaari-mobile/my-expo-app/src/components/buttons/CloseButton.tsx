import React from 'react';
import { View } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';
import CrossIcon from '~/../assets/Icon_Cross.svg';

export type CloseButtonProps = { onPress?: () => void; size?: number };

export default function CloseButton({ onPress, size = 36 }: CloseButtonProps) {
  return (
    <PressableSurface onPress={onPress} borderRadius={100} pressedBackground={colors.gray700}>
      <View style={{ width: size, height: size, borderRadius: 100, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.gray200 }}>
        <CrossIcon width={14} height={14} color={colors.gray700} />
      </View>
    </PressableSurface>
  );
}


