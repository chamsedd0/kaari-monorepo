import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

// Additional styles specific to the bookings page
export const BookingStatusDot = styled.div<{ status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.status) {
      case 'Await-Advertiser':
        return '#ffc107'; // yellow
      case 'Await-Tenant-Confirm':
        return '#fd7e14'; // orange
      case 'Confirmed':
        return '#28a745'; // green
      case 'Cancelled':
        return '#6c757d'; // grey
      default:
        return '#6c757d';
    }
  }};
`;

export const DetailPanel = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
`;

export const DetailItem = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const DetailItemTitle = styled.div`
  font-weight: 500;
  color: ${Theme.colors.secondary};
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

export const DetailItemContent = styled.div`
  font-size: 1rem;
`;

export const TimelineContainer = styled.div`
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 0.9rem;
`;

export const PropertyCard = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const PropertyImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PropertyInfo = styled.div`
  flex: 1;
`;

export const PropertyTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
`;

export const PropertyAddress = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

export const PropertyFeatures = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

export const PropertyFeature = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #555;
  
  svg {
    margin-right: 5px;
    color: ${Theme.colors.secondary};
  }
`;

export const TimerWrapper = styled.div<{ isWarning?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.isWarning ? '#dc3545' : 'inherit'};
  font-weight: ${props => props.isWarning ? 'bold' : 'normal'};
  
  svg {
    margin-right: 5px;
    color: ${props => props.isWarning ? '#dc3545' : '#666'};
  }
`;

export const NotesSection = styled.div`
  margin-top: 20px;
`;

export const NotesList = styled.div`
  margin-top: 10px;
`;

export const NoteItem = styled.div`
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8rem;
  color: #666;
`;

export const NoteContent = styled.div`
  font-size: 0.9rem;
`;

export const ActionBar = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;

export const TabsContainer = styled.div`
  margin-bottom: 20px;
`;

export const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
`;

export const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-bottom: ${props => props.active ? `2px solid ${Theme.colors.secondary}` : 'none'};
  color: ${props => props.active ? Theme.colors.secondary : '#333'};
  
  &:hover {
    color: ${Theme.colors.secondary};
  }
`;

export const TabPanel = styled.div`
  padding: 20px 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
  
  svg {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #ddd;
  }
`;

export const EmptyStateMessage = styled.div`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

export const EmptyStateSubMessage = styled.div`
  font-size: 0.9rem;
  color: #999;
`; 