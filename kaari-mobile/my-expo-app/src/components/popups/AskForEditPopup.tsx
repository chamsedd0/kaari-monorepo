import { View, Text, TextInput } from 'react-native';
import { PopupShell } from './PopupShell';
import { Button } from '../ui/Button';

export function AskForEditPopup({ visible, onSubmit, onCancel }: { visible: boolean; onSubmit: (message: string) => void; onCancel: () => void }) {
  let value = '';
  return (
    <PopupShell visible={visible} title="Ask for edit" footer={
      <View className="flex-row gap-3">
        <Button title="Cancel" variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
        <Button title="Send" onPress={() => onSubmit(value)} style={{ flex: 1 }} />
      </View>
    }>
      <Text className="text-gray-700">Describe what should be changed for this listing.</Text>
      <TextInput className="border rounded-2xl px-4 py-3" placeholder="Your message" multiline numberOfLines={4} onChangeText={(t) => (value = t)} />
    </PopupShell>
  );
}



