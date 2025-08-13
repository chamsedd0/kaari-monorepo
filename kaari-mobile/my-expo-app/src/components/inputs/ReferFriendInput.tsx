import React from 'react';
import { View, Text } from 'react-native';
import TextField from '~/components/inputs/TextField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type ReferFriendInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
};

export default function ReferFriendInput({ value, onChangeText, onSend }: ReferFriendInputProps) {
  return (
    <View className="gap-2.5">
      <Text className="text-gray700 font-extrabold">Refer a friend</Text>
      <TextField placeholder="Enter email" value={value} onChangeText={onChangeText} />
      <PrimaryButton label="Send invite" onPress={onSend} />
    </View>
  );
}


