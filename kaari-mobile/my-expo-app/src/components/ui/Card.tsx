import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = ViewProps & { glass?: boolean };

export function Card({ glass = false, style, ...rest }: Props) {
  if (glass) {
    return (
      <BlurView intensity={30} tint="light" style={[{ borderRadius: 20, overflow: 'hidden' }, style]}>
        <View className="bg-white/30 border border-white/20 rounded-2xl" {...rest} />
      </BlurView>
    );
  }
  return <View className="bg-white border border-gray-100 rounded-2xl" style={style} {...rest} />;
}


