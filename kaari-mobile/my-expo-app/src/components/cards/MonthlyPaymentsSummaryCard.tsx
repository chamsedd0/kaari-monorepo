import { Text, View } from 'react-native';
import { SectionBadge } from '../ui/SectionBadge';

type Props = {
  month: string; // 'April 2024'
  income: string; // '3000$'
  tenants: number;
  april?: string;
  total: string;
};

export function MonthlyPaymentsSummaryCard({ month, income, tenants, april = '1500$', total }: Props) {
  return (
    <View className="rounded-2xl border border-gray100 bg-white p-5 relative">
      <SectionBadge label="Payments" color="primary" />
      <Text className="absolute right-4 top-4 text-gray500 text-xs">{month}</Text>
      <Text style={{ fontFamily: 'VisbyCF-Heavy' }} className="text-primaryDark text-4xl self-center mt-3">{income}</Text>
      <Text className="text-black font-semibold self-center mt-1">This month’s income</Text>
      <View className="flex-row justify-between mt-5">
        <View>
          <Text className="text-gray500 text-xs">Tenants</Text>
          <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-black text-xl mt-1">{tenants}</Text>
        </View>
        <View>
          <Text className="text-gray500 text-xs">April</Text>
          <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-black text-xl mt-1">{april}</Text>
        </View>
        <View>
          <Text className="text-gray500 text-xs">Total</Text>
          <Text style={{ fontFamily: 'VisbyCF-Bold' }} className="text-black text-xl mt-1">{total}</Text>
        </View>
      </View>
    </View>
  );
}


