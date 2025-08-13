import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import PhotoshootIcon from '~/../assets/Icon_Photoshoot.svg';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import StatusTag from '~/components/tags/StatusTag';

export type PhotoshootRequestCardProps = {
  title?: string;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'await' | 'success' | 'error';
  onPress?: () => void;
};

export default function PhotoshootRequestCard({ title = 'Photoshoot request', date = 'Aug 28, 2025', status = 'pending', onPress }: PhotoshootRequestCardProps) {
  return (
    <View className="rounded-2xl p-3.5 gap-2.5 border" style={{ backgroundColor: colors.white, borderColor: colors.gray100 }}>
      <View className="flex-row items-center gap-2">
        <View className="items-center justify-center rounded-md" style={{ width: 32, height: 32, backgroundColor: colors.primaryTint2 }}>
          <PhotoshootIcon width={18} height={18} color={colors.primary} />
        </View>
        <Text className="text-gray700 font-extrabold">{title}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray500">{date}</Text>
        <StatusTag label={status[0].toUpperCase() + status.slice(1)} status={status} />
      </View>
      <PrimaryButton label="View details" onPress={onPress} />
    </View>
  );
}


