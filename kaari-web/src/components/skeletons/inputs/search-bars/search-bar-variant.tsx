import React from 'react';
import SearchBarBaseModel from '../../../styles/inputs/search-bars/search-bar-base-model-style';
import SearchIcon from '../../icons/Search-Icon.svg';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarModel: React.FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
  return (
    <SearchBarBaseModel>
        <img src={SearchIcon} alt="search" />
        <input type="text" placeholder={placeholder} value={value} onChange={onChange} />
    </SearchBarBaseModel>
  );
};

export default SearchBarModel;
