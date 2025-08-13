import React from 'react';
import { View } from 'react-native';
import SendMessageField from '~/components/inputs/SendMessageField';

export type SendMessageBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSend?: () => void;
};

export default function SendMessageBar({ value, onChangeText, onSend }: SendMessageBarProps) {
  return (
    <View className="px-4 py-2">
      <SendMessageField value={value} onChangeText={onChangeText} onSend={onSend} />
    </View>
  );
}


