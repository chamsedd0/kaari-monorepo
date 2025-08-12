import { Text, View } from 'react-native';
import { Modal } from './Modal';
import { Button } from './Button';

type Props = { visible: boolean; title: string; message?: string; confirmText?: string; cancelText?: string; onConfirm: () => void; onCancel: () => void };

export function ConfirmDialog({ visible, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} onClose={onCancel}>
      <View className="gap-3">
        <Text className="text-lg font-semibold">{title}</Text>
        {message ? <Text className="text-gray-700">{message}</Text> : null}
        <View className="flex-row gap-3 mt-2">
          <Button title={cancelText} variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
          <Button title={confirmText} onPress={onConfirm} style={{ flex: 1 }} />
        </View>
      </View>
    </Modal>
  );
}


