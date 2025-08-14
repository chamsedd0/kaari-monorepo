import React, { memo } from 'react';
import type { SvgProps } from 'react-native-svg';

import Dashboard from '~/../assets/Icon_Dashboard.svg';
import Property from '~/../assets/Icon_Property.svg';
import Share from '~/../assets/Icon_Share.svg';
import Photoshoot from '~/../assets/Icon_Photoshoot.svg';
import Cross from '~/../assets/Icon_Cross.svg';
import Favorites from '~/../assets/Icon_Favorites.svg';

export type IconName =
  | 'dashboard'
  | 'property'
  | 'share'
  | 'photoshoot'
  | 'cross'
  | 'favorites';

export type IconProps = SvgProps & {
  name: IconName;
  width?: number;
  height?: number;
  fill?: string;
};

const MAP: Record<IconName, React.ComponentType<SvgProps>> = {
  dashboard: Dashboard,
  property: Property,
  share: Share,
  photoshoot: Photoshoot,
  cross: Cross,
  favorites: Favorites,
};

export const Icon = memo(function Icon({ name, width = 20, height = 20, fill = 'currentColor', ...rest }: IconProps) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp width={width} height={height} fill={fill} {...rest} />;
});

export default Icon;

 
