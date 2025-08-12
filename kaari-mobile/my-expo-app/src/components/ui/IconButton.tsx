import { Pressable } from 'react-native';
import { Icon, IconName } from './Icon';

type Props = { name: IconName; onPress?: () => void; variant?: 'filled' | 'ghost' };

export function IconButton({ name, onPress, variant = 'ghost' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-10 h-10 rounded-full items-center justify-center ${
        variant === 'filled' ? 'bg-primary' : 'bg-gray100'
      }`}
    >
      <Icon name={name} width={20} height={20} fill={variant === 'filled' ? '#fff' : '#000'} />
    </Pressable>
  );
}


