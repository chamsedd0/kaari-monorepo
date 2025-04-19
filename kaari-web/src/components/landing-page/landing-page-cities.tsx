import React from 'react';

interface City {
  id: number;
  name: string;
  imageUrl: string;
}

interface CitySectionProps {
  cities: City[];
}

const CitySection: React.FC<CitySectionProps> = ({ cities }) => {
  return (
    <section className="city-selection">
      <h2>Popular Cities for Rentals</h2>
      <button className="view-all">View All Cities</button>
      
      <div className="city-grid">
        {cities.map((city) => (
          <div key={city.id} className="city-card">
            <img src={city.imageUrl} alt={city.name} />
            <div className="city-label">{city.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CitySection; 