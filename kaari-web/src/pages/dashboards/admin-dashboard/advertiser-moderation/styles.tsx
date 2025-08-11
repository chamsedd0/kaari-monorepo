import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const Container = styled.div`
  padding: 20px;
  width: 100%;
  
  h2 {
    margin-bottom: 20px;
    font: ${Theme.typography.fonts.h3};
  }
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

export const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${Theme.colors.gray2};
  }
  
  input {
    width: 100%;
    padding: 8px 10px 8px 35px;
    border: 1px solid ${Theme.colors.gray};
    border-radius: 4px;
    font: ${Theme.typography.fonts.smallM};
    
    &:focus {
      outline: none;
      border-color: ${Theme.colors.secondary};
    }
  }
`;

export const FilterSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  background-color: white;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

export const AdvertiserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  overflow: hidden;
`;

export const TableHeader = styled.tr`
  background-color: #f8f9fa;
  
  th {
    padding: 12px 15px;
    text-align: left;
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.gray2};
    border-bottom: 1px solid ${Theme.colors.gray};
  }
`;

export const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3eefb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.colors.gray};
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font: ${Theme.typography.fonts.smallB};
    
    &.active {
      background-color: #e6f4ea;
      color: #137333;
    }
    
    &.suspended {
      background-color: #fce8e6;
      color: #c5221f;
    }
    
    &.live {
      background-color: #e6f4ea;
      color: #137333;
    }
    
    &.hidden {
      background-color: #f1f3f4;
      color: #5f6368;
    }
    
    &.pending {
      background-color: #fef7e0;
      color: #b06000;
    }
    
    &.done {
      background-color: #e6f4ea;
      color: #137333;
    }
    
    &.await-confirm {
      background-color: #fef7e0;
      color: #b06000;
    }
    
    &.confirmed {
      background-color: #e6f4ea;
      color: #137333;
    }
    
    &.safety-window-closed {
      background-color: #f1f3f4;
      color: #5f6368;
    }
  }
`;

export const TableCell = styled.td`
  padding: 10px 15px;
  font: ${Theme.typography.fonts.smallM};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
  
  button {
    padding: 5px 10px;
    background-color: white;
    border: 1px solid ${Theme.colors.gray};
    border-radius: 4px;
    cursor: pointer;
    font: ${Theme.typography.fonts.smallM};
    
    &:hover:not(:disabled) {
      background-color: #f3eefb;
      border-color: ${Theme.colors.secondary};
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  span {
    font: ${Theme.typography.fonts.smallM};
  }
`;

export const DetailContainer = styled.div`
  padding: 20px;
  width: 100%;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 8px 0;
  margin-bottom: 20px;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.secondary};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font: ${Theme.typography.fonts.h3};
    margin: 0;
  }
  
  .status {
    padding: 6px 12px;
    border-radius: 4px;
    font: ${Theme.typography.fonts.smallB};
    
    &.active {
      background-color: #e6f4ea;
      color: #137333;
    }
    
    &.suspended {
      background-color: #fce8e6;
      color: #c5221f;
    }
  }
`;

export const DetailStats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

export const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  min-width: 150px;
  
  .label {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
    margin-bottom: 5px;
  }
  
  .value {
    font: ${Theme.typography.fonts.mediumB};
  }
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${Theme.colors.gray};
  margin-bottom: 20px;
`;

export const Tab = styled.div<{ $active?: boolean }>`
  padding: 12px 20px;
  font: ${Theme.typography.fonts.smallB};
  color: ${props => props.$active ? Theme.colors.secondary : Theme.colors.gray2};
  border-bottom: ${props => props.$active ? `2px solid ${Theme.colors.secondary}` : '2px solid transparent'};
  cursor: pointer;
  
  &:hover {
    color: ${Theme.colors.secondary};
  }
`;

export const TabContent = styled.div<{ $visible?: boolean }>`
  display: ${props => props.$visible ? 'block' : 'none'};
  
  .referral-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .referral-content {
    padding: 20px;
    background-color: white;
    border: 1px solid ${Theme.colors.gray};
    border-radius: 4px;
  }
`;

export const NoteBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  
  h4 {
    font: ${Theme.typography.fonts.smallB};
    margin-bottom: 10px;
  }
`;

export const NoteInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

export const SaveNoteButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  
  &:hover {
    background-color: ${Theme.colors.secondary};
  }
`; 