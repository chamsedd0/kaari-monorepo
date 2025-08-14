import Constants from 'expo-constants';

type ExtraConfig = {
  apiBaseUrl?: string;
  environment?: 'development' | 'staging' | 'production';
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
};

const extra: ExtraConfig = (Constants.expoConfig?.extra as any) || {};

export const env = {
  apiBaseUrl: extra.apiBaseUrl || 'http://localhost:3000',
  environment: extra.environment || 'development',
  firebase: extra.firebase,
};


