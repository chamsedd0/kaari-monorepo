import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';

// Define prop types for the component
interface BookingDetailProps {
  label: string;
  value: string | number | boolean | null | undefined;
  fullWidth?: boolean;
}

interface BookingDetailsComponentProps {
  personalDetails?: {
    [key: string]: string | number | boolean | null | undefined;
  };
  otherDetails?: {
    [key: string]: string | number | boolean | null | undefined;
  };
  message?: string;
}

// Styled components for BookingDetails
const BookingDetailsContainer = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.lg};
  border: ${Theme.borders.primary};
  padding: 1.5rem;
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font: ${Theme.typography.fonts.largeB};
  color: ${Theme.colors.black};
  margin-bottom: 1rem;
`;

const SectionDescription = styled.p`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  margin-bottom: 1.5rem;
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  grid-column: ${props => props.fullWidth ? '1 / span 2' : 'auto'};
  
  @media (max-width: 480px) {
    grid-column: 1;
  }
`;

const DetailLabel = styled.div`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  position: relative;
  max-width: 60%;
`;

const DetailValue = styled.div`
  font: ${Theme.typography.fonts.mediumB};
  color: ${Theme.colors.black};
  text-align: right;
  max-width: 40%;
`;

const DottedLine = styled.div`
  flex: 1;
  border-bottom: 1px dotted ${Theme.colors.tertiary};
  margin: 0 0.5rem;
  position: relative;
  bottom: 4px;
`;

const MessageContainer = styled.div`
  grid-column: 1 / span 2;
  margin-top: 1rem;
`;

const MessageLabel = styled.div`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.gray2};
  margin-bottom: 0.5rem;
`;

const MessageValue = styled.div`
  font: ${Theme.typography.fonts.mediumM};
  color: ${Theme.colors.black};
  background-color: ${Theme.colors.background};
  padding: 1rem;
  border-radius: ${Theme.borders.radius.md};
  white-space: pre-wrap;
  border: ${Theme.borders.tertiary};
`;

// BookingDetail component for individual items
const BookingDetail: React.FC<BookingDetailProps> = ({ label, value, fullWidth }) => {
  // Format the value for display
  const displayValue = (() => {
    if (value === null || value === undefined) return "-";
    
    // Handle boolean values
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    // Handle objects that might be timestamps
    if (typeof value === 'object') {
      // Check if it's a timestamp object
      if ('seconds' in value && 'nanoseconds' in value) {
        const date = new Date((value.seconds as number) * 1000);
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
      // For other objects, return a string representation
      return JSON.stringify(value);
    }
    
    return String(value);
  })();

  return (
    <DetailItem fullWidth={fullWidth}>
      <DetailLabel>{label}</DetailLabel>
      <DottedLine />
      <DetailValue>{displayValue}</DetailValue>
    </DetailItem>
  );
};

// Main BookingDetailsComponent
const BookingDetailsComponent: React.FC<BookingDetailsComponentProps> = ({ 
  personalDetails = {}, 
  otherDetails = {}, 
  message 
}) => {
  // Helper function to format field labels
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/Id$/i, 'ID') // Replace Id/id with ID
      .replace(/Url$/i, 'URL'); // Replace Url/url with URL
  };

  // Developer/system fields to always hide
  const developerFields = [
    'id', 'propertyId', '__typename', 'userId', 'clientId', 'advertiserId',
    'documentId', 'transactionId', 'activityId', 'batchId', 'messageId'
  ];

  // Group fields into categories for better organization
  const personalFieldEntries = Object.entries(personalDetails)
    .filter(([key, value]) => 
      !developerFields.includes(key) && 
      value !== undefined && 
      value !== null
    )
    // Sort fields alphabetically for consistency
    .sort((a, b) => a[0].localeCompare(b[0]));

  const otherFieldEntries = Object.entries(otherDetails)
    .filter(([key, value]) => 
      !developerFields.includes(key) && 
      value !== undefined && 
      value !== null
    )
    // Sort fields alphabetically for consistency
    .sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <BookingDetailsContainer>
      <SectionTitle>Booking Details</SectionTitle>
      <SectionDescription>
        These are the details that were shown to your advertiser. Some information like your contact information or your surname will not be shared with the advertiser.
      </SectionDescription>
      
      {personalFieldEntries.length > 0 && (
        <>
          <SectionTitle>Personal Information</SectionTitle>
          <DetailsList>
            {personalFieldEntries.map(([key, value]) => (
              <BookingDetail 
                key={key} 
                label={formatLabel(key)} 
                value={value} 
              />
            ))}
          </DetailsList>
        </>
      )}
      
      {otherFieldEntries.length > 0 && (
        <>
          <SectionTitle>Property Details</SectionTitle>
          <DetailsList>
            {otherFieldEntries.map(([key, value]) => (
              <BookingDetail 
                key={key} 
                label={formatLabel(key)} 
                value={value}
              />
            ))}
          </DetailsList>
        </>
      )}
      
      {message && (
        <>
          <SectionTitle>Additional Information</SectionTitle>
          <MessageContainer>
            <MessageValue>{message}</MessageValue>
          </MessageContainer>
        </>
      )}
    </BookingDetailsContainer>
  );
};

export default BookingDetailsComponent; 