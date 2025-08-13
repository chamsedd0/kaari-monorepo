import React from 'react';
import { View, Text, Modal } from 'react-native';
import { colors } from '~/theme/colors';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type AlertInformationPopupProps = {
  visible: boolean;
  title: string;
  body?: string;
  buttonLabel?: string;
  onClose?: () => void;
};

export default function AlertInformationPopup({ visible, title, body, buttonLabel = 'Got it', onClose }: AlertInformationPopupProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View className="rounded-2xl p-4 w-full gap-3" style={{ backgroundColor: colors.white }}>
          <Text className="text-gray700 font-extrabold text-lg">{title}</Text>
          {!!body && <Text className="text-gray500">{body}</Text>}
          <PrimaryButton label={buttonLabel} onPress={onClose} fullWidth />
        </View>
      </View>
    </Modal>
  );
}


