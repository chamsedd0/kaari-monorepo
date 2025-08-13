import React from 'react';
import { View, Text } from 'react-native';
import TextArea from '~/components/inputs/TextArea';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type SendRequestInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
};

export default function SendRequestInput({ value, onChangeText, onSubmit }: SendRequestInputProps) {
  return (
    <View className="gap-2.5">
      <Text className="text-gray700 font-extrabold">Send request</Text>
      <TextArea value={value} onChangeText={onChangeText} placeholder="Write your request" />
      <PrimaryButton label="Send" onPress={onSubmit} />
    </View>
  );
}


