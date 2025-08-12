import { View, Text, Pressable } from 'react-native';
import { Icon } from './Icon';

type Props = { title: string; onBack?: () => void; right?: React.ReactNode };

export function Header({ title, onBack, right }: Props) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="w-10">
        {onBack ? (
          <Pressable onPress={onBack}>
            <Icon name="back" width={24} height={24} />
          </Pressable>
        ) : null}
      </View>
      <Text className="text-lg font-semibold text-black">{title}</Text>
      <View className="w-10 items-end">{right}</View>
    </View>
  );
}


