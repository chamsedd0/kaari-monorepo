import React from 'react';
import { Image, ImageBackground, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { VText } from './typography';
import { StatusBadge } from './Badges';
import { Timer } from './Timer';
import { PrimaryButton, SecondaryButton } from './Button';
import { RequestStatus } from './RequestStatus';
import InfoIcon from '../../assets/Icon_Info.svg';
import CheckIcon from '../../assets/Icon_Check.svg';
import AlertIcon from '../../assets/Icon_Alert_Round.svg';
import CrossIcon from '../../assets/Icon_Cross.svg';

export type TenantReservationStatus =
  | 'approved_accept'
  | 'approved_report'
  | 'sent_waiting'
  | 'place_is_yours'
  | 'rejected'
  | 'payment_failed'
  | 'cancellation_declined'
  | 'refund_failed'
  | 'refund_in_progress'
  | 'under_review';

export type TenantReservationDetailsCardProps = {
  imageUri: string;
  title: string;
  dateLabel: string;
  priceLabel: string;
  status: TenantReservationStatus;
  untilEpochMs?: number; // used for timer cases
  style?: ViewStyle | ViewStyle[];
  testID?: string;
};

function TopOverlay({ status, untilEpochMs }: { status: TenantReservationStatus; untilEpochMs?: number }) {
  if (status === 'approved_accept' || status === 'approved_report' || status === 'place_is_yours') {
    return <Timer variant="white" size="small" untilEpochMs={untilEpochMs} />;
  }
  const map: Record<TenantReservationStatus, { title: string; subtitle: string }> = {
    approved_accept: { title: '', subtitle: '' },
    approved_report: { title: '', subtitle: '' },
    sent_waiting: { title: 'Waiting', subtitle: 'For advertiser to accept' },
    place_is_yours: { title: '', subtitle: '' },
    rejected: { title: 'Request Rejected', subtitle: 'by the advertiser' },
    payment_failed: { title: 'Payment Failed', subtitle: 'Please, retry payment' },
    cancellation_declined: { title: 'Request Declined', subtitle: 'Your proof is not valid' },
    refund_failed: { title: 'Refund not sent', subtitle: 'Failed to process the refund' },
    refund_in_progress: { title: 'Refund in progress', subtitle: 'Your will receive it soon' },
    under_review: { title: 'Under Review', subtitle: 'Please, wait for our response' },
  };
  const it = map[status];
  if (!it.title) return null;
  return <RequestStatus variant="white" status={it.title} description={it.subtitle} style={{ alignSelf: 'flex-start' }} />;
}

function BadgeFor({ status }: { status: TenantReservationStatus }) {
  const map: Record<TenantReservationStatus, { label: string; variant: 'info' | 'success' | 'danger' | 'primary' }> = {
    approved_accept: { label: 'Approved', variant: 'success' },
    approved_report: { label: 'Approved', variant: 'success' },
    sent_waiting: { label: 'Sent', variant: 'info' },
    place_is_yours: { label: 'Place is yours', variant: 'primary' },
    rejected: { label: 'Rejected', variant: 'danger' },
    payment_failed: { label: 'Failed', variant: 'danger' },
    cancellation_declined: { label: 'Cancellation', variant: 'danger' },
    refund_failed: { label: 'Refund Failed', variant: 'danger' },
    refund_in_progress: { label: 'Awaiting', variant: 'info' },
    under_review: { label: 'Cancelling', variant: 'info' },
  };
  const it = map[status];
  return <StatusBadge label={it.label} variant={it.variant} />;
}

function FooterActions({ status }: { status: TenantReservationStatus }) {
  const Left = (
    <SecondaryButton label="Details" icon={<InfoIcon width={12} height={12} color={colors.primary} />} onPress={() => {}} />
  );
  const rightFor: Partial<Record<TenantReservationStatus, React.ReactNode>> = {
    approved_accept: <PrimaryButton label="Accept" icon={<CheckIcon width={18} height={18} color={colors.white} />} onPress={() => {}} />,
    approved_report: <PrimaryButton label="Report Issue" icon={<AlertIcon width={18} height={18} color={colors.white} />} onPress={() => {}} />,
    sent_waiting: <PrimaryButton label="Cancel" icon={<CrossIcon width={18} height={18} color={colors.white} />} onPress={() => {}} />,
    place_is_yours: <PrimaryButton label="I moved in" icon={<CheckIcon width={18} height={18} color={colors.white} />} onPress={() => {}} />,
    rejected: <PrimaryButton label="Accept" icon={<CheckIcon width={18} height={18} color={colors.white} />} onPress={() => {}} />,
    payment_failed: <PrimaryButton label="Retry" onPress={() => {}} />,
    cancellation_declined: <PrimaryButton label="Resubmit" onPress={() => {}} />,
    refund_failed: <PrimaryButton label="Retry" onPress={() => {}} />,
  };
  const right = rightFor[status];
  if (!right) {
    // single full-width details button
    return <View>{Left}</View>;
  }
  return (
    <View className="flex-row gap-3">
      <View className="flex-1">{Left}</View>
      <View className="flex-1">{right}</View>
    </View>
  );
}

export function TenantReservationDetailsCard({ imageUri, title, dateLabel, priceLabel, status, untilEpochMs, style, testID }: TenantReservationDetailsCardProps) {
  return (
    <View testID={testID} className="rounded-2xl overflow-hidden bg-white" style={[style as any]}>
      {/* Header area with 12px padding and absolutely-filled image */}
      <View className="relative" style={{ width: '100%', aspectRatio: 10 / 4.3, maxHeight: 155 }}>
        <Image
          source={{ uri: imageUri }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, width: '100%', height: '100%', maxHeight: 148 }}
          resizeMode="cover"
        />
        {/* Dim filter for readability */}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        <View style={{ paddingHorizontal: 12, paddingVertical: 12, flex: 1 }}>
          {/* Top row: overlay text/timer and status badge */}
          <View className="flex-row items-start justify-between">
            <View style={{ maxWidth: '70%' }}>
              <TopOverlay status={status} untilEpochMs={untilEpochMs} />
            </View>
            <BadgeFor status={status} />
          </View>
          {/* Spacer to push bottom row to bottom */}
          <View style={{ flex: 1 }} />
          {/* Bottom row: left title/desc, right meta */}
          <View className="flex-row items-end justify-between mt-1">
            <View className="flex-1 pr-3" style={{ maxWidth: '70%' }}>
              <VText className="text-white text-[16px] leading-[16px]" weight="bold">Apartment</VText>
              <VText className="text-white text-[16px] leading-[16px]" weight="medium">flat in the center of Agadir</VText>
            </View>
            <View className="items-end">
              <VText className="text-white text-[12px] leading-[12px]" weight="medium">{dateLabel}</VText>
              <VText className="text-white text-[16px] leading-[16px]" weight="bold">{priceLabel}</VText>
            </View>
          </View>
        </View>
      </View>

      {/* Footer with 12px padding and button row logic preserved */}
      <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
        <FooterActions status={status} />
      </View>
    </View>
  );
}

export default { TenantReservationDetailsCard };


