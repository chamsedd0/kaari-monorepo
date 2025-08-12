import { View, Text } from 'react-native';
import { PopupShell } from './PopupShell';
import { Icon } from '../ui/Icon';

type Variant = 'accepted' | 'rejected' | 'sent' | 'paymentFailed' | 'moveInTimer' | 'acceptedTimer';

export function ConfirmationStatusPopup({ visible, variant, title, subtitle }: { visible: boolean; variant: Variant; title: string; subtitle?: string }) {
  const iconMap: Record<Variant, { name: any; color?: string }> = {
    accepted: { name: 'check' },
    rejected: { name: 'alert' },
    sent: { name: 'info' },
    paymentFailed: { name: 'alert' },
    moveInTimer: { name: 'info' },
    acceptedTimer: { name: 'check' },
  } as const;
  const icon = iconMap[variant];
  return (
    <PopupShell visible={visible} title="">
      <View className="items-center gap-2">
        <Icon name={icon.name} width={40} height={40} />
        <Text className="text-lg font-semibold text-center">{title}</Text>
        {subtitle ? <Text className="text-gray-600 text-center">{subtitle}</Text> : null}
      </View>
    </PopupShell>
  );
}



