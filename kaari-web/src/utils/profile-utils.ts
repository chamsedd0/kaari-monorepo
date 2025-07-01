import { User } from '../backend/entities';

/**
 * Checks if the user's profile is complete by verifying essential fields are filled
 * Returns true if profile is complete, false if profile is incomplete
 */
export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  
  // List of required fields that should be filled out
  const requiredFields: Array<keyof User> = [
    'email',
    'name',
    'surname',
    'phoneNumber',
    'dateOfBirth',
    'gender',
    'nationality'
  ];
  
  // Check if all required fields are filled
  const missingFields = requiredFields.filter(field => {
    const value = user[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  // Check if identification documents are uploaded
  const hasIdentificationDocuments = 
    user.identificationDocuments && 
    (user.identificationDocuments.frontId || user.identificationDocuments.backId);
  
  // Check if profile is complete
  
  return missingFields.length === 0 && hasIdentificationDocuments;
};

/**
 * Returns a formatted message for the user with missing profile fields
 */
export const getProfileCompletionMessage = (user: User | null): string => {
  if (!user) return 'Please complete your profile information.';
  
  // List of required fields with user-friendly names
  const requiredFieldsMap: Record<keyof User | string, string> = {
    email: 'Email',
    name: 'Full Name',
    surname: 'Surname',
    phoneNumber: 'Phone Number',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    nationality: 'Nationality',
    identificationDocuments: 'Identification Documents'
  };
  
  // Check which fields are missing
  const missingFields = Object.keys(requiredFieldsMap)
    .filter(field => {
      if (field === 'identificationDocuments') {
        return !(
          user.identificationDocuments && 
          (user.identificationDocuments.frontId || user.identificationDocuments.backId)
        );
      }
      
      const key = field as keyof User;
      const value = user[key];
      return !value || (typeof value === 'string' && value.trim() === '');
    });
  
  // Format the message based on number of missing fields
  if (missingFields.length === 0) {
    return 'Your profile is complete!';
  } else if (missingFields.length === 1) {
    return `Please add your ${requiredFieldsMap[missingFields[0]]} to complete your profile.`;
  } else if (missingFields.length <= 3) {
    const fieldNames = missingFields.map(field => requiredFieldsMap[field]);
    return `Please add your ${fieldNames.join(', ')} to complete your profile.`;
  } else {
    const fieldNames = missingFields.map(field => requiredFieldsMap[field]);
    return `Your profile is incomplete. Please add: ${fieldNames.join(', ')}.`;
  }
}; 