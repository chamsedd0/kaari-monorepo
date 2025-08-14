import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import OnboardingSlide from '../../../src/components/OnboardingSlide';

const slides = [
  {
    title: 'Search for a place',
    subtitle: 'Search for the best place you can and get prepared to get it fast',
  },
  {
    title: 'Send your request',
    subtitle: 'Book a place for yourself and securely pay online all within our app',
  },
  {
    title: 'Enjoy your new place!',
    subtitle: "You will need to confirm your reservation. Once it's done, your payment will be processed",
  },
  {
    title: '24 hours protection',
    subtitle: 'Your payment is secure with us. It will only be processed 24 hours after your move-in',
  },
];

export default function TenantOnboarding() {
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
    <OnboardingSlide index={index} total={total} title={s.title} subtitle={s.subtitle} onNext={goNext} onBack={index > 0 ? goBack : undefined} onSkip={skip} />
  );
}


