import React from 'react';
import { View, Text } from 'react-native';
import PasswordField from '~/components/inputs/PasswordField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type PasswordCreateInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
};

export default function PasswordCreateInput({ value, onChangeText, onSubmit }: PasswordCreateInputProps) {
  return (
    <View className="gap-2.5">
      <Text className="text-gray700 font-extrabold">Create password</Text>
      <PasswordField value={value} onChangeText={onChangeText} />
      <PrimaryButton label="Create" onPress={onSubmit} />
    </View>
  );
}


