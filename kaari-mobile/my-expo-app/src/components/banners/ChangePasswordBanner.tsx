import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import InfoIcon from '~/../assets/Icon_Info.svg';

export type ChangePasswordBannerProps = {
  onPress?: () => void;
};

export default function ChangePasswordBanner({ onPress }: ChangePasswordBannerProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.primaryTint2 }}>
      <View className="items-center justify-center rounded-lg" style={{ width: 28, height: 28, backgroundColor: colors.white }}>
        <InfoIcon width={16} height={16} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-primary font-extrabold">Change your password</Text>
        <Text className="text-gray700 mt-0.5">It’s been a while since your last update.</Text>
      </View>
      <Text onPress={onPress} className="text-primary font-extrabold">Update</Text>
    </View>
  );
}


