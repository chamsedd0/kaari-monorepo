import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';

export type ProfileTileProps = {
  name: string;
  subtitle?: string;
  avatarUri?: string;
};

export default function ProfileTile({ name, subtitle, avatarUri }: ProfileTileProps) {
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray100 }}>
      <Image source={{ uri: avatarUri }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gray100 }} />
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{name}</Text>
        {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
      </View>
    </View>
  );
}


