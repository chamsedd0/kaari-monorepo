import React, { useMemo } from 'react';
import styled from 'styled-components';
import { IoLocationOutline, IoCalendarOutline, IoPersonOutline, IoSearch, IoOptions, IoCheckmark } from 'react-icons/io5';
import { Theme } from '../../../../theme/theme';
import { useTranslation } from 'react-i18next';

const Bar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
`;

const Segments = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 999px;
  width: 100%;
  height: 48px;
  overflow: hidden;
`;

const Segment = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
  font-size: 14px;
  color: #1E293B;
  min-width: 0;

  svg { color: #64748B; min-width: 18px; }
  span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  &:not(:last-child) { border-right: 1px solid #E2E8F0; }
`;

const CircleButton = styled.button`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: none;
  background: ${Theme.colors.secondary};
  color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const FilterButton = styled(CircleButton)`
  background: transparent;
  color: ${Theme.colors.secondary};
  border: 1px solid ${Theme.colors.secondary};
`;

interface Props {
  onLocationChange: (location: string) => void;
  onDateChange: (date: string) => void;
  onGenderChange: (gender: string) => void;
  onSearch: () => void;
  onAdvancedFilteringClick: () => void;
  location: string;
  date: string;
  gender: string; // number of people ("1", "2", ..., "7+")
  confirmMode?: boolean; // when true, show check icon and call onAdvancedFilteringClick
  onOpenLocation?: () => void;
  onOpenDate?: () => void;
  onOpenPeople?: () => void;
}

const formatDateShort = (date: string, t: (k: string, d?: any) => string) => {
  if (!date) return t('common.date');
  const d = new Date(date);
  if (isNaN(d.getTime())) return t('common.date');
  return new Intl.DateTimeFormat(navigator.language, { month: 'short', day: 'numeric' }).format(d);
};

const capacityLabel = (gender: string, t: (k: string, d?: any) => string) => {
  if (!gender) return t('common.number_of_people');
  if (gender === '7+') return t('common.person_count_plus', { count: 7 });
  const n = parseInt(gender, 10);
  if (!isNaN(n)) return t('common.person_count', { count: n });
  return t('common.number_of_people');
};

const SearchFilterBarMobile: React.FC<Props> = ({
  onLocationChange,
  onDateChange,
  onGenderChange,
  onSearch,
  onAdvancedFilteringClick,
  location,
  date,
  gender,
  confirmMode = false,
  onOpenLocation,
  onOpenDate,
  onOpenPeople
}) => {
  const { t } = useTranslation();

  const dateText = useMemo(() => formatDateShort(date, t), [date, t]);
  const peopleText = useMemo(() => capacityLabel(gender, t), [gender, t]);

  return (
    <Bar>
      <Segments>
        <Segment onClick={() => {
          if (onOpenLocation) { onOpenLocation(); return; }
          const value = prompt(t('common.city_region')) || '';
          onLocationChange(value);
        }} aria-label="Location">
          <IoLocationOutline />
          <span>{location || t('common.city_region')}</span>
        </Segment>

        <Segment onClick={() => {
          if (onOpenDate) { onOpenDate(); return; }
          const value = prompt(t('common.pick_date_format', { defaultValue: 'YYYY-MM-DD' })) || '';
          onDateChange(value);
        }} aria-label="Date">
          <IoCalendarOutline />
          <span>{dateText}</span>
        </Segment>

        <Segment onClick={() => {
          if (onOpenPeople) { onOpenPeople(); return; }
          const value = prompt(t('common.number_of_people')) || '';
          onGenderChange(value);
        }} aria-label="People">
          <IoPersonOutline />
          <span>{peopleText}</span>
        </Segment>
      </Segments>

      <CircleButton aria-label="Search" onClick={onSearch}>
        <IoSearch size={20} />
      </CircleButton>

      <FilterButton aria-label={confirmMode ? 'Apply filters' : 'Open filters'} onClick={onAdvancedFilteringClick}>
        {confirmMode ? <IoCheckmark size={20} /> : <IoOptions size={20} />}
      </FilterButton>
    </Bar>
  );
};

export default SearchFilterBarMobile;


