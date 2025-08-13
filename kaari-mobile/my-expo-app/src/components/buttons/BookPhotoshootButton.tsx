import React from 'react';
import { View, Text } from 'react-native';
import PressableSurface from '../primitives/PressableSurface';
import { colors } from '~/theme/colors';
import PhotoshootIcon from '~/../assets/Icon_Photoshoot.svg';
import AddRoundIcon from '~/../assets/Icon_Add_round_light.svg';

export type BookPhotoshootButtonProps = {
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
};

export default function BookPhotoshootButton({ onPress, label = 'Book a Photoshoot!', disabled, fullWidth = true }: BookPhotoshootButtonProps) {
  return (
    <PressableSurface onPress={onPress} pressedBackground={colors.black} borderRadius={16} disabled={disabled}>
      <View className={`flex-row items-center justify-between gap-3 h-14 px-4 rounded-[16px] ${fullWidth ? 'w-full' : ''}`} style={{ backgroundColor: disabled ? colors.gray300 : colors.primary }}>
        <View className="flex-row items-center gap-3">
          <View className="items-center justify-center" style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.white }}>
            <PhotoshootIcon width={18} height={18} color={colors.primary} />
          </View>
          <Text className="text-white font-extrabold" style={{ letterSpacing: 0.2 }}>{label}</Text>
        </View>
        <AddRoundIcon width={28} height={28} color={colors.white} />
      </View>
    </PressableSurface>
  );
}


