import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import OnboardingSlide from '../../../src/components/OnboardingSlide';

const slides = [
  {
    title: 'Book a Photoshoot',
    subtitle: 'Request a photoshoot from team Kaari to advertise your property!',
  },
  {
    title: 'We will post for you!',
    subtitle: "Our agent will be at your photoshoot and we'll post your property on the app.",
  },
  {
    title: 'Start getting requests',
    subtitle: "Once listed, you'll receive requests from potential tenants. You're now an advertiser!",
  },
  {
    title: "Guaranteed payment after move-in",
    subtitle: 'Payments are released 24 hours after tenant move-in to protect both parties.',
  },
];

export default function AdvertiserOnboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goNext = () => {
    if (index + 1 < total) setIndex(index + 1);
    else router.replace('/login');
  };
  const goBack = () => {
    if (index > 0) setIndex(index - 1);
  };
  const skip = () => router.replace('/login');

  const s = slides[index];
  return (
    <OnboardingSlide
      index={index}
      total={total}
      title={s.title}
      subtitle={s.subtitle}
      onNext={goNext}
      onBack={index > 0 ? goBack : undefined}
      onSkip={skip}
      finalLabel="Start Hosting"
    />
  );
}


