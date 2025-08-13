import React from 'react';
import { View, TextInput } from 'react-native';
import { colors } from '~/theme/colors';
import SendIcon from '~/../assets/Icon_Send.svg';

export type SendMessageFieldProps = {
  value: string;
  onChangeText: (v: string) => void;
  onSend?: () => void;
  placeholder?: string;
};

export default function SendMessageField({ value, onChangeText, onSend, placeholder = 'Type a message' }: SendMessageFieldProps) {
  return (
    <View className="flex-row items-center rounded-[100px] px-4" style={{ backgroundColor: colors.gray100 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray300}
        style={{ flex: 1, paddingVertical: 12, color: colors.gray700 }}
      />
      <View onTouchEnd={onSend} className="pl-2 py-2">
        <SendIcon width={20} height={20} color={colors.primary} />
      </View>
    </View>
  );
}


