import { Text, View } from 'react-native';

type Props = {
  label: string;
  color?: 'primary' | 'info' | 'success' | 'danger';
  className?: string;
};

const colorMap: Record<NonNullable<Props['color']>, string> = {
  primary: 'bg-primary text-white',
  info: 'bg-info text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
};

export function SectionBadge({ label, color = 'primary', className }: Props) {
  return (
    <View className={`absolute left-0 -top-0 rounded-tl-2xl rounded-br-2xl px-6 py-3 ${colorMap[color]} ${className ?? ''}`}>
      <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-sm text-white">{label}</Text>
    </View>
  );
}


