import { Pressable, Text } from 'react-native';

type Props = { label: string; selected?: boolean; onPress?: () => void };

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className={`px-3 py-2 rounded-full ${selected ? 'bg-primary' : 'bg-gray100'}`}>
      <Text className={`${selected ? 'text-white' : 'text-black'} text-sm`}>{label}</Text>
    </Pressable>
  );
}


