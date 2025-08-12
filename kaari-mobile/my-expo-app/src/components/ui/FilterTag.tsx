import { Pressable, Text } from 'react-native';

type Props = { label: string; active?: boolean; onPress?: () => void };

export function FilterTag({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-2 rounded-full border ${active ? 'bg-black border-black' : 'bg-white border-gray-200'}`}
    >
      <Text className={`${active ? 'text-white' : 'text-black'} text-sm`}>{label}</Text>
    </Pressable>
  );
}


