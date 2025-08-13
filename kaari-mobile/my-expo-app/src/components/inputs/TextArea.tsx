import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { colors } from '~/theme/colors';

export type TextAreaProps = TextInputProps & {
  label?: string;
  error?: string;
  minRows?: number;
};

export default function TextArea({ label, error, minRows = 4, style, ...rest }: TextAreaProps) {
  return (
    <View className="gap-1.5">
      {!!label && <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>}
      <TextInput
        multiline
        numberOfLines={minRows}
        placeholderTextColor={colors.gray300}
        style={[{ borderWidth: 1, borderColor: error ? colors.danger : colors.gray200, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, minHeight: minRows * 22, textAlignVertical: 'top', color: colors.gray700, backgroundColor: colors.white }, style]}
        {...rest}
      />
      {!!error && <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>}
    </View>
  );
}


