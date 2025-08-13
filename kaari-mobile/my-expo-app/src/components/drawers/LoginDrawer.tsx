import React from 'react';
import { View, Text } from 'react-native';
import BottomDrawer from './BottomDrawer';
import TextField from '~/components/inputs/TextField';
import PasswordField from '~/components/inputs/PasswordField';
import PrimaryButton from '~/components/buttons/PrimaryButton';

export type LoginDrawerProps = {
  visible: boolean;
  onClose?: () => void;
  onLogin?: (email: string) => void;
};

export default function LoginDrawer({ visible, onClose, onLogin }: LoginDrawerProps) {
  if (!visible) return null;
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  return (
    <BottomDrawer
      header={<Text className="text-gray700 font-extrabold text-lg">Login</Text>}
      footer={<PrimaryButton label="Login" onPress={() => { onLogin?.(email); onClose?.(); }} fullWidth />}
      onClose={onClose}
    >
      <View className="gap-3">
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <PasswordField label="Password" value={pwd} onChangeText={setPwd} />
      </View>
    </BottomDrawer>
  );
}


