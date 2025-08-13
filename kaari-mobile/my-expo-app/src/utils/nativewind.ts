import { colors } from '~/theme/colors';

type ColorKey = keyof typeof colors;

const bgMap: Record<ColorKey, string> = {
  primaryDark: 'bg-primaryDark',
  primary: 'bg-primary',
  primaryLight: 'bg-primaryLight',
  primaryTint1: 'bg-primaryTint1',
  primaryTint2: 'bg-primaryTint2',
  white: 'bg-white',
  gray100: 'bg-gray100',
  gray200: 'bg-gray200',
  gray300: 'bg-gray300',
  gray500: 'bg-gray500',
  gray700: 'bg-gray700',
  black: 'bg-black',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  info: 'bg-info',
};

const textMap: Record<ColorKey, string> = {
  primaryDark: 'text-primaryDark',
  primary: 'text-primary',
  primaryLight: 'text-primaryLight',
  primaryTint1: 'text-primaryTint1',
  primaryTint2: 'text-primaryTint2',
  white: 'text-white',
  gray100: 'text-gray100',
  gray200: 'text-gray200',
  gray300: 'text-gray300',
  gray500: 'text-gray500',
  gray700: 'text-gray700',
  black: 'text-black',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
};

export function bgColorClass(key: ColorKey) {
  return bgMap[key] ?? '';
}

export function textColorClass(key: ColorKey) {
  return textMap[key] ?? '';
}


