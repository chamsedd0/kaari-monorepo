import React from 'react';
import { View } from 'react-native';
import TextField from '~/components/inputs/TextField';
import ArrowRight from '~/../assets/Icon_Arrow_Right.svg';
import { colors } from '~/theme/colors';

export type ArrowIconInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
};

export default function ArrowIconInput({ value, onChangeText, placeholder = 'Type here', onSubmit }: ArrowIconInputProps) {
  return (
    <TextField
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      right={
        <View onTouchEnd={onSubmit}>
          <ArrowRight width={18} height={18} color={colors.primary} />
        </View>
      }
    />
  );
}


