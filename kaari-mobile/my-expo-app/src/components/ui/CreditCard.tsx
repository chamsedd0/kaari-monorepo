import { View, Text } from 'react-native';

type Props = { brand: 'visa' | 'mastercard' | 'amex' | 'unknown'; last4: string; name?: string };

export function CreditCard({ brand, last4, name }: Props) {
  const brandLabel = brand.toUpperCase();
  return (
    <View className="rounded-2xl p-4 bg-black">
      <Text className="text-white/70 text-xs">{brandLabel}</Text>
      <Text className="text-white text-lg font-semibold mt-6">•••• •••• •••• {last4}</Text>
      {name ? <Text className="text-white/80 mt-6">{name}</Text> : null}
    </View>
  );
}


