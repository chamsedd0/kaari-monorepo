import React from 'react';
import { View, Text, Modal } from 'react-native';
import { colors } from '~/theme/colors';
import SecondaryButton from '~/components/buttons/SecondaryButton';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type CancelConfirmPopupProps = {
  visible: boolean;
  title: string;
  body?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function CancelConfirmPopup({ visible, title, body, cancelLabel = 'No', confirmLabel = 'Yes', onCancel, onConfirm }: CancelConfirmPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View className="rounded-2xl p-4 w-full gap-3" style={{ backgroundColor: colors.white }}>
          <Text className="text-gray700 font-extrabold text-lg">{title}</Text>
          {!!body && <Text className="text-gray500">{body}</Text>}
          <View className="flex-row gap-3 mt-1.5">
            <View className="flex-1">
              <SecondaryButton label={cancelLabel} onPress={onCancel} fullWidth />
            </View>
            <View className="flex-1">
              <PrimaryButton label={confirmLabel} onPress={onConfirm} fullWidth />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}


