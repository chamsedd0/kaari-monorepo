import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../../../backend/models/entities';
import { getProperties, deleteProperty } from '../../../../backend/server-actions/PropertyServerActions';
import { useToastService } from '../../../../services/ToastService';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>{title}</h3>
          <button onClick={onClose}>&times;</button>
        </ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <DeleteButton onClick={onConfirm}>Delete</DeleteButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// PropertyCard component with image pagination
const PropertyCard = ({ property, onEdit, onDelete }: { 
  property: Property, 
  onEdit: (id: string) => void, 
  onDelete: (property: Property) => void 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = property.images && property.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length);
    }
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <img 
          src={property.images[currentImageIndex] || property.images[0]} 
          alt={property.title} 
        />
        {hasMultipleImages && (
          <>
            <button className="nav-button prev" onClick={prevImage} aria-label="Previous image">
              <IoChevronBackOutline />
            </button>
            <button className="nav-button next" onClick={nextImage} aria-label="Next image">
              <IoChevronForwardOutline />
            </button>
            <div className="pagination-dots">
              {property.images.map((_, index) => (
                <span 
                  key={index} 
                  className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="property-info">
        <h3>{property.title}</h3>
        <p className="property-type">{property.propertyType}</p>
        <p className="property-price">${property.price}/month</p>
        <p className="property-location">
          {property.address.city}, {property.address.country}
        </p>
        <div className="action-buttons">
          <button
            className="edit-button"
            onClick={() => onEdit(property.id)}
          >
            <FaEdit /> Edit
          </button>
          <button
            className="delete-button"
            onClick={() => onDelete(property)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastService();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertiesData = await getProperties({ showAllStatuses: true });
      setProperties(propertiesData as Property[]);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
      toast.app?.actionError('loading properties');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/dashboard/admin/properties/edit/${propertyId}`);
  };
  
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      setIsDeleting(true);
      await deleteProperty(propertyId);
      setProperties(properties.filter(p => p.id !== propertyId));
      toast.property?.deleteSuccess();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.property?.deleteError();
    } finally {
      setIsDeleting(false);
      setPropertyToDelete(null);
    }
  };
  
  const confirmDelete = (property: Property) => {
    setPropertyToDelete(property);
  };
  
  const cancelDelete = () => {
    setPropertyToDelete(null);
  };

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.propertyType.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <PropertyCard 
              key={property.id} 
              property={property} 
              onEdit={handleEditProperty} 
              onDelete={confirmDelete} 
            />
          ))}
        </div>
      )}
      
      <ConfirmationModal
        isOpen={!!propertyToDelete}
        onClose={cancelDelete}
        onConfirm={() => propertyToDelete && handleDeleteProperty(propertyToDelete.id)}
        title="Delete Property"
        message={`Are you sure you want to delete the property "${propertyToDelete?.title}"? This action cannot be undone.`}
      />
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
        aspect-ratio: 4/3;
        overflow: hidden;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s ease, background-color 0.3s ease;
          z-index: 5;

          svg {
            font-size: 18px;
            color: ${Theme.colors.black};
          }

          &.prev {
            left: 8px;
          }

          &.next {
            right: 8px;
          }

          &:hover {
            background-color: rgba(255, 255, 255, 0.9);
          }
        }

        .pagination-dots {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: 6px;
          z-index: 5;

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;

            &.active {
              background-color: white;
              transform: scale(1.2);
            }

            &:hover {
              background-color: rgba(255, 255, 255, 0.9);
            }
          }
        }

        &:hover {
          .nav-button {
            opacity: 1;
          }
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

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          
          button {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.75rem;
            border: none;
            border-radius: ${Theme.borders.radius.sm};
            font: ${Theme.typography.fonts.smallB};
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .edit-button {
            background-color: ${Theme.colors.secondary}20;
            color: ${Theme.colors.secondary};
            
            &:hover {
              background-color: ${Theme.colors.secondary};
              color: white;
            }
          }
          
          .delete-button {
            background-color: ${Theme.colors.error}20;
            color: ${Theme.colors.error};
            
            &:hover {
              background-color: ${Theme.colors.error};
              color: white;
            }
            
            &:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
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
        background-color: ${Theme.colors.secondary};
        opacity: 0.8;
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${Theme.borders.radius.md};
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${Theme.colors.gray}20;
  
  h3 {
    font: ${Theme.typography.fonts.h4B};
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${Theme.colors.gray};
    
    &:hover {
      color: ${Theme.colors.error};
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  
  p {
    font: ${Theme.typography.fonts.mediumM};
    margin: 0;
    color: ${Theme.colors.gray2};
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
  gap: 1rem;
  border-top: 1px solid ${Theme.colors.gray}20;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: ${Theme.colors.gray2};
  border: 1px solid ${Theme.colors.gray}30;
  border-radius: ${Theme.borders.radius.sm};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  
  &:hover {
    background-color: ${Theme.colors.gray}10;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${Theme.colors.error};
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.sm};
  font: ${Theme.typography.fonts.smallB};
  cursor: pointer;
  
  &:hover {
    background-color: ${Theme.colors.error};
    opacity: 0.9;
  }
`;

export default PropertyPage; 