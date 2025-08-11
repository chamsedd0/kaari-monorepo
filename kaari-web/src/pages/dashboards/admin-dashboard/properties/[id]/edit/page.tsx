import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { PageContainer, PageHeader, GlassCard } from '../../../../../../components/admin/AdminUI';
import { Theme } from '../../../../../../theme/theme';
import { FaArrowLeft, FaSave, FaTrash, FaPlus, FaUpload, FaMapMarkerAlt } from 'react-icons/fa';
import { getPropertyById, updateProperty } from '../../../../../../backend/server-actions/PropertyServerActions';
import { Property } from '../../../../../../backend/entities';
import { useToastService } from '../../../../../../services/ToastService';

// Extend Property type to include location
type ExtendedProperty = Property & {
  location?: {
    lat: number;
    lng: number;
  };
};

// Mock function for image upload until the real one is implemented
const uploadPropertyImage = async (file: File, propertyId: string): Promise<string> => {
  // This is a temporary implementation until the Firebase Storage is set up
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Return the base64 string as the image URL for now
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};

const PropertyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const routeLocation = useLocation(); // Renamed from 'location' to avoid conflict
  const toast = useToastService();
  
  // Get requested changes from navigation state if coming from edit request
  const requestedChanges = routeLocation.state?.requestedChanges;

  const [property, setProperty] = useState<ExtendedProperty | null>(null);
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
    zipCode: ''
  });
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0
  });
  const [rooms, setRooms] = useState<Array<{ type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living'; area: number }>>([]);
  const [isFurnished, setIsFurnished] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [nearbyPlaces, setNearbyPlaces] = useState<Array<{ name: string; timeDistance: string }>>([]);
  const [rules, setRules] = useState<Array<{ name: string; allowed: boolean }>>([]);
  const [newNearbyPlace, setNewNearbyPlace] = useState({ name: '', timeDistance: '' });
  const [newRule, setNewRule] = useState({ name: '', allowed: true });
  const [newRoom, setNewRoom] = useState({ type: 'bedroom' as const, area: 0 });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New fields
  const [housingPreference, setHousingPreference] = useState<string>('');
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);
  const [smokingAllowed, setSmokingAllowed] = useState<boolean>(false);
  const [includesWater, setIncludesWater] = useState<boolean>(false);
  const [includesElectricity, setIncludesElectricity] = useState<boolean>(false);
  const [includesWifi, setIncludesWifi] = useState<boolean>(false);
  const [includesGas, setIncludesGas] = useState<boolean>(false);
  const [hasBalcony, setHasBalcony] = useState<boolean>(false);
  const [hasCentralHeating, setHasCentralHeating] = useState<boolean>(false);
  const [hasParking, setHasParking] = useState<boolean>(false);
  const [hasAirConditioning, setHasAirConditioning] = useState<boolean>(false);
  const [hasWoodenFloors, setHasWoodenFloors] = useState<boolean>(false);
  const [hasElevator, setHasElevator] = useState<boolean>(false);
  const [hasSwimmingPool, setHasSwimmingPool] = useState<boolean>(false);
  const [hasFireplace, setHasFireplace] = useState<boolean>(false);
  const [isAccessible, setIsAccessible] = useState<boolean>(false);

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
      
      // Handle availableFrom date
      if (requestedChanges.availableFrom) {
        const date = new Date(requestedChanges.availableFrom);
        if (!isNaN(date.getTime())) {
          setAvailableFrom(date.toISOString().split('T')[0]);
        }
      }
      
      if (requestedChanges.propertyType) setPropertyType(requestedChanges.propertyType);
      if (requestedChanges.bedrooms) setBedrooms(requestedChanges.bedrooms.toString());
      if (requestedChanges.bathrooms) setBathrooms(requestedChanges.bathrooms.toString());
      if (requestedChanges.area) setArea(requestedChanges.area.toString());
      if (requestedChanges.status) setStatus(requestedChanges.status);
      if (requestedChanges.amenities) setAmenities(requestedChanges.amenities);
      if (requestedChanges.features) {
        setFeatures(requestedChanges.features);
        
        // Update individual feature states based on the features array
        const features = requestedChanges.features || [];
        setIncludesWater(features.includes('water'));
        setIncludesElectricity(features.includes('electricity'));
        setIncludesWifi(features.includes('wifi'));
        setIncludesGas(features.includes('gas'));
        setHasBalcony(features.includes('balcony'));
        setHasCentralHeating(features.includes('central-heating'));
        setHasParking(features.includes('parking-space'));
        setHasAirConditioning(features.includes('air-conditioning'));
        setHasWoodenFloors(features.includes('wooden-floors'));
        setHasElevator(features.includes('elevator'));
        setHasSwimmingPool(features.includes('swimming-pool'));
        setHasFireplace(features.includes('fireplace'));
        setIsAccessible(features.includes('accessible'));
      }
      
      if (requestedChanges.address) setAddress(requestedChanges.address);
      if (requestedChanges.location) setLocation(requestedChanges.location);
      if (requestedChanges.rooms) setRooms(requestedChanges.rooms);
      if (requestedChanges.isFurnished !== undefined) setIsFurnished(requestedChanges.isFurnished);
      if (requestedChanges.capacity) setCapacity(requestedChanges.capacity.toString());
      if (requestedChanges.nearbyPlaces) setNearbyPlaces(requestedChanges.nearbyPlaces);
      if (requestedChanges.rules) setRules(requestedChanges.rules);
      if (requestedChanges.housingPreference) setHousingPreference(requestedChanges.housingPreference);
      
      // For petsAllowed and smokingAllowed, set them to false by default 
      // if not explicitly mentioned in the requested changes
      setPetsAllowed(requestedChanges.petsAllowed === true);
      setSmokingAllowed(requestedChanges.smokingAllowed === true);
      
      if (requestedChanges.images) setImages(requestedChanges.images);

      // Show notification about applied changes
      toast.showToast('info', 'Changes Applied', 'Edit request changes have been applied. Please review and save the changes.');
    }
  }, [requestedChanges, property, toast]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const propertyData = await getPropertyById(id!);
      if (propertyData) {
        // Cast to ExtendedProperty to handle location property
        const extendedPropertyData = propertyData as ExtendedProperty;
        setProperty(extendedPropertyData);
        // Populate form fields
        setTitle(extendedPropertyData.title);
        setDescription(extendedPropertyData.description);
        setPrice(extendedPropertyData.price.toString());
        setDeposit(extendedPropertyData.deposit?.toString() || '');
        setServiceFee(extendedPropertyData.serviceFee?.toString() || '');
        setMinstay(extendedPropertyData.minstay || '');
        
        // Handle availableFrom date
        let formattedDate = '';
        if (extendedPropertyData.availableFrom) {
          const date = extendedPropertyData.availableFrom instanceof Date 
            ? extendedPropertyData.availableFrom 
            : new Date(extendedPropertyData.availableFrom);
          
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
        setAvailableFrom(formattedDate);

        setPropertyType(extendedPropertyData.propertyType);
        setBedrooms(extendedPropertyData.bedrooms?.toString() || '');
        setBathrooms(extendedPropertyData.bathrooms?.toString() || '');
        setArea(extendedPropertyData.area.toString());
        setStatus(extendedPropertyData.status);
        setAmenities(extendedPropertyData.amenities || []);
        setFeatures(extendedPropertyData.features || []);
        setAddress({
          street: extendedPropertyData.address.street || '',
          city: extendedPropertyData.address.city || '',
          state: extendedPropertyData.address.state || '',
          country: extendedPropertyData.address.country || '',
          zipCode: extendedPropertyData.address.zipCode || ''
        });
        
        // Set location data if available
        if (extendedPropertyData.location) {
          setLocation({
            lat: extendedPropertyData.location.lat || 0,
            lng: extendedPropertyData.location.lng || 0
          });
        }
        
        setRooms(extendedPropertyData.rooms || []);
        setIsFurnished(extendedPropertyData.isFurnished || false);
        setCapacity(extendedPropertyData.capacity?.toString() || '');
        setNearbyPlaces(extendedPropertyData.nearbyPlaces || []);
        setRules(extendedPropertyData.rules || []);
        setImages(extendedPropertyData.images || []);

        // Set new fields
        setHousingPreference(extendedPropertyData.housingPreference || '');
        setPetsAllowed(extendedPropertyData.petsAllowed || false);
        setSmokingAllowed(extendedPropertyData.smokingAllowed || false);
        
        // Set included utilities based on features
        const features = extendedPropertyData.features || [];
        setIncludesWater(features.includes('water'));
        setIncludesElectricity(features.includes('electricity'));
        setIncludesWifi(features.includes('wifi'));
        setIncludesGas(features.includes('gas'));
        
        // Set property features based on features array
        setHasBalcony(features.includes('balcony'));
        setHasCentralHeating(features.includes('central-heating'));
        setHasParking(features.includes('parking-space'));
        setHasAirConditioning(features.includes('air-conditioning'));
        setHasWoodenFloors(features.includes('wooden-floors'));
        setHasElevator(features.includes('elevator'));
        setHasSwimmingPool(features.includes('swimming-pool'));
        setHasFireplace(features.includes('fireplace'));
        setIsAccessible(features.includes('accessible'));
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property details');
      toast.showToast('error', 'Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Call the upload function from your StorageServerActions
        const imageUrl = await uploadPropertyImage(file, property?.id || 'temp');
        if (imageUrl) {
          setImages(prev => [...prev, imageUrl]);
        }
      }
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.showToast('success', 'Upload Complete', 'Images have been uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.showToast('error', 'Upload Failed', 'There was a problem uploading your images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSave = async () => {
    if (!property || saving) return;

    try {
      setSaving(true);
      setError(null);
      
      // Build features array from individual feature states
      const updatedFeatures = [];
      if (includesWater) updatedFeatures.push('water');
      if (includesElectricity) updatedFeatures.push('electricity');
      if (includesWifi) updatedFeatures.push('wifi');
      if (includesGas) updatedFeatures.push('gas');
      if (hasBalcony) updatedFeatures.push('balcony');
      if (hasCentralHeating) updatedFeatures.push('central-heating');
      if (hasParking) updatedFeatures.push('parking-space');
      if (hasAirConditioning) updatedFeatures.push('air-conditioning');
      if (hasWoodenFloors) updatedFeatures.push('wooden-floors');
      if (hasElevator) updatedFeatures.push('elevator');
      if (hasSwimmingPool) updatedFeatures.push('swimming-pool');
      if (hasFireplace) updatedFeatures.push('fireplace');
      if (isAccessible) updatedFeatures.push('accessible');

      // Create the base property update object
      const updatedProperty: Partial<ExtendedProperty> = {
        // Start with any fields already in the property to maintain structure
        ...property,
        // Now update with the new values
        title,
        description,
        price: parseFloat(price),
        propertyType: propertyType as 'apartment' | 'house' | 'condo' | 'land' | 'commercial',
        area: parseFloat(area) || 0,
        status,
        amenities,
        features: updatedFeatures,
        address,
        location,
        rooms,
        isFurnished,
        images,
        updatedAt: new Date(),
        petsAllowed,
        smokingAllowed,
        housingPreference
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
    <PageContainer>
      <PageHeader title="Edit Property" right={<button className="save-button" onClick={handleSave} disabled={saving}><FaSave /> {saving ? 'Saving...' : 'Save Changes'}</button>} />
      <GlassCard>
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft /> Back
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
          <h2>Address & Location</h2>
          <div className="form-group">
            <label>Street</label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="Street Name"
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
              <label>State/Province</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State/Province"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Zip/Postal Code</label>
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                placeholder="Zip/Postal Code"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                placeholder="Country"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.0000001"
                value={location.lat}
                onChange={(e) => setLocation({
                  ...location,
                  lat: parseFloat(e.target.value) || 0
                })}
                placeholder="Latitude"
              />
            </div>

            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.0000001"
                value={location.lng}
                onChange={(e) => setLocation({
                  ...location,
                  lng: parseFloat(e.target.value) || 0
                })}
                placeholder="Longitude"
              />
            </div>
          </div>
          
          <div className="location-note">
            <FaMapMarkerAlt /> 
            <span>Note: You can also set the exact location on the map in the property details page.</span>
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
          <h2>Rules & Preferences</h2>
          <div className="form-group">
            <label>Housing Preference</label>
            <select 
              value={housingPreference}
              onChange={(e) => setHousingPreference(e.target.value)}
            >
              <option value="">No Specific Preference</option>
              <option value="womenOnly">Women Only</option>
              <option value="familiesOnly">Families Only</option>
              <option value="studentsOnly">Students Only</option>
              <option value="professionalsOnly">Professionals Only</option>
            </select>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={(e) => setPetsAllowed(e.target.checked)}
              />
              <span className="checkbox-label">Pets Allowed</span>
            </label>
            
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={smokingAllowed}
                onChange={(e) => setSmokingAllowed(e.target.checked)}
              />
              <span className="checkbox-label">Smoking Allowed</span>
            </label>
          </div>
          
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
                <label>
                  <input
                    type="checkbox"
                    checked={rule.allowed}
                    onChange={(e) => {
                      const newRules = [...rules];
                      newRules[index].allowed = e.target.checked;
                      setRules(newRules);
                    }}
                  />
                  <span>Allowed</span>
                </label>
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
              <label>
                <input
                  type="checkbox"
                  checked={newRule.allowed}
                  onChange={(e) => setNewRule({ ...newRule, allowed: e.target.checked })}
                />
                <span>Allowed</span>
              </label>
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
          <h2>Property Images</h2>
          <div className="upload-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelection}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <button 
              className="upload-button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <FaUpload /> {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            <div className="upload-note">
              Supported formats: JPG, PNG, WebP. Max size: 5MB per image.
            </div>
          </div>
          
          <div className="images-grid">
            {images.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <div className="image-preview">
                  <img src={imageUrl} alt={`Property ${index + 1}`} />
                </div>
                <div className="image-controls">
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="no-images">
                No images have been uploaded for this property.
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h2>Included Services</h2>
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={includesWater}
                onChange={(e) => setIncludesWater(e.target.checked)}
              />
              <span className="checkbox-label">Water</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={includesElectricity}
                onChange={(e) => setIncludesElectricity(e.target.checked)}
              />
              <span className="checkbox-label">Electricity</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={includesWifi}
                onChange={(e) => setIncludesWifi(e.target.checked)}
              />
              <span className="checkbox-label">Wi-Fi</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={includesGas}
                onChange={(e) => setIncludesGas(e.target.checked)}
              />
              <span className="checkbox-label">Gas</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Property Features</h2>
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasBalcony}
                onChange={(e) => setHasBalcony(e.target.checked)}
              />
              <span className="checkbox-label">Balcony</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasCentralHeating}
                onChange={(e) => setHasCentralHeating(e.target.checked)}
              />
              <span className="checkbox-label">Central Heating</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasParking}
                onChange={(e) => setHasParking(e.target.checked)}
              />
              <span className="checkbox-label">Parking Space</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasAirConditioning}
                onChange={(e) => setHasAirConditioning(e.target.checked)}
              />
              <span className="checkbox-label">Air Conditioning</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasWoodenFloors}
                onChange={(e) => setHasWoodenFloors(e.target.checked)}
              />
              <span className="checkbox-label">Wooden Floors</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
              />
              <span className="checkbox-label">Elevator</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasSwimmingPool}
                onChange={(e) => setHasSwimmingPool(e.target.checked)}
              />
              <span className="checkbox-label">Swimming Pool</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={hasFireplace}
                onChange={(e) => setHasFireplace(e.target.checked)}
              />
              <span className="checkbox-label">Fireplace</span>
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={isAccessible}
                onChange={(e) => setIsAccessible(e.target.checked)}
              />
              <span className="checkbox-label">Accessible</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h2>Amenities</h2>
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
      </div>
      </GlassCard>
    </PageContainer>
  );
};

