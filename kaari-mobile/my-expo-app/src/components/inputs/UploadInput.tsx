import React from 'react';
import { View, Text } from 'react-native';
import UploadField from '~/components/inputs/UploadField';

export type UploadInputProps = {
  label?: string;
  onPress?: () => void;
};

export default function UploadInput({ label = 'Upload', onPress }: UploadInputProps) {
  return (
    <View className="gap-2.5">
      <Text className="text-gray700 font-extrabold">{label}</Text>
      <UploadField onPress={onPress} />
    </View>
  );
}


