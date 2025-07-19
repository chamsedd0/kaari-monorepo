import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import { FaStar, FaCheck } from 'react-icons/fa';

interface HaaniOptionsProps {
  selectedOption: 'haani' | 'haaniMax';
  onSelectOption: (option: 'haani' | 'haaniMax') => void;
}

const HaaniOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 2rem;
  
  .options-title {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  .options-description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }
`;

const OptionCard = styled.div<{ selected: boolean; isPremium?: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: ${Theme.borders.radius.md};
  border: 1px solid ${props => props.selected ? Theme.colors.secondary : Theme.colors.tertiary};
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(143, 39, 206, 0.15)' : 'none'};
  padding: 1.5rem;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  
  &:hover {
    border-color: ${Theme.colors.secondary};
    box-shadow: 0 4px 12px rgba(143, 39, 206, 0.1);
  }
  
  .option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    .option-title {
      display: flex;
      align-items: center;
      
      h3 {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        margin: 0;
        
        .max-label {
          color: ${Theme.colors.secondary};
        }
      }
      
      .star-icon {
        color: ${Theme.colors.secondary};
        margin-left: 0.5rem;
        font-size: 1.25rem;
      }
    }
    
    .price-tag {
      font: ${Theme.typography.fonts.largeB};
      color: ${props => props.isPremium ? Theme.colors.secondary : Theme.colors.gray2};
      
      &.free {
        opacity: 0.7;
      }
    }
  }
  
  .option-features {
    list-style-type: none;
    padding: 0;
    margin: 0;
    
    li {
      display: flex;
      align-items: center;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      margin-bottom: 0.75rem;
      
      &:before {
        content: "•";
        color: ${Theme.colors.secondary};
        margin-right: 0.5rem;
      }
    }
  }
  
  .select-button {
    margin-top: auto;
    padding: 0.75rem 1.5rem;
    background-color: ${props => props.selected ? Theme.colors.secondary : 'transparent'};
    color: ${props => props.selected ? 'white' : Theme.colors.secondary};
    border: 1px solid ${Theme.colors.secondary};
    border-radius: 100px;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: ${props => props.selected ? Theme.colors.primary : Theme.colors.tertiary};
    }
    
    .check-icon {
      margin-right: 0.5rem;
    }
  }
`;

const HaaniOptions: React.FC<HaaniOptionsProps> = ({ selectedOption, onSelectOption }) => {
  return (
    <HaaniOptionsContainer>
      <h2 className="options-title">Protection Options</h2>
      <p className="options-description">
        Choose a protection plan for your booking. Haani Max offers enhanced protection with a full refund option.
      </p>
      
      <div className="options-container">
        <OptionCard 
          selected={selectedOption === 'haani'} 
          onClick={() => onSelectOption('haani')}
        >
          <div className="option-header">
            <div className="option-title">
              <h3>Haani</h3>
            </div>
            <span className="price-tag free">Free</span>
          </div>
          
          <ul className="option-features">
            <li>Included with every booking</li>
            <li>Cancel within 24h if listing doesn't match</li>
          </ul>
          
          <button className="select-button">
            {selectedOption === 'haani' && (
              <>
                <FaCheck className="check-icon" /> Selected
              </>
            )}
            {selectedOption !== 'haani' && 'Select'}
          </button>
        </OptionCard>
        
        <OptionCard 
          selected={selectedOption === 'haaniMax'} 
          isPremium
          onClick={() => onSelectOption('haaniMax')}
        >
          <div className="option-header">
            <div className="option-title">
              <h3>Haani <span className="max-label">Max</span></h3>
              <FaStar className="star-icon" />
            </div>
            <span className="price-tag">250 MAD</span>
          </div>
          
          <ul className="option-features">
            <li>Included with every booking</li>
            <li>Cancel within 24h if listing doesn't match</li>
            <li>Full refund if requested (no questions asked)</li>
            <li>Priority customer support</li>
          </ul>
          
          <button className="select-button">
            {selectedOption === 'haaniMax' && (
              <>
                <FaCheck className="check-icon" /> Selected
              </>
            )}
            {selectedOption !== 'haaniMax' && 'Select'}
          </button>
        </OptionCard>
      </div>
    </HaaniOptionsContainer>
  );
};

export default HaaniOptions; 