import React from 'react';
import UnifiedHeader from './unified-header';

// Default export is the new UnifiedHeader
export default UnifiedHeader;

// Backward compatibility exports for old header components

export const HeaderLandingPage: React.FC<{onLanguageChange?: (lang: string) => void}> = (props) => {
  // 1st header - purple background, not logged in, for user landing
  return <UnifiedHeader 
    variant="landing" 
    userType="user" 
    isAuthenticated={false}
    onLanguageChange={props.onLanguageChange} 
  />;
};

export const HeaderAdvertisersLanding: React.FC<{onLanguageChange?: (lang: string) => void}> = (props) => {
  // 5th/6th header - purple background, not logged in, for advertiser landing
  return <UnifiedHeader 
    variant="advertiser-landing" 
    userType="advertiser" 
    isAuthenticated={false}
    onLanguageChange={props.onLanguageChange}
    customLink={{
      text: "Looking for a place?",
      onClick: () => window.location.href = '/'
    }}
  />;
};

export const WhiteHeaderUsers: React.FC<{user?: boolean}> = ({ user = false }) => {
  if (user) {
    // 3rd header - white background, logged in user, with dashboard icons
    return <UnifiedHeader 
      variant="white" 
      userType="user" 
      isAuthenticated={true}
      showSearchBar={true}
    />;
  }
  
  // 2nd header - white background, not logged in, for user areas
  return <UnifiedHeader 
    variant="white" 
    userType="user" 
    isAuthenticated={false}
  />;
};

export const WhiteHeaderAdviser: React.FC<{advertiser: boolean}> = ({ advertiser }) => {
  if (advertiser) {
    // 4th header - white background, logged in advertiser
    return <UnifiedHeader 
      variant="white" 
      userType="advertiser" 
      isAuthenticated={true}
      showSearchBar={true}
    />;
  }
  
  // Default fallback
  return <UnifiedHeader 
    variant="white" 
    userType="advertiser" 
    isAuthenticated={false}
    customLink={{
      text: "Looking for a place?",
      onClick: () => window.location.href = '/'
    }}
  />;
};

// Use these exports as direct replacements for the old components:
// import { HeaderLandingPage } from '../../components/skeletons/constructed/headers';
// import { HeaderAdvertisersLanding } from '../../components/skeletons/constructed/headers';
// import { WhiteHeaderUsers } from '../../components/skeletons/constructed/headers';
// import { WhiteHeaderAdviser } from '../../components/skeletons/constructed/headers';

// Or use the unified header directly for more control:
// import UnifiedHeader from '../../components/skeletons/constructed/headers'; 