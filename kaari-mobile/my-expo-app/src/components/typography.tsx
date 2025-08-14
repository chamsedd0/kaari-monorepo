import React from 'react';
import { Text, TextProps } from 'react-native';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy';

function familyFor(weight?: Weight | string): string {
  switch (weight) {
    case 'heavy':
    case '800':
    case '900':
      return 'VisbyCF-Heavy';
    case 'bold':
    case '700':
      return 'VisbyCF-Bold';
    case 'semibold':
    case '600':
      return 'VisbyCF-DemiBold';
    case 'medium':
    case '500':
      return 'VisbyCF';
    default:
      return 'VisbyCF';
  }
}

export function VText({ children, weight, style, ...rest }: TextProps & { weight?: Weight }) {
  const fontFamily = familyFor(weight);
  return (
    <Text {...rest} style={[{ fontFamily }, style]}>
      {children}
    </Text>
  );
}

export default { VText };


