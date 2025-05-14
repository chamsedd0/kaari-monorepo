import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FaSearch, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../../backend/models/entities';
import { getAllProperties } from '../../../backend/server-actions/PropertyServerActions';
import { useToastService } from '../../../services/ToastService';

const PropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastService();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertiesData = await getAllProperties();
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/dashboard/admin/properties/edit/${propertyId}`);
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PropertyPageContainer>
      <h1>Properties</h1>

      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by title, type, or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading properties...</div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadProperties}>Retry</button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="empty-state">No properties found matching your criteria.</div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map(property => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <img src={property.images[0]} alt={property.title} />
              </div>
              <div className="property-info">
                <h3>{property.title}</h3>
                <p className="property-type">{property.propertyType}</p>
                <p className="property-price">${property.price}/month</p>
                <p className="property-location">
                  {property.address.city}, {property.address.country}
                </p>
                <button
                  className="edit-button"
                  onClick={() => handleEditProperty(property.id)}
                >
                  <FaEdit /> Edit Property
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PropertyPageContainer>
  );
};

const PropertyPageContainer = styled.div`
  padding: 2rem;

  h1 {
    font: ${Theme.typography.fonts.h3};
    margin-bottom: 1.5rem;
  }

  .search-box {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid ${Theme.colors.tertiary};
    border-radius: ${Theme.borders.radius.sm};
    padding: 0 1rem;
    margin-bottom: 2rem;
    width: 300px;
    
    input {
      flex: 1;
      border: none;
      padding: 0.75rem 0;
      outline: none;
      
      &::placeholder {
        color: ${Theme.colors.gray2};
      }
    }
    
    svg {
      color: ${Theme.colors.gray2};
      margin-right: 0.5rem;
    }
  }

  .properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;

    .property-card {
      background-color: white;
      border-radius: ${Theme.borders.radius.lg};
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .property-image {
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .property-info {
        padding: 1.5rem;

        h3 {
          font: ${Theme.typography.fonts.mediumB};
          margin-bottom: 0.5rem;
        }

        .property-type {
          color: ${Theme.colors.gray2};
          font: ${Theme.typography.fonts.smallM};
          margin-bottom: 0.5rem;
          text-transform: capitalize;
        }

        .property-price {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.primary};
          margin-bottom: 0.5rem;
        }

        .property-location {
          color: ${Theme.colors.gray2};
          font: ${Theme.typography.fonts.smallM};
          margin-bottom: 1rem;
        }

        .edit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background-color: ${Theme.colors.secondary}20;
          color: ${Theme.colors.secondary};
          border: none;
          border-radius: ${Theme.borders.radius.sm};
          font: ${Theme.typography.fonts.smallB};
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background-color: ${Theme.colors.secondary};
            color: white;
          }
        }
      }
    }
  }

  .loading-state,
  .error-state,
  .empty-state {
    text-align: center;
    padding: 3rem;
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    font: ${Theme.typography.fonts.mediumM};

    button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background-color: ${Theme.colors.secondary};
      color: white;
      border: none;
      border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      font: ${Theme.typography.fonts.mediumB};

      &:hover {
        background-color: ${Theme.colors.secondaryDark};
      }
    }
  }
`;

export default PropertyPage; 