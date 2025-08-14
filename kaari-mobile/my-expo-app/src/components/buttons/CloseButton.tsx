import React from 'react';
import IconButton from './IconButton';
import Cross from '~/../assets/Icon_Cross.svg';
import { colors } from '~/theme/colors';

export type CloseButtonProps = {
  onPress?: () => void;
  size?: number;
};

export default function CloseButton({ onPress, size = 40 }: CloseButtonProps) {
  return (
    <IconButton size={size} background="white" onPress={onPress}>
      <Cross width={18} height={18} fill={colors.gray700} />
    </IconButton>
  );
}


