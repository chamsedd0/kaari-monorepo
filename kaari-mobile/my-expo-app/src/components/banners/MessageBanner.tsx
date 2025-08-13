import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import MessagesIcon from '~/../assets/Icon_Messages.svg';

export type MessageBannerProps = {
  title: string;
  subtitle?: string;
};

export default function MessageBanner({ title, subtitle }: MessageBannerProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <View className="items-center justify-center rounded-[8px]" style={{ width: 28, height: 28, backgroundColor: colors.primaryTint2 }}>
        <MessagesIcon width={16} height={16} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
      </View>
    </View>
  );
}


