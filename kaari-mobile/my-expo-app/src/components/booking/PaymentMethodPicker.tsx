import { View, Text, Pressable } from 'react-native';
import { CreditCard } from '../ui/CreditCard';

type Method = { id: string; brand: 'visa' | 'mastercard' | 'amex' | 'unknown'; last4: string; name?: string };

export function PaymentMethodPicker({ methods, selectedId, onSelect }: { methods: Method[]; selectedId?: string; onSelect: (id: string) => void }) {
  return (
    <View className="gap-3">
      {methods.map((m) => {
        const active = m.id === selectedId;
        return (
          <Pressable key={m.id} onPress={() => onSelect(m.id)} className={`rounded-2xl border p-3 ${active ? 'border-black' : 'border-gray-100'}`}>
            <CreditCard brand={m.brand} last4={m.last4} name={m.name} />
          </Pressable>
        );
      })}
    </View>
  );
}


