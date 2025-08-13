import React from 'react';
import { View, Text, Image } from 'react-native';
import { colors } from '~/theme/colors';
import TimerDisplay from '~/components/primitives/TimerDisplay';
import PressableSurface from '~/components/primitives/PressableSurface';
import GirlCamera from '~/../assets/girl-camera.svg';

export type PhotoshootScheduleCardProps = {
	date: string;
	remainingSeconds: number;
	agentName: string;
	agentSubtitle: string;
	agentAvatarUri?: string;
	onContact?: () => void;
	onReschedule?: () => void;
};

export default function PhotoshootScheduleCard({
	date,
	remainingSeconds,
	agentName,
	agentSubtitle,
	agentAvatarUri,
	onContact,
	onReschedule,
}: PhotoshootScheduleCardProps) {
	return (
		<View className="rounded-2xl border" style={{ backgroundColor: colors.white, borderColor: colors.gray200 }}>
			{/* Header */}
			<View className="flex-row items-center justify-between px-4 pt-3">
				<View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.primaryTint2 }}>
					<Text style={{ color: colors.primary, fontWeight: '800' }}>Photoshoot</Text>
				</View>
				<Text className="text-gray500">{date}</Text>
			</View>
			{/* Content */}
			<View className="flex-row items-center justify-between px-4 pb-4 pt-3">
				{/* Left: timer and agent */}
				<View className="flex-1 pr-3">
					<TimerDisplay size="small" scheme="purple" mode="countdown" initialSeconds={remainingSeconds} />
					<View className="flex-row items-center mt-3">
						{agentAvatarUri ? (
							<Image source={{ uri: agentAvatarUri }} style={{ width: 28, height: 28, borderRadius: 14 }} />
						) : (
							<View className="w-7 h-7 rounded-full" style={{ backgroundColor: colors.gray200 }} />
						)}
						<View className="ml-2">
							<Text className="font-extrabold text-gray700">{agentName}</Text>
							<Text className="text-gray500">{agentSubtitle}</Text>
						</View>
					</View>
				</View>
				{/* Right: illustration */}
				<View className="items-center justify-center pr-2">
					<View className="w-24 h-24 items-center justify-center rounded-full" style={{ backgroundColor: colors.primaryTint2 }}>
						<GirlCamera width={88} height={100} />
					</View>
				</View>
			</View>
			{/* Footer actions */}
			<View className="flex-row">
				<PressableSurface onPress={onContact} borderRadius={0} pressedBackground={colors.gray100}>
					<View className="flex-1 items-center justify-center py-3" style={{ borderTopWidth: 1, borderColor: colors.gray200 }}>
						<Text style={{ color: colors.primary, fontWeight: '800' }}>Contact Agent</Text>
					</View>
				</PressableSurface>
				<View style={{ width: 1, backgroundColor: colors.gray200 }} />
				<PressableSurface onPress={onReschedule} borderRadius={0} pressedBackground={colors.gray100}>
					<View className="flex-1 items-center justify-center py-3" style={{ borderTopWidth: 1, borderColor: colors.gray200 }}>
						<Text style={{ color: colors.primary, fontWeight: '800' }}>Reschedule</Text>
					</View>
				</PressableSurface>
			</View>
		</View>
	);
}


