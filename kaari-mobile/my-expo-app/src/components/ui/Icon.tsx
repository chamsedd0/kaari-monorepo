import React from 'react';
import DashboardIcon from '~/../assets/Icon_Dashboard.svg';
import PropertyIcon from '~/../assets/Icon_Property.svg';

export type IconName = 'dashboard' | 'property';

export type IconProps = {
  name: IconName;
  width?: number;
  height?: number;
  fill?: string;
};

export function Icon({ name, width = 20, height = 20, fill }: IconProps) {
  switch (name) {
    case 'dashboard':
      return <DashboardIcon width={width} height={height} />;
    case 'property':
      return <PropertyIcon width={width} height={height} />;
    default:
      return null;
  }
}

export default Icon;


