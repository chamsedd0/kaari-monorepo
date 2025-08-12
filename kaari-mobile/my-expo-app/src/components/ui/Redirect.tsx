import { Pressable, Text, View } from 'react-native';
import { Icon } from './Icon';

export function Redirect({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-2">
      <Text className="text-primary font-semibold">{label}</Text>
      <Icon name="arrowRight" width={16} height={16} fill="#8F27CE" />
    </Pressable>
  );
}


