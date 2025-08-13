import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';
import CloseButton from '~/components/buttons/CloseButton';

export type ConversationHeaderProps = {
  title: string;
  subtitle?: string;
  avatarUri?: string;
  onClose?: () => void;
};

export default function ConversationHeader({ title, subtitle, avatarUri, onClose }: ConversationHeaderProps) {
  return (
    <View className="flex-row items-center gap-3 p-4" style={{ backgroundColor: colors.white }}>
      {!!avatarUri && <Image source={{ uri: avatarUri }} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gray100 }} />}
      <View className="flex-1">
        <Text className="text-gray700 font-extrabold">{title}</Text>
        {!!subtitle && <Text className="text-gray500">{subtitle}</Text>}
      </View>
      <CloseButton onPress={onClose} />
    </View>
  );
}


