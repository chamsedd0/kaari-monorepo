import React from 'react';
import { View, Text } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';
import ShareIcon from '~/../assets/Icon_Share.svg';

export type ShareButtonProps = { onPress?: () => void; label?: string };

export default function ShareButton({ onPress, label = 'Share' }: ShareButtonProps) {
  return (
    <PressableSurface onPress={onPress} borderRadius={100} pressedBackground={colors.primary}>
      <View className="flex-row items-center gap-2 h-11 px-4 rounded-[100px] border" style={{ backgroundColor: colors.white, borderColor: colors.primary }}>
        <ShareIcon width={18} height={18} color={colors.primary} />
        <Text style={{ color: colors.primary, fontWeight: '800', letterSpacing: 0.2 }}>{label}</Text>
      </View>
    </PressableSurface>
  );
}


