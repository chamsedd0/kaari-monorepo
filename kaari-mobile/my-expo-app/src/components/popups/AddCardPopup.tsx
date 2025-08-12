import { View, Text, TextInput } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function AddCardPopup({ visible, onAdd, onCancel }: { visible: boolean; onAdd: () => void; onCancel: () => void }) {
  return (
    <PopupShell visible={visible} title="Add payment method" footer={
      <View className="flex-row gap-3">
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Add" onPress={onAdd} style={{ flex: 1 }} />
      </View>
    }>
      <TextInput className="border rounded-2xl px-4 py-3" placeholder="Cardholder name" />
      <TextInput className="border rounded-2xl px-4 py-3" placeholder="Card number" keyboardType="number-pad" />
      <View className="flex-row gap-2">
        <TextInput className="flex-1 border rounded-2xl px-4 py-3" placeholder="MM/YY" keyboardType="number-pad" />
        <TextInput className="flex-1 border rounded-2xl px-4 py-3" placeholder="CVC" keyboardType="number-pad" />
      </View>
    </PopupShell>
  );
}



