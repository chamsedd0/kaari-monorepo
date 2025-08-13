import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';

export type ProfileHeaderProps = {
  name: string;
  subtitle?: string;
  avatarUri?: string;
  backgroundUri?: string;
};

export default function ProfileHeader({ name, subtitle, avatarUri, backgroundUri }: ProfileHeaderProps) {
  return (
    <View>
      {!!backgroundUri && <Image source={{ uri: backgroundUri }} style={{ width: '100%', height: 120 }} resizeMode="cover" />}
      <View className="px-4 py-3" style={{ backgroundColor: colors.white }}>
        {!!avatarUri && <Image source={{ uri: avatarUri }} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gray100 }} />}
        <Text className="text-gray700 font-extrabold text-xl mt-2">{name}</Text>
        {!!subtitle && <Text className="text-gray500 mt-0.5">{subtitle}</Text>}
      </View>
    </View>
  );
}


