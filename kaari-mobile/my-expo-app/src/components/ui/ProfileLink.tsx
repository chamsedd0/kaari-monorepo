import { Pressable, Text, View } from 'react-native';
import { Icon } from './Icon';

export function ProfileLink({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between py-3">
      <Text className="text-black text-base">{title}</Text>
      <View className="opacity-60">
        <Icon name="arrowRight" width={18} height={18} />
      </View>
    </Pressable>
  );
}


