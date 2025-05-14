import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getPropertyById, updateProperty } from '../../../backend/server-actions/PropertyServerActions';
import { Property } from '../../../backend/models/entities';
import { useToastService } from '../../../services/ToastService';

const PropertyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastService();
  
  // Get requested changes from navigation state if coming from edit request
  const requestedChanges = location.state?.requestedChanges;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [status, setStatus] = useState<'available' | 'occupied'>('available');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  });

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  useEffect(() => {
    // Apply requested changes if they exist
    if (requestedChanges && property) {
      // Update form fields with requested changes
      if (requestedChanges.title) setTitle(requestedChanges.title);
      if (requestedChanges.description) setDescription(requestedChanges.description);
      if (requestedChanges.price) setPrice(requestedChanges.price.toString());
      if (requestedChanges.propertyType) setPropertyType(requestedChanges.propertyType);
      if (requestedChanges.bedrooms) setBedrooms(requestedChanges.bedrooms.toString());
      if (requestedChanges.bathrooms) setBathrooms(requestedChanges.bathrooms.toString());
      if (requestedChanges.status) setStatus(requestedChanges.status);
      if (requestedChanges.amenities) setAmenities(requestedChanges.amenities);
      if (requestedChanges.features) setFeatures(requestedChanges.features);
      if (requestedChanges.address) setAddress(requestedChanges.address);

      // Show notification about applied changes
      toast.info('Edit request changes have been applied. Please review and save the changes.');
    }
  }, [requestedChanges, property]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const propertyData = await getPropertyById(id!);
      if (propertyData) {
        setProperty(propertyData);
        // Populate form fields
        setTitle(propertyData.title);
        setDescription(propertyData.description);
        setPrice(propertyData.price.toString());
        setPropertyType(propertyData.propertyType);
        setBedrooms(propertyData.bedrooms.toString());
        setBathrooms(propertyData.bathrooms.toString());
        setStatus(propertyData.status);
        setAmenities(propertyData.amenities || []);
        setFeatures(propertyData.features || []);
        setAddress(propertyData.address);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property details');
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!property || saving) return;

    try {
      setSaving(true);
      setError(null);

      const updatedProperty: Partial<Property> = {
        title,
        description,
        price: parseFloat(price),
        propertyType,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        status,
        amenities,
        features,
        address,
        updatedAt: Date.now()
      };

      await updateProperty(property.id, updatedProperty);
      toast.success('Property updated successfully');
      navigate(`/dashboard/admin/properties`);
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property');
      toast.error('Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/dashboard/admin/properties`);
  };

  if (loading) {
    return (
      <PropertyEditPageContainer>
        <div className="loading">Loading property details...</div>
      </PropertyEditPageContainer>
    );
  }

  if (error || !property) {
    return (
      <PropertyEditPageContainer>
        <div className="error">
          {error || 'Property not found'}
          <button onClick={loadProperty}>Retry</button>
        </div>
      </PropertyEditPageContainer>
    );
  }

  return (
    <PropertyEditPageContainer>
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
        </button>
        <h1>Edit Property</h1>
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={saving}
        >
          <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="edit-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Property Title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Property Description"
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
              />
            </div>

            <div className="form-group">
              <label>Property Type</label>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="Number of Bedrooms"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="Number of Bathrooms"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'available' | 'occupied')}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Address</h2>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Street Address"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                placeholder="Country"
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                placeholder="Postal Code"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Amenities & Features</h2>
          <div className="form-group">
            <label>Amenities</label>
            <div className="checkbox-grid">
              {AMENITIES_OPTIONS.map(amenity => (
                <label key={amenity.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity.id)}
                    onChange={() => {
                      if (amenities.includes(amenity.id)) {
                        setAmenities(amenities.filter(a => a !== amenity.id));
                      } else {
                        setAmenities([...amenities, amenity.id]);
                      }
                    }}
                  />
                  <span className="checkbox-label">{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Features</label>
            <div className="checkbox-grid">
              {FEATURES_OPTIONS.map(feature => (
                <label key={feature.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={features.includes(feature.id)}
                    onChange={() => {
                      if (features.includes(feature.id)) {
                        setFeatures(features.filter(f => f !== feature.id));
                      } else {
                        setFeatures([...features, feature.id]);
                      }
                    }}
                  />
                  <span className="checkbox-label">{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PropertyEditPageContainer>
  );
};

const AMENITIES_OPTIONS = [
  { id: 'furnished', label: 'Furnished' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'parking', label: 'Parking' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'security', label: 'Security' },
  { id: 'gym', label: 'Gym' },
  { id: 'pool', label: 'Pool' },
];

const FEATURES_OPTIONS = [
  { id: 'water', label: 'Water' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'women-only', label: 'Women Only' },
];

const PropertyEditPageContainer = styled.div`
  padding: 2rem;

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;

    h1 {
      flex: 1;
      font: ${Theme.typography.fonts.h3};
      margin: 0;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: ${Theme.borders.radius.sm};
      cursor: pointer;
      font: ${Theme.typography.fonts.mediumB};

      &.back-button {
        background-color: ${Theme.colors.tertiary}20;
        color: ${Theme.colors.gray2};

        &:hover {
          background-color: ${Theme.colors.tertiary}40;
        }
      }

      &.save-button {
        background-color: ${Theme.colors.primary};
        color: white;

        &:hover {
          background-color: ${Theme.colors.primaryDark};
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }
  }

  .edit-form {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    padding: 2rem;

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid ${Theme.colors.tertiary};

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      h2 {
        font: ${Theme.typography.fonts.h4};
        margin-bottom: 1.5rem;
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      .form-group {
        flex: 1;
      }
    }

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        font: ${Theme.typography.fonts.smallB};
        color: ${Theme.colors.gray2};
        margin-bottom: 0.5rem;
      }

      input,
      textarea,
      select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid ${Theme.colors.tertiary};
        border-radius: ${Theme.borders.radius.sm};
        font: ${Theme.typography.fonts.mediumM};

        &:focus {
          outline: none;
          border-color: ${Theme.colors.secondary};
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        input[type="checkbox"] {
          width: auto;
        }

        .checkbox-label {
          font: ${Theme.typography.fonts.mediumM};
        }
      }
    }
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
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

export default PropertyEditPage; 