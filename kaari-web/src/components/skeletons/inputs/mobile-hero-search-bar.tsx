import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';

type Props = {
  onOpenLocation?: () => void;
  onOpenDates?: () => void;
  onOpenGuests?: () => void;
  locationLabel?: string;
  dateLabel?: string;
  guestsLabel?: string;
};

export const MobileHeroSearchBar: React.FC<Props> = ({
  onOpenLocation,
  onOpenDates,
  onOpenGuests,
  locationLabel,
  dateLabel,
  guestsLabel
}) => {
  const navigate = useNavigate();

  // Local mirror for display only; prefer labels from parent when provided
  const [location] = useState<string>(locationLabel || '');
  const [moveInDate] = useState<string>(dateLabel || '');
  const [guests] = useState<number>(guestsLabel ? Number(guestsLabel) : 0);

  const goToSearch = () => {
    const params = new URLSearchParams();
    const city = (locationLabel ?? location) || '';
    const date = (dateLabel ?? moveInDate) || '';
    const guestsVal = guestsLabel ?? (guests > 0 ? String(guests) : '');
    if (city) params.set('city', city);
    if (date) params.set('moveIn', date);
    if (guestsVal) params.set('guests', String(guestsVal));
    // Pass lat/lng if present on window (set by page when marker moves)
    const lat = (window as any).__search_lat as number | undefined;
    const lng = (window as any).__search_lng as number | undefined;
    if (typeof lat === 'number' && typeof lng === 'number') {
      params.set('lat', String(lat));
      params.set('lng', String(lng));
      // Include a default radius (in km)
      params.set('radius', '15');
    }
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const displayLocation = useMemo(() => (locationLabel ?? location) || 'Where to?', [location, locationLabel]);
  const displayDate = useMemo(() => dateLabel || (moveInDate ? new Date(moveInDate).toLocaleDateString() : 'Anytime'), [moveInDate, dateLabel]);
  const displayGuests = useMemo(() => guestsLabel || (guests > 0 ? `${guests}` : 'Add'), [guests, guestsLabel]);

  return (
    <div className="mobile-hero-search" role="group" aria-label="Search">
      <button className="section" onClick={onOpenLocation} aria-label="Choose location">
        <span className="label">Location</span>
        <span className="value">{displayLocation}</span>
      </button>
      <div className="divider" aria-hidden="true" />
      <button className="section" onClick={onOpenDates} aria-label="Choose dates">
        <span className="label">Dates</span>
        <span className="value">{displayDate}</span>
      </button>
      <div className="divider" aria-hidden="true" />
      <button className="section" onClick={onOpenGuests} aria-label="Choose guests">
        <span className="label">Guests</span>
        <span className="value">{displayGuests}</span>
      </button>
      <button className="search-go" onClick={goToSearch} aria-label="Search">
        <IoArrowForward />
      </button>
    </div>
  );
};

export default MobileHeroSearchBar;


