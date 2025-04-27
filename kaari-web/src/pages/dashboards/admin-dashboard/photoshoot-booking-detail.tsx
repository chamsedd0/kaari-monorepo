import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaUpload, FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import {
  DashboardCard,
  CardTitle,
  CardContent,
  Button,
  StatusBadge,
  FormGroup,
  Label,
  Select,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalFooter,
  CancelButton,
  ActionButton,
} from './styles';

import { PhotoshootBookingServerActions } from '../../../backend/server-actions/PhotoshootBookingServerActions';
import { TeamServerActions } from '../../../backend/server-actions/TeamServerActions';
import { PhotoshootBooking, Team, Property } from '../../../backend/entities';
import { collection, getDocs, getDoc, doc, updateDoc, arrayUnion, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../backend/firebase/config';

interface PhotoshootBookingDetailProps {
  onUpdateBooking: () => void;
}

interface PropertyFormData {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  propertyType: 'apartment' | 'house' | 'condo' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  images: string[];
  amenities: string[];
  features: string[];
  status: 'available' | 'sold' | 'pending' | 'rented';
  location: {
    lat: number;
    lng: number;
  } | null;
}

// Common amenities and features
const COMMON_AMENITIES = [
  'furnished',
  'sofabed',
  'dining-table',
  'wardrobe',
  'cabinet',
  'chair',
  'desk',
  'sofa',
  'coffee-table',
  'dresser',
  'mirror',
  'walk-in-closet',
  'oven',
  'washing-machine',
  'hotplate-cooktop',
  'water-heater'
];

const COMMON_FEATURES = [
  'water',
  'electricity',
  'wifi',
  'women-only'
];

const PhotoshootBookingDetail: React.FC<PhotoshootBookingDetailProps> = ({ onUpdateBooking }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState<PhotoshootBooking | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamDebugInfo, setTeamDebugInfo] = useState<string>('');
  
  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  
  // Add new state for property data
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    id: '',
    ownerId: '',
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    price: 0,
    images: [],
    amenities: [],
    features: [],
    status: 'available',
    location: null,
  });
  
  const [amenityInput, setAmenityInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  
  // Direct Firebase check utility function
  const checkTeamsInFirebase = async () => {
    try {
      const teamsCollection = collection(db, 'teams');
      const snapshot = await getDocs(teamsCollection);
      
      if (snapshot.empty) {
        console.log('No teams found in Firebase');
        setTeamDebugInfo('No teams found in the database. You may need to initialize sample data.');
        return [];
      }
      
      const teamsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
      
      console.log('Teams directly from Firebase:', teamsData);
      setTeamDebugInfo(`Found ${teamsData.length} teams directly in Firebase.`);
      
      // If we have teams in Firebase but not in our state, update the state
      if (teamsData.length > 0 && teams.length === 0) {
        setTeams(teamsData as Team[]);
      }
      
      return teamsData;
    } catch (error) {
      console.error('Error checking teams in Firebase:', error);
      setTeamDebugInfo(`Error checking Firebase: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  };
  
  // Function to create a property and link it to an advertiser
  const createPropertyAndLinkToAdvertiser = async (propertyData: PropertyFormData, advertiserId: string): Promise<string> => {
    try {
      const now = new Date();

      // Create a new property document in the properties collection
      const propertiesCollectionRef = collection(db, 'properties');
      const propertyDocRef = doc(propertiesCollectionRef);
      
      // Prepare the property data with timestamps
      const propertyWithTimestamps = {
        id: propertyDocRef.id,
        ownerId: advertiserId,
        title: propertyData.title,
        description: propertyData.description,
        address: propertyData.address,
        propertyType: propertyData.propertyType,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        area: propertyData.area,
        price: propertyData.price,
        images: propertyData.images,
        amenities: propertyData.amenities,
        features: propertyData.features,
        status: propertyData.status,
        // Include location data if available
        location: propertyData.location,
      };
      
      // Log the data being sent to Firestore for debugging
      console.log('Property data being saved:', JSON.stringify({
        ...propertyWithTimestamps,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }, null, 2));
      
      await setDoc(propertyDocRef, {
        ...propertyWithTimestamps,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      
      console.log(`Created property with ID: ${propertyDocRef.id}`);
      
      // Update the advertiser's properties array
      await updateAdvertiserProperties(advertiserId, propertyDocRef.id);
      
      return propertyDocRef.id;
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error(`Failed to create property: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Function to update the advertiser's properties array
  const updateAdvertiserProperties = async (advertiserId: string, propertyId: string): Promise<void> => {
    try {
      // Get the advertiser document
      const advertiserDocRef = doc(db, 'users', advertiserId);
      const advertiserDoc = await getDoc(advertiserDocRef);
      
      if (!advertiserDoc.exists()) {
        throw new Error(`Advertiser with ID ${advertiserId} not found`);
      }
      
      // Add the property ID to the advertiser's properties array
      await updateDoc(advertiserDocRef, {
        properties: arrayUnion(propertyId),
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      console.log(`Added property ${propertyId} to advertiser ${advertiserId}'s properties array`);
    } catch (error) {
      console.error('Error updating advertiser properties:', error);
      throw new Error(`Failed to update advertiser properties: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Load booking
      const bookingData = await PhotoshootBookingServerActions.getBookingById(id);
      
      if (!bookingData) {
        console.error('Booking not found');
        navigate('/dashboard/admin/photoshoot-bookings');
        return;
      }
      
      console.log('Loaded booking data:', JSON.stringify(bookingData, null, 2));
      
      // Map userId to advertiserId for compatibility with existing code
      const bookingWithAdvertiserId = {
        ...bookingData,
        advertiserId: bookingData.userId // Map userId to advertiserId
      };
      
      // Check if userId exists
      if (!bookingData.userId) {
        console.warn('Warning: Booking does not have a user ID');
      } else {
        console.log('Using userId as advertiserId:', bookingData.userId);
      }
      
      setBooking(bookingWithAdvertiserId);
      
      // Pre-fill property data from booking
      if (bookingData.propertyAddress || (bookingData.streetName && bookingData.city)) {
        // Create property address from either the propertyAddress object or the individual fields
        const streetAddress = bookingData.propertyAddress?.street || bookingData.streetName || '';
        const streetNumber = bookingData.propertyAddress?.streetNumber || bookingData.streetNumber || '';
        const fullStreet = streetNumber ? `${streetAddress} ${streetNumber}` : streetAddress;
        
        setPropertyData(prevData => ({
          ...prevData,
          // Use userId as the ownerId if advertiserId is not available
          ownerId: bookingData.userId || '',
          address: {
            street: fullStreet,
            city: bookingData.propertyAddress?.city || bookingData.city || '',
            state: bookingData.propertyAddress?.state || bookingData.stateRegion || '',
            zipCode: bookingData.propertyAddress?.zipCode || bookingData.postalCode || '',
            country: bookingData.propertyAddress?.country || bookingData.country || '',
          },
          // Include location data if it exists in the booking
          location: bookingData.location || null,
          propertyType: (bookingData.propertyType?.toLowerCase() === 'apartment' || 
                        bookingData.propertyType?.toLowerCase() === 'house' || 
                        bookingData.propertyType?.toLowerCase() === 'condo' || 
                        bookingData.propertyType?.toLowerCase() === 'land' || 
                        bookingData.propertyType?.toLowerCase() === 'commercial') 
                        ? bookingData.propertyType.toLowerCase() as any : 'apartment',
          title: `Property at ${fullStreet || 'Unknown Location'}`,
        }));
      } else {
        // Even if no property address, still set the ownerId using userId
        setPropertyData(prevData => ({
          ...prevData,
          ownerId: bookingData.userId || ''
        }));
      }
      
      // Load teams - Try to get active teams, if that fails, get all teams
      try {
        console.log('Attempting to load active teams...');
        const teamsData = await TeamServerActions.getActiveTeams();
        console.log('Active teams loaded:', teamsData);
        
        if (!teamsData || teamsData.length === 0) {
          console.log('No active teams found, getting all teams instead');
          const allTeams = await TeamServerActions.getAllTeams();
          console.log('All teams loaded:', allTeams);
          
          if (!allTeams || allTeams.length === 0) {
            console.log('No teams found via server actions, checking Firebase directly');
            await checkTeamsInFirebase();
          } else {
            setTeams(allTeams);
          }
        } else {
          setTeams(teamsData);
        }
      } catch (teamError) {
        console.error('Error loading teams:', teamError);
        // Try getting all teams as fallback
        try {
          console.log('Attempting to load all teams as fallback...');
          const allTeams = await TeamServerActions.getAllTeams();
          console.log('All teams loaded via fallback:', allTeams);
          
          if (!allTeams || allTeams.length === 0) {
            console.log('No teams found via fallback, checking Firebase directly');
            await checkTeamsInFirebase();
          } else {
            setTeams(allTeams || []);
          }
        } catch (fallbackError) {
          console.error('Error loading teams via fallback:', fallbackError);
          console.log('Trying direct Firebase access as last resort');
          await checkTeamsInFirebase();
        }
      }
      
      // Set selected team if booking already has a team assigned
      if (bookingData.teamId) {
        setSelectedTeam(bookingData.teamId);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setTeamDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/dashboard/admin/photoshoot-bookings');
  };
  
  const handleAssignTeam = async () => {
    if (!id || !selectedTeam || !booking) return;
    
    try {
      // Get team data to get members
      const team = await TeamServerActions.getTeamById(selectedTeam);
      
      if (!team) {
        console.error('Team not found');
        return;
      }
      
      // Assign team to booking
      await PhotoshootBookingServerActions.assignTeamToBooking(id, selectedTeam, team.members);
      
      // Refresh booking data
      loadData();
      onUpdateBooking();
      
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning team:', error);
    }
  };
  
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  // Add handlers for property form
  const handlePropertyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested address fields
      const [parent, child] = name.split('.');
      setPropertyData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      // Handle direct fields
      setPropertyData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof PropertyFormData) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setPropertyData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  // Handler for checkbox changes (amenities and features)
  const handleCheckboxChange = (category: 'amenities' | 'features', item: string, checked: boolean) => {
    setPropertyData(prev => {
      const currentItems = [...prev[category]];
      
      if (checked && !currentItems.includes(item)) {
        // Add the item
        return {
          ...prev,
          [category]: [...currentItems, item]
        };
      } else if (!checked && currentItems.includes(item)) {
        // Remove the item
        return {
          ...prev,
          [category]: currentItems.filter(i => i !== item)
        };
      }
      
      return prev;
    });
  };
  
  const isItemSelected = (category: 'amenities' | 'features', item: string): boolean => {
    return propertyData[category].includes(item);
  };
  
  const addAmenity = () => {
    if (amenityInput.trim()) {
      setPropertyData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };
  
  const removeAmenity = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };
  
  const addFeature = () => {
    if (featureInput.trim()) {
      setPropertyData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };
  
  const removeFeature = (index: number) => {
    setPropertyData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  const handleCompleteBooking = async () => {
    if (!id || !booking) return;
    
    // Validate form
    if (!propertyData.title || !propertyData.description || !propertyData.address.street || propertyData.images.length === 0) {
      alert('Please fill in all required fields and add at least one image');
      return;
    }
    
    // Get the actual owner ID, preferring advertiserId (mapped from userId) but falling back to userId directly
    const ownerId = booking.advertiserId || booking.userId;
    
    // Validate owner ID exists
    if (!ownerId) {
      alert('This booking does not have an associated user/advertiser. Cannot create property.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log(`Completing booking ${id} for advertiser/user ID: ${ownerId}`);
      
      // Step 1: Create the property
      const createdPropertyId = await createPropertyAndLinkToAdvertiser(propertyData, ownerId);
      
      // Step 2: Update the booking with the new property ID and mark as completed
      const finalImages = propertyData.images.length > 0 ? propertyData.images : images;
      await PhotoshootBookingServerActions.completeBooking(id, createdPropertyId, finalImages);
      
      // Show success message
      alert(`Booking completed and property created successfully!\nProperty ID: ${createdPropertyId}\nProperty was added to advertiser's properties.`);
      
      // Refresh booking data
      loadData();
      onUpdateBooking();
      
      setShowCompleteModal(false);
    } catch (error) {
      console.error('Error completing booking:', error);
      alert(`Error completing booking: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async () => {
    if (!id || !booking) return;
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await PhotoshootBookingServerActions.cancelBooking(id);
        
        // Refresh booking data
        loadData();
        onUpdateBooking();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading) {
    return <p>Loading booking details...</p>;
  }
  
  if (!booking) {
    return <p>Booking not found.</p>;
  }
  
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Button onClick={handleBackClick}>
          <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Bookings
        </Button>
      </div>
      
      <DashboardCard>
        <CardTitle>
          Photoshoot Booking Details
          <StatusBadge status={booking.status} style={{ marginLeft: '10px' }}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </StatusBadge>
        </CardTitle>
        
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3>Property Details</h3>
              <p><strong>Property Type:</strong> {booking.propertyType || 'N/A'}</p>
              {booking.propertyAddress ? (
                <>
                  <p><strong>Address:</strong> {booking.propertyAddress.street || 'N/A'}, {booking.propertyAddress.streetNumber || 'N/A'}</p>
                  <p><strong>City:</strong> {booking.propertyAddress.city || 'N/A'}</p>
                  <p><strong>State/Region:</strong> {booking.propertyAddress.state || 'N/A'}</p>
                  <p><strong>Postal Code:</strong> {booking.propertyAddress.zipCode || 'N/A'}</p>
                  <p><strong>Country:</strong> {booking.propertyAddress.country || 'N/A'}</p>
                  {booking.propertyAddress.floor && <p><strong>Floor:</strong> {booking.propertyAddress.floor}</p>}
                  {booking.propertyAddress.flat && <p><strong>Flat:</strong> {booking.propertyAddress.flat}</p>}
                </>
              ) : (
                <p><strong>Address:</strong> No address information available</p>
              )}
              {booking.location && (
                <p><strong>Location:</strong> Lat: {booking.location.lat}, Lng: {booking.location.lng}</p>
              )}
            </div>
            
            <div>
              <h3>Booking Information</h3>
              <p><strong>Date:</strong> {booking.date ? formatDate(booking.date) : 'N/A'}</p>
              <p><strong>Time Slot:</strong> {booking.timeSlot || 'N/A'}</p>
              <p><strong>Created:</strong> {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</p>
              <p><strong>Last Updated:</strong> {booking.updatedAt ? formatDate(booking.updatedAt) : 'N/A'}</p>
              {booking.completedAt && <p><strong>Completed:</strong> {formatDate(booking.completedAt)}</p>}
              {booking.comments && <p><strong>Comments:</strong> {booking.comments}</p>}
              {booking.propertyId && <p><strong>Property ID:</strong> {booking.propertyId}</p>}
            </div>
          </div>
          
          {booking.teamId && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Assigned Team</h3>
              <p><strong>Team ID:</strong> {booking.teamId}</p>
              <p><strong>Team Members:</strong> {booking.teamMembers?.join(', ') || 'No members'}</p>
            </div>
          )}
          
          {booking.images && booking.images.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Property Images</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {booking.images.map((image, index) => (
                  <div key={index} style={{ width: '100px', height: '100px', overflow: 'hidden' }}>
                    <img src={image} alt={`Property ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            {booking.status === 'pending' && (
              <Button onClick={() => {
                setShowAssignModal(true);
                // Check for teams when opening the modal
                if (teams.length === 0) {
                  checkTeamsInFirebase();
                }
              }}>
                <FaUsers style={{ marginRight: '5px' }} /> Assign Team
              </Button>
            )}
            
            {booking.status === 'assigned' && (
              <Button onClick={() => setShowCompleteModal(true)}>
                <FaCheck style={{ marginRight: '5px' }} /> Complete Booking
              </Button>
            )}
            
            {(booking.status === 'pending' || booking.status === 'assigned') && (
              <Button onClick={handleCancelBooking} style={{ backgroundColor: '#dc3545' }}>
                Cancel Booking
              </Button>
            )}
          </div>
        </CardContent>
      </DashboardCard>
      
      {/* Assign Team Modal */}
      {showAssignModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Assign Team</ModalTitle>
              <CloseButton onClick={() => setShowAssignModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>Select Team</Label>
              {teams.length === 0 ? (
                <div style={{ color: 'red' }}>
                  <p>No teams available.</p>
                  <p>Please make sure teams are created in the system before assigning.</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Button onClick={() => navigate('/dashboard/admin/teams')}>
                      Go to Teams Management
                    </Button>
                    <Button onClick={() => loadData()}>
                      Reload Teams
                    </Button>
                    <Button onClick={() => navigate('/dashboard/admin/settings')}>
                      Initialize Sample Data
                    </Button>
                    <Button onClick={checkTeamsInFirebase}>
                      Check Firebase Directly
                    </Button>
                  </div>
                </div>
              ) : (
                <Select 
                  value={selectedTeam} 
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">Select a team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members.length} members)
                    </option>
                  ))}
                </Select>
              )}
              <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                Total teams available: {teams.length}
              </div>
              {teamDebugInfo && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <p><strong>Debug Info:</strong> {teamDebugInfo}</p>
                </div>
              )}
            </FormGroup>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowAssignModal(false)}>Cancel</CancelButton>
              <ActionButton 
                onClick={handleAssignTeam}
                disabled={!selectedTeam || teams.length === 0}
              >
                Assign Team
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      
      {/* Complete Booking Modal */}
      {showCompleteModal && (
        <Modal>
          <ModalContent style={{ width: '95%', maxWidth: '900px', maxHeight: '90vh' }}>
            <ModalHeader>
              <ModalTitle>Complete Booking & Create Property</ModalTitle>
              <CloseButton onClick={() => setShowCompleteModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <div style={{ overflowY: 'auto', padding: '10px 0' }}>
              <h3>Basic Property Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <FormGroup>
                  <Label>Property Title*</Label>
                  <Input 
                    type="text" 
                    name="title"
                    value={propertyData.title} 
                    onChange={handlePropertyInputChange}
                    placeholder="e.g. Modern Apartment in Downtown"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Property Type*</Label>
                  <Select 
                    name="propertyType"
                    value={propertyData.propertyType} 
                    onChange={handlePropertyInputChange}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </Select>
                </FormGroup>
              </div>
              
              <FormGroup>
                <Label>Description*</Label>
                <textarea 
                  name="description"
                  value={propertyData.description} 
                  onChange={handlePropertyInputChange}
                  placeholder="Detailed property description"
                  rows={4}
                  style={{ 
                    width: '100%', 
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </FormGroup>
              
              <h3>Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <FormGroup>
                  <Label>Street*</Label>
                  <Input 
                    type="text" 
                    name="address.street"
                    value={propertyData.address.street} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>City*</Label>
                  <Input 
                    type="text" 
                    name="address.city"
                    value={propertyData.address.city} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>State/Province*</Label>
                  <Input 
                    type="text" 
                    name="address.state"
                    value={propertyData.address.state} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Zip/Postal Code*</Label>
                  <Input 
                    type="text" 
                    name="address.zipCode"
                    value={propertyData.address.zipCode} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Country*</Label>
                  <Input 
                    type="text" 
                    name="address.country"
                    value={propertyData.address.country} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
              </div>
              
              <h3>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <FormGroup>
                  <Label>Bedrooms</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.bedrooms} 
                    onChange={(e) => handleNumberInput(e, 'bedrooms')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Bathrooms</Label>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.5"
                    value={propertyData.bathrooms} 
                    onChange={(e) => handleNumberInput(e, 'bathrooms')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Area (sq ft/m)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.area} 
                    onChange={(e) => handleNumberInput(e, 'area')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Price</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.price} 
                    onChange={(e) => handleNumberInput(e, 'price')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Status</Label>
                  <Select 
                    name="status"
                    value={propertyData.status} 
                    onChange={handlePropertyInputChange}
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                  </Select>
                </FormGroup>
              </div>
              
              {/* Location Coordinates */}
              <h3>Location Coordinates</h3>
                    <div style={{ 
                      padding: '10px',
                backgroundColor: '#f5f5f5', 
                      borderRadius: '4px', 
                marginBottom: '20px' 
                    }}>
                {propertyData.location ? (
                  <div>
                    <p><strong>Latitude:</strong> {propertyData.location.lat}</p>
                    <p><strong>Longitude:</strong> {propertyData.location.lng}</p>
                    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
                      Location coordinates from booking will be automatically stored with the property.
                    </p>
                        </div>
                ) : (
                  <p>No location coordinates available from the booking.</p>
                )}
              </div>
              
              {/* Property Images */}
              <h3>Property Images*</h3>
              <FormGroup>
                <Label>Add Image URLs</Label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <Input 
                    type="text" 
                    value={imageInput} 
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    style={{ flex: 1 }}
                  />
                  <Button onClick={() => {
                    if (imageInput.trim()) {
                      setPropertyData(prev => ({
                        ...prev,
                        images: [...prev.images, imageInput.trim()]
                      }));
                      setImageInput('');
                    }
                  }}>
                    <FaPlus /> Add
                  </Button>
                </div>
                
                {propertyData.images.length > 0 && (
                  <div>
                    <Label>Added Images ({propertyData.images.length}):</Label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px',
                      marginTop: '10px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      {propertyData.images.map((image, index) => (
                        <div key={index} style={{ 
                          position: 'relative',
                          width: '100px', 
                          height: '100px', 
                          overflow: 'hidden',
                          borderRadius: '4px'
                        }}>
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3e%3crect width="100" height="100" fill="%23cccccc"/%3e%3ctext x="50%25" y="50%25" font-family="sans-serif" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="%23666666"%3eImage Error%3c/text%3e%3c/svg%3e';
                            }}
                          />
                          <button 
                            onClick={() => {
                              setPropertyData(prev => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index)
                              }));
                            }}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              background: 'rgba(220, 53, 69, 0.8)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '25px',
                              height: '25px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>

              {/* Amenities Section */}
              <h3>Additional Amenities</h3>
              <FormGroup>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <Input 
                    type="text" 
                    value={amenityInput} 
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Add amenity (e.g., WiFi, Furnished, etc.)"
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addAmenity}>
                    <FaPlus /> Add
                  </Button>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <Label>Common Amenities:</Label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    {COMMON_AMENITIES.map(amenity => (
                      <div 
                        key={amenity} 
                        onClick={() => handleCheckboxChange('amenities', amenity, !isItemSelected('amenities', amenity))}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px 10px',
                          border: '1px solid #ddd',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          background: isItemSelected('amenities', amenity) ? '#e6f7ff' : 'white',
                          borderColor: isItemSelected('amenities', amenity) ? '#1890ff' : '#ddd',
                          fontSize: '13px'
                        }}
                      >
                        {isItemSelected('amenities', amenity) && (
                          <div style={{ marginRight: '5px', color: '#1890ff' }}>✓</div>
                        )}
                        {amenity === 'furnished' ? 'Furnished' :
                          amenity === 'sofabed' ? 'Sofabed' :
                          amenity === 'dining-table' ? 'Dining Table' :
                          amenity === 'wardrobe' ? 'Wardrobe' :
                          amenity === 'cabinet' ? 'Cabinet' :
                          amenity === 'chair' ? 'Chair' :
                          amenity === 'desk' ? 'Desk' :
                          amenity === 'sofa' ? 'Sofa' :
                          amenity === 'coffee-table' ? 'Coffee Table' :
                          amenity === 'dresser' ? 'Dresser' :
                          amenity === 'mirror' ? 'Mirror' :
                          amenity === 'walk-in-closet' ? 'Walk-in Closet' :
                          amenity === 'oven' ? 'Oven' :
                          amenity === 'washing-machine' ? 'Washing Machine' :
                          amenity === 'hotplate-cooktop' ? 'Hotplate/Cooktop' :
                          amenity === 'water-heater' ? 'Water Heater' :
                          amenity}
                      </div>
                    ))}
                  </div>
                </div>
                
                {propertyData.amenities.length > 0 && (
                  <div>
                    <Label>Added Amenities ({propertyData.amenities.length}):</Label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px',
                      marginTop: '10px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      {propertyData.amenities.map((amenity, index) => (
                        <div key={index} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: '#f5f5f5',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}>
                          {amenity}
                          <button 
                            onClick={() => removeAmenity(index)}
                            style={{
                              marginLeft: '5px',
                              background: 'transparent',
                              color: '#666',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>
              
              {/* Features Section */}
              <h3>Included Fees</h3>
              <FormGroup>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <Input 
                    type="text" 
                    value={featureInput} 
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add included fee (e.g., Water, Electricity, etc.)"
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addFeature}>
                    <FaPlus /> Add
                  </Button>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <Label>Common Features:</Label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    {COMMON_FEATURES.map(feature => (
                      <div 
                        key={feature} 
                        onClick={() => handleCheckboxChange('features', feature, !isItemSelected('features', feature))}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px 10px',
                          border: '1px solid #ddd',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          background: isItemSelected('features', feature) ? '#e6f7ff' : 'white',
                          borderColor: isItemSelected('features', feature) ? '#1890ff' : '#ddd',
                          fontSize: '13px'
                        }}
                      >
                        {isItemSelected('features', feature) && (
                          <div style={{ marginRight: '5px', color: '#1890ff' }}>✓</div>
                        )}
                        {feature === 'water' ? 'Water' :
                          feature === 'electricity' ? 'Electricity' :
                          feature === 'wifi' ? 'Wi-Fi' :
                          feature === 'women-only' ? 'Women Only' :
                          feature}
                      </div>
                    ))}
                  </div>
                </div>
                
                {propertyData.features.length > 0 && (
                  <div>
                    <Label>Added Features ({propertyData.features.length}):</Label>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px',
                      marginTop: '10px',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      {propertyData.features.map((feature, index) => (
                        <div key={index} style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: '#f5f5f5',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}>
                          {feature}
                          <button 
                            onClick={() => removeFeature(index)}
                            style={{
                              marginLeft: '5px',
                              background: 'transparent',
                              color: '#666',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>
            </div>
            
            <ModalFooter>
              <CancelButton onClick={() => setShowCompleteModal(false)}>Cancel</CancelButton>
              <ActionButton 
                onClick={handleCompleteBooking}
                disabled={
                  !propertyData.title || 
                  !propertyData.description || 
                  !propertyData.address.street || 
                  !propertyData.address.city ||
                  propertyData.images.length === 0
                }
              >
                Complete Booking & Create Property
              </ActionButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default PhotoshootBookingDetail; 