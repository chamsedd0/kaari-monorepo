import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '~/theme/colors';
import UploadIcon from '~/../assets/Icon_Upload.svg';

export type NationalIDUploadCardProps = {
  title?: string;
  description?: string;
  maxSizeLabel?: string; // e.g., '7 MB'
  acceptedFormatsLabel?: string; // e.g., 'pdf, png, jpg, jpeg, doc, docx'
  onPress?: () => void;
};

// 1:1 to the provided PNG: left-aligned texts, right upload icon, rounded card, subtle purple border
export default function NationalIDUploadCard({
  title = 'Double-sided National Card',
  description = 'Upload a digital copy of your National ID Card',
  maxSizeLabel = '7 MB',
  acceptedFormatsLabel = 'pdf, png, jpg, jpeg, doc, docx',
  onPress,
}: NationalIDUploadCardProps) {
  return (
   
      <View className="rounded-2xl p-4" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.primaryTint1 }}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <Text className="text-gray700 font-extrabold text-lg">{title}</Text>
          <Text className="text-gray500 text-base">{description}</Text>
          <View className="mt-2 gap-1.5">
            <Text className="text-gray300">{`Maximum size: ${maxSizeLabel}`}</Text>
            <Text className="text-gray300">{`Accepted formats: ${acceptedFormatsLabel}`}</Text>
          </View>
        </View>
        <View className="items-center justify-center mt-2">
          <UploadIcon width={28} height={28} color={colors.primary} />
        </View>
      </View>
      </View>

  );
}