const AMENITIES_OPTIONS = [
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
  { id: 'hotplate-cooktop', label: 'Hotplate/Cooktop' },
  { id: 'water-heater', label: 'Water Heater' },
  { id: 'microwave', label: 'Microwave' },
  { id: 'bathtub', label: 'Bathtub' },
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
  { id: 'gas', label: 'Gas' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'central-heating', label: 'Central Heating' },
  { id: 'parking-space', label: 'Parking Space' },
  { id: 'air-conditioning', label: 'Air Conditioning' },
  { id: 'wooden-floors', label: 'Wooden Floors' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'swimming-pool', label: 'Swimming Pool' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'accessible', label: 'Accessible' }
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
      font: ${Theme.typography.fonts.h4B};
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

  .upload-container {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .upload-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: ${Theme.colors.secondary};
    color: white;
    border: none;
    border-radius: 8px;
    font: ${Theme.typography.fonts.mediumB};
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${Theme.colors.primary};
    }

    &:disabled {
      background-color: ${Theme.colors.gray};
      cursor: not-allowed;
    }
  }

  .upload-note {
    margin-top: 0.5rem;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }

  .no-images {
    grid-column: 1 / -1;
    padding: 2rem;
    text-align: center;
    background-color: ${Theme.colors.tertiary}20;
    border-radius: 8px;
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }

  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .image-item {
    border: ${Theme.borders.primary};
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .image-preview {
    height: 150px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-controls {
    padding: 0.75rem;
    display: flex;
    justify-content: center;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: ${Theme.colors.error}20;
      color: ${Theme.colors.error};
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font: ${Theme.typography.fonts.smallB};
      transition: all 0.2s ease;

      &:hover {
        background-color: ${Theme.colors.error};
        color: white;
      }
    }
  }

  .location-note {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background-color: ${Theme.colors.tertiary}30;
    border-radius: 8px;
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }
`;

export default PropertyEditPage; 