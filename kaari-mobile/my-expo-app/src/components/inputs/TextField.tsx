import React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { colors } from '~/theme/colors';

export type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function TextField({ label, error, left, right, style, ...rest }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      {!!label && <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>}
      <View className="flex-row items-center rounded-[100px] px-4" style={{ borderWidth: 1, borderColor: error ? colors.danger : colors.gray200, backgroundColor: colors.white }}>
        {!!left && <View className="mr-2">{left}</View>}
        <TextInput
          placeholderTextColor={colors.gray300}
          style={[{ flex: 1, paddingVertical: 10, color: colors.gray700 }, style]}
          {...rest}
        />
        {!!right && <View className="ml-2">{right}</View>}
      </View>
      {!!error && <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>}
    </View>
  );
}


