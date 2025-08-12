import { Image } from 'react-native';

export function Logo({ width = 48, height = 48 }: { width?: number; height?: number }) {
  return <Image source={require('../../../assets/icon.png')} style={{ width, height, borderRadius: 8 }} />;
}


