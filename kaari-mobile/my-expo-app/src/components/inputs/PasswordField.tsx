import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { colors } from '~/theme/colors';

export type PasswordFieldProps = {
  value: string;
  onChangeText: (v: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
};

export default function PasswordField({ value, onChangeText, label, placeholder = 'Enter password', error }: PasswordFieldProps) {
  const [hidden, setHidden] = React.useState(true);
  return (
    <View className="gap-1.5">
      {!!label && <Text style={{ color: colors.gray700, fontWeight: '700' }}>{label}</Text>}
      <View className="flex-row items-center rounded-[100px] px-4" style={{ borderWidth: 1, borderColor: error ? colors.danger : colors.gray200, backgroundColor: colors.white }}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray300}
          style={{ flex: 1, paddingVertical: 10, color: colors.gray700 }}
          secureTextEntry={hidden}
        />
        <Text onPress={() => setHidden((v) => !v)} className="py-2" style={{ color: colors.primary, fontWeight: '700' }}>
          {hidden ? 'Show' : 'Hide'}
        </Text>
      </View>
      {!!error && <Text style={{ color: colors.danger, fontSize: 12 }}>{error}</Text>}
    </View>
  );
}


