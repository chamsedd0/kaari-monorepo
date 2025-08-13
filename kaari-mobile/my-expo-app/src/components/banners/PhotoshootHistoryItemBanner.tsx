import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PhotoshootIcon from '~/../assets/Icon_Photoshoot.svg';

export type PhotoshootHistoryItemBannerProps = {
  title: string;
  date: string;
  status?: string;
};

export default function PhotoshootHistoryItemBanner({ title, date, status }: PhotoshootHistoryItemBannerProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <View className="items-center justify-center rounded-[8px]" style={{ width: 28, height: 28, backgroundColor: colors.primaryTint2 }}>
        <PhotoshootIcon width={16} height={16} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        <Text className="text-gray500 mt-0.5">{date}</Text>
      </View>
      {!!status && <Text className="text-gray500">{status}</Text>}
    </View>
  );
}


