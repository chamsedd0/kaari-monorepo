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
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray100, paddingHorizontal: 16, borderRadius: 100 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray300}
        style={{ flex: 1, paddingVertical: 12, color: colors.gray700 }}
      />
      <View onTouchEnd={onSend} style={{ paddingLeft: 8, paddingVertical: 8 }}>
        <SendIcon width={20} height={20} color={colors.primary} />
      </View>
    </View>
  );
}


