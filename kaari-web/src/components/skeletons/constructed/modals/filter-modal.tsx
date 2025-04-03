import React, { useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FilterModalOverlayStyle, FilterModalStyle } from '../../../styles/constructed/modals/filter-modal-style';

interface FilterType {
  id: string;
  label: string;
  category: 'bedrooms' | 'price' | 'amenities' | 'other';
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  availableFilters: FilterType[];
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilters,
  toggleFilter,
  clearFilters,
  availableFilters
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <FilterModalOverlayStyle>
      <FilterModalStyle ref={modalRef}>
        <div className="filter-modal-header">
          <h3>Filter Properties</h3>
          <button className="close-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        
        <div className="filter-modal-body">
          <div className="filter-section">
            <h4>Bedrooms</h4>
            <div className="filter-options">
              {availableFilters
                .filter(filter => filter.category === 'bedrooms')
                .map(filter => (
                  <div 
                    key={filter.id}
                    className={`filter-option ${activeFilters.includes(filter.label) ? 'active' : ''}`}
                    onClick={() => toggleFilter(filter.label)}
                  >
                    {filter.label}
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="filter-options">
              {availableFilters
                .filter(filter => filter.category === 'price')
                .map(filter => (
                  <div 
                    key={filter.id}
                    className={`filter-option ${activeFilters.includes(filter.label) ? 'active' : ''}`}
                    onClick={() => toggleFilter(filter.label)}
                  >
                    {filter.label}
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Amenities</h4>
            <div className="filter-options">
              {availableFilters
                .filter(filter => filter.category === 'amenities')
                .map(filter => (
                  <div 
                    key={filter.id}
                    className={`filter-option ${activeFilters.includes(filter.label) ? 'active' : ''}`}
                    onClick={() => toggleFilter(filter.label)}
                  >
                    {filter.label}
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="filter-section">
            <h4>Other</h4>
            <div className="filter-options">
              {availableFilters
                .filter(filter => filter.category === 'other')
                .map(filter => (
                  <div 
                    key={filter.id}
                    className={`filter-option ${activeFilters.includes(filter.label) ? 'active' : ''}`}
                    onClick={() => toggleFilter(filter.label)}
                  >
                    {filter.label}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        
        <div className="filter-modal-footer">
          <button 
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear All
          </button>
          <button 
            className="apply-filters"
            onClick={onClose}
          >
            Apply Filters
          </button>
        </div>
      </FilterModalStyle>
    </FilterModalOverlayStyle>
  );
}; 