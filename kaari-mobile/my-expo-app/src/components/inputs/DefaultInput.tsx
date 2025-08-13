import React from 'react';
import TextField from '~/components/inputs/TextField';

export type DefaultInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export default function DefaultInput({ value, onChangeText, placeholder = 'Type here' }: DefaultInputProps) {
  return <TextField value={value} onChangeText={onChangeText} placeholder={placeholder} />;
}


