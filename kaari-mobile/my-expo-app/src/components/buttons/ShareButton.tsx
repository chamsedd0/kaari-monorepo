import React from 'react';
import IconButton from './IconButton';
import { colors } from '~/theme/colors';
import Share from '~/../assets/Icon_Share.svg';

export type ShareButtonProps = {
  onPress?: () => void;
  size?: number;
};

export default function ShareButton({ onPress, size = 44 }: ShareButtonProps) {
  return (
    <IconButton size={size} background="white" onPress={onPress}>
      <Share width={18} height={18} fill={colors.gray700} />
    </IconButton>
  );
}


