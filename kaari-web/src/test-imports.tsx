import React from 'react';
import { getAdvertiserSignupData } from './backend/server-actions/AdvertiserServerActions';
import { getUserById } from './backend/server-actions/UserServerActions';

const TestImports: React.FC = () => {
  const testFunction = async () => {
    try {
      const userData = await getAdvertiserSignupData('test-user-id');
      console.log('Advertiser data:', userData);
    } catch (error) {
      console.error('Error testing import:', error);
    }
  };

  return (
    <div>
      <h1>Test Imports</h1>
      <button onClick={testFunction}>Test Import</button>
    </div>
  );
};

export default TestImports; 