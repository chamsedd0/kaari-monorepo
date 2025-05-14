import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getPropertyById, updateProperty } from '../../../../../../backend/server-actions/PropertyServerActions';
import { Property } from '../../../../../../backend/models/entities';
import { useToastService } from '../../../../../../services/ToastService';

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
  const [deposit, setDeposit] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [minstay, setMinstay] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState<'available' | 'occupied'>('available');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    streetNumber: '',
    floor: '',
    flat: ''
  });
  const [propertyLocation, setPropertyLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [rooms, setRooms] = useState<Array<{ type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living'; area: number }>>([]);
  const [isFurnished, setIsFurnished] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState<Array<{ name: string; timeDistance: string }>>([]);
  const [rules, setRules] = useState<Array<{ name: string; allowed: boolean }>>([]);
  const [newNearbyPlace, setNewNearbyPlace] = useState({ name: '', timeDistance: '' });
  const [newRule, setNewRule] = useState({ name: '', allowed: true });
  const [newRoom, setNewRoom] = useState({ type: 'bedroom' as const, area: 0 });

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
      if (requestedChanges.deposit) setDeposit(requestedChanges.deposit.toString());
      if (requestedChanges.serviceFee) setServiceFee(requestedChanges.serviceFee.toString());
      if (requestedChanges.minstay) setMinstay(requestedChanges.minstay.toString());
      if (requestedChanges.availableFrom) setAvailableFrom(requestedChanges.availableFrom);
      if (requestedChanges.propertyType) setPropertyType(requestedChanges.propertyType);
      if (requestedChanges.bedrooms) setBedrooms(requestedChanges.bedrooms.toString());
      if (requestedChanges.bathrooms) setBathrooms(requestedChanges.bathrooms.toString());
      if (requestedChanges.area) setArea(requestedChanges.area.toString());
      if (requestedChanges.status) setStatus(requestedChanges.status);
      if (requestedChanges.amenities) setAmenities(requestedChanges.amenities);
      if (requestedChanges.features) setFeatures(requestedChanges.features);
      if (requestedChanges.address) setAddress(requestedChanges.address);
      if (requestedChanges.location) setPropertyLocation(requestedChanges.location);
      if (requestedChanges.rooms) setRooms(requestedChanges.rooms);
      if (requestedChanges.isFurnished) setIsFurnished(requestedChanges.isFurnished);
      if (requestedChanges.capacity) setCapacity(requestedChanges.capacity.toString());
      if (requestedChanges.nearbyPlaces) setNearbyPlaces(requestedChanges.nearbyPlaces);
      if (requestedChanges.rules) setRules(requestedChanges.rules);
      if (requestedChanges.newNearbyPlace) setNewNearbyPlace(requestedChanges.newNearbyPlace);
      if (requestedChanges.newRule) setNewRule(requestedChanges.newRule);
      if (requestedChanges.newRoom) setNewRoom(requestedChanges.newRoom);

      // Show notification about applied changes
      toast.showToast('info', 'Changes Applied', 'Edit request changes have been applied. Please review and save the changes.');
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
        setDeposit(propertyData.deposit?.toString() || '');
        setServiceFee(propertyData.serviceFee?.toString() || '');
        setMinstay(propertyData.minstay || '');
        
        // Handle availableFrom date
        let formattedDate = '';
        if (propertyData.availableFrom) {
          const date = propertyData.availableFrom instanceof Date 
            ? propertyData.availableFrom 
            : new Date(propertyData.availableFrom);
          
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
        setAvailableFrom(formattedDate);

        setPropertyType(propertyData.propertyType);
        setBedrooms(propertyData.bedrooms?.toString() || '');
        setBathrooms(propertyData.bathrooms?.toString() || '');
        setArea(propertyData.area.toString());
        setStatus(propertyData.status);
        setAmenities(propertyData.amenities || []);
        setFeatures(propertyData.features || []);
        setAddress(propertyData.address);
        setPropertyLocation(propertyData.location || null);
        setRooms(propertyData.rooms || []);
        setIsFurnished(propertyData.isFurnished || false);
        setCapacity(propertyData.capacity?.toString() || '');
        setNearbyPlaces(propertyData.nearbyPlaces || []);
        setRules(propertyData.rules || []);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property details');
      toast.showToast('error', 'Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!property || saving) return;

    try {
      setSaving(true);
      setError(null);

      // Create the base property update object
      const updatedProperty: Partial<Property> = {
        title,
        description,
        price: parseFloat(price),
        propertyType,
        area: parseFloat(area),
        status,
        amenities,
        features,
        address,
        location: propertyLocation,
        rooms,
        isFurnished,
        updatedAt: new Date()
      };

      // Add optional fields only if they have valid values
      if (deposit) updatedProperty.deposit = parseFloat(deposit);
      if (serviceFee) updatedProperty.serviceFee = parseFloat(serviceFee);
      if (minstay) updatedProperty.minstay = minstay;
      if (bedrooms) updatedProperty.bedrooms = parseInt(bedrooms);
      if (bathrooms) updatedProperty.bathrooms = parseInt(bathrooms);
      if (capacity) updatedProperty.capacity = parseInt(capacity);
      if (nearbyPlaces.length > 0) updatedProperty.nearbyPlaces = nearbyPlaces;
      if (rules.length > 0) updatedProperty.rules = rules;
      
      // Handle availableFrom date specifically
      if (availableFrom) {
        const date = new Date(availableFrom);
        if (!isNaN(date.getTime())) {
          updatedProperty.availableFrom = date;
        }
      }

      await updateProperty(property.id, updatedProperty);
      toast.showToast('success', 'Success', 'Property updated successfully');
      navigate('/dashboard/admin/properties');
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property');
      toast.showToast('error', 'Error', 'Failed to update property');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/admin/properties');
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
                placeholder="Monthly Price"
              />
            </div>

            <div className="form-group">
              <label>Deposit</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="Security Deposit"
              />
            </div>

            <div className="form-group">
              <label>Service Fee</label>
              <input
                type="number"
                value={serviceFee}
                onChange={(e) => setServiceFee(e.target.value)}
                placeholder="Service Fee"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum Stay</label>
              <input
                type="text"
                value={minstay}
                onChange={(e) => setMinstay(e.target.value)}
                placeholder="e.g., 6 months"
              />
            </div>

            <div className="form-group">
              <label>Available From</label>
              <input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Number of people"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Property Type</label>
              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="studio">Studio</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div className="form-group">
              <label>Area (sq m)</label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Total Area"
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

          <div className="form-group">
            <label>Furnished</label>
            <input
              type="checkbox"
              checked={isFurnished}
              onChange={(e) => setIsFurnished(e.target.checked)}
            />
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
              placeholder="Street Name"
            />
          </div>

          <div className="form-group">
            <label>Street Number</label>
            <input
              type="text"
              value={address.streetNumber}
              onChange={(e) => setAddress({ ...address, streetNumber: e.target.value })}
              placeholder="Street Number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Floor</label>
              <input
                type="text"
                value={address.floor}
                onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                placeholder="Floor"
              />
            </div>

            <div className="form-group">
              <label>Flat</label>
              <input
                type="text"
                value={address.flat}
                onChange={(e) => setAddress({ ...address, flat: e.target.value })}
                placeholder="Flat Number"
              />
            </div>
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
          <h2>Rooms</h2>
          <div className="rooms-list">
            {rooms.map((room, index) => (
              <div key={index} className="room-item">
                <select
                  value={room.type}
                  onChange={(e) => {
                    const newRooms = [...rooms];
                    newRooms[index].type = e.target.value as typeof room.type;
                    setRooms(newRooms);
                  }}
                >
                  <option value="bedroom">Bedroom</option>
                  <option value="bathroom">Bathroom</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="storage">Storage</option>
                  <option value="living">Living Room</option>
                </select>
                <input
                  type="number"
                  value={room.area}
                  onChange={(e) => {
                    const newRooms = [...rooms];
                    newRooms[index].area = parseFloat(e.target.value) || 0;
                    setRooms(newRooms);
                  }}
                  placeholder="Area"
                />
                <button onClick={() => setRooms(rooms.filter((_, i) => i !== index))}>Remove</button>
              </div>
            ))}
            <div className="add-room">
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as typeof newRoom.type })}
              >
                <option value="bedroom">Bedroom</option>
                <option value="bathroom">Bathroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="storage">Storage</option>
                <option value="living">Living Room</option>
              </select>
              <input
                type="number"
                value={newRoom.area}
                onChange={(e) => setNewRoom({ ...newRoom, area: parseFloat(e.target.value) || 0 })}
                placeholder="Area"
              />
              <button onClick={() => {
                if (newRoom.area > 0) {
                  setRooms([...rooms, newRoom]);
                  setNewRoom({ type: 'bedroom', area: 0 });
                }
              }}>Add Room</button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Nearby Places</h2>
          <div className="nearby-places-list">
            {nearbyPlaces.map((place, index) => (
              <div key={index} className="nearby-place-item">
                <input
                  type="text"
                  value={place.name}
                  onChange={(e) => {
                    const newPlaces = [...nearbyPlaces];
                    newPlaces[index].name = e.target.value;
                    setNearbyPlaces(newPlaces);
                  }}
                  placeholder="Place Name"
                />
                <input
                  type="text"
                  value={place.timeDistance}
                  onChange={(e) => {
                    const newPlaces = [...nearbyPlaces];
                    newPlaces[index].timeDistance = e.target.value;
                    setNearbyPlaces(newPlaces);
                  }}
                  placeholder="Time Distance"
                />
                <button onClick={() => setNearbyPlaces(nearbyPlaces.filter((_, i) => i !== index))}>Remove</button>
              </div>
            ))}
            <div className="add-place">
              <input
                type="text"
                value={newNearbyPlace.name}
                onChange={(e) => setNewNearbyPlace({ ...newNearbyPlace, name: e.target.value })}
                placeholder="Place Name"
              />
              <input
                type="text"
                value={newNearbyPlace.timeDistance}
                onChange={(e) => setNewNearbyPlace({ ...newNearbyPlace, timeDistance: e.target.value })}
                placeholder="Time Distance"
              />
              <button onClick={() => {
                if (newNearbyPlace.name && newNearbyPlace.timeDistance) {
                  setNearbyPlaces([...nearbyPlaces, newNearbyPlace]);
                  setNewNearbyPlace({ name: '', timeDistance: '' });
                }
              }}>Add Place</button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Rules</h2>
          <div className="rules-list">
            {rules.map((rule, index) => (
              <div key={index} className="rule-item">
                <input
                  type="text"
                  value={rule.name}
                  onChange={(e) => {
                    const newRules = [...rules];
                    newRules[index].name = e.target.value;
                    setRules(newRules);
                  }}
                  placeholder="Rule Name"
                />
                <input
                  type="checkbox"
                  checked={rule.allowed}
                  onChange={(e) => {
                    const newRules = [...rules];
                    newRules[index].allowed = e.target.checked;
                    setRules(newRules);
                  }}
                />
                <button onClick={() => setRules(rules.filter((_, i) => i !== index))}>Remove</button>
              </div>
            ))}
            <div className="add-rule">
              <input
                type="text"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="Rule Name"
              />
              <input
                type="checkbox"
                checked={newRule.allowed}
                onChange={(e) => setNewRule({ ...newRule, allowed: e.target.checked })}
              />
              <button onClick={() => {
                if (newRule.name) {
                  setRules([...rules, newRule]);
                  setNewRule({ name: '', allowed: true });
                }
              }}>Add Rule</button>
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
  { id: 'sofabed', label: 'Sofabed' },
  { id: 'dining-table', label: 'Dining Table' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'cabinet', label: 'Cabinet' },
  { id: 'chair', label: 'Chair' },
  { id: 'desk', label: 'Desk' },
  { id: 'sofa', label: 'Sofa' },
  { id: 'coffee-table', label: 'Coffee Table' },
  { id: 'dresser', label: 'Dresser' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'walk-in-closet', label: 'Walk-in Closet' },
  { id: 'oven', label: 'Oven' },
  { id: 'washing-machine', label: 'Washing Machine' },
  { id: 'hotplate', label: 'Hotplate/Cooktop' },
  { id: 'water-heater', label: 'Water Heater' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'parking', label: 'Parking' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'security', label: 'Security' },
  { id: 'gym', label: 'Gym' },
  { id: 'pool', label: 'Pool' }
];

const FEATURES_OPTIONS = [
  { id: 'water', label: 'Water' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'wifi', label: 'Wi-Fi' },
  { id: 'women-only', label: 'Women Only' }
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
      border-radius: 8px;
      cursor: pointer;
      font: ${Theme.typography.fonts.mediumB};
    }

    .back-button {
      background: ${Theme.colors.tertiary};
      color: ${Theme.colors.black};
      
      &:hover {
        background: ${Theme.colors.fifth};
      }
    }

    .save-button {
      background: ${Theme.colors.primary};
      color: ${Theme.colors.white};
      
      &:hover {
        background: ${Theme.colors.secondary};
      }
      
      &:disabled {
        background: ${Theme.colors.gray};
        cursor: not-allowed;
      }
    }
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section {
    background: ${Theme.colors.white};
    padding: 1.5rem;
    border-radius: 12px;
    border: ${Theme.borders.primary};

    h2 {
      font: ${Theme.typography.fonts.h4};
      margin: 0 0 1.5rem;
      color: ${Theme.colors.black};
    }
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font: ${Theme.typography.fonts.mediumB};
      color: ${Theme.colors.black};
    }

    input[type="text"],
    input[type="number"],
    input[type="date"],
    textarea,
    select {
      width: 100%;
      padding: 0.75rem;
      border: ${Theme.borders.primary};
      border-radius: 8px;
      font: ${Theme.typography.fonts.mediumM};
      
      &:focus {
        outline: none;
        border-color: ${Theme.colors.secondary};
      }
    }

    textarea {
      resize: vertical;
    }

    input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;

    input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      cursor: pointer;
    }

    .checkbox-label {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.black};
    }
  }

  .rooms-list,
  .nearby-places-list,
  .rules-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .room-item,
    .nearby-place-item,
    .rule-item,
    .add-room,
    .add-place,
    .add-rule {
      display: flex;
      gap: 1rem;
      align-items: center;

      input,
      select {
        flex: 1;
      }

      button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 8px;
        background: ${Theme.colors.tertiary};
        color: ${Theme.colors.black};
        cursor: pointer;
        font: ${Theme.typography.fonts.mediumB};

        &:hover {
          background: ${Theme.colors.fifth};
        }
      }
    }
  }

  .loading,
  .error {
    text-align: center;
    padding: 2rem;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.black};

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      background: ${Theme.colors.primary};
      color: ${Theme.colors.white};
      cursor: pointer;
      font: ${Theme.typography.fonts.mediumB};

      &:hover {
        background: ${Theme.colors.secondary};
      }
    }
  }
`;

export default PropertyEditPage; 