import { View, Text, Pressable } from 'react-native';

type Props = { label: string; onPress?: () => void; disabled?: boolean };

export function FooterButton({ label, onPress, disabled }: Props) {
  return (
    <View className="absolute left-0 right-0 bottom-0 p-4 bg-white border-t border-gray-100">
      <Pressable
        disabled={disabled}
        onPress={onPress}
        className={`rounded-2xl px-4 py-3 ${disabled ? 'bg-gray-300' : 'bg-black'}`}
      >
        <Text className="text-white text-center font-semibold">{label}</Text>
      </Pressable>
    </View>
  );
}


