import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import InfoIcon from '~/../assets/Icon_Info.svg';

export type ProtectionInfoCardProps = {
  title?: string;
  body?: string;
};

export default function ProtectionInfoCard({ title = 'Tenant protection', body = 'Your booking is backed by our protection policy.' }: ProtectionInfoCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="flex-row items-center gap-2">
        <View className="items-center justify-center rounded-md" style={{ width: 28, height: 28, backgroundColor: colors.primaryTint2 }}>
          <InfoIcon width={16} height={16} color={colors.primary} />
        </View>
        <Text className="text-gray700 font-extrabold">{title}</Text>
      </View>
      <Text className="text-gray500">{body}</Text>
    </View>
  );
}


