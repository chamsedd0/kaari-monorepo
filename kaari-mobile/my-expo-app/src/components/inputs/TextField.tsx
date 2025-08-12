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
    <View style={{ gap: 6 }}>
      {!!label && <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>}
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: error ? colors.danger : colors.gray200, borderRadius: 100, paddingHorizontal: 16, backgroundColor: colors.white }}>
        {!!left && <View style={{ marginRight: 8 }}>{left}</View>}
        <TextInput
          placeholderTextColor={colors.gray300}
          style={[{ flex: 1, paddingVertical: 10, color: colors.gray700 }, style]}
          {...rest}
        />
        {!!right && <View style={{ marginLeft: 8 }}>{right}</View>}
      </View>
      {!!error && <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>}
    </View>
  );
}


