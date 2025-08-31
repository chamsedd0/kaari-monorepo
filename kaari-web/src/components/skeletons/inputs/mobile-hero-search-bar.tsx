import React from 'react';
import { useNavigate } from 'react-router-dom';

export const MobileHeroSearchBar: React.FC = () => {
  const navigate = useNavigate();

  const goToSearch = () => navigate('/properties');

  return (
    <div className="mobile-hero-search" role="group" aria-label="Search">
      <button className="section" onClick={goToSearch} aria-label="Choose location">
        <span className="label">Location</span>
        <span className="value">Where to?</span>
      </button>
      <div className="divider" aria-hidden="true" />
      <button className="section" onClick={goToSearch} aria-label="Choose dates">
        <span className="label">Dates</span>
        <span className="value">Anytime</span>
      </button>
      <div className="divider" aria-hidden="true" />
      <button className="section" onClick={goToSearch} aria-label="Choose guests">
        <span className="label">Guests</span>
        <span className="value">Add</span>
      </button>
    </div>
  );
};

export default MobileHeroSearchBar;


