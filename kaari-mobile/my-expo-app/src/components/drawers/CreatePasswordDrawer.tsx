import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import PasswordField from '~/components/inputs/PasswordField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type CreatePasswordDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: (pwd: string) => void;
};

export default function CreatePasswordDrawer({ visible, onClose, onSubmit }: CreatePasswordDrawerProps) {
  if (!visible) return null;
  const [pwd, setPwd] = React.useState('');
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Create password</Text>}
      footer={<PrimaryButton label="Create" onPress={() => { onSubmit?.(pwd); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <PasswordField value={pwd} onChangeText={setPwd} />
      </View>
    </BottomDrawer>
  );
}


