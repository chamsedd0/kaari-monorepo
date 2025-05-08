import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaUpload, FaCheck, FaPlus, FaTimes, FaTrash, FaBan } from 'react-icons/fa';
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
import { secureUploadMultipleFiles } from '../../../backend/firebase/storage';

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
  deposit: number;
  serviceFee: number;
  minstay: string;
  availableFrom: string;
  images: string[];
  amenities: string[];
  features: string[];
  status: 'available' | 'occupied';
  location: {
    lat: number;
    lng: number;
  } | null;
  rooms: Array<{
    type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living';
    area: number;
  }>;
  isFurnished: boolean;
  capacity: number;
  rules: Array<{
    name: string;
    allowed: boolean;
  }>;
  nearbyPlaces: Array<{
    name: string;
    timeDistance: string;
  }>;
}

// Room type options
const ROOM_TYPES = [
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'storage', label: 'Storage Room' },
  { value: 'living', label: 'Living Room' }
];

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

// Common rules
const COMMON_RULES = [
  { name: 'Smoking', allowed: false },
  { name: 'Parties', allowed: false },
  { name: 'Animals/Pets', allowed: false },
  { name: 'Children', allowed: true },
  { name: 'Additional guests', allowed: false }
];

// Common nearby places
const COMMON_NEARBY_PLACES = [
  { name: 'Workplaces', timeDistance: '10 minutes' },
  { name: 'Grocery stores', timeDistance: '15 minutes' },
  { name: 'Schools', timeDistance: '10 minutes' },
  { name: 'Supermarkets', timeDistance: '10 minutes' },
  { name: 'Medical facilities', timeDistance: '15 minutes' },
  { name: 'Public transport', timeDistance: '5 minutes' },
  { name: 'Restaurants', timeDistance: '8 minutes' },
  { name: 'Shopping centers', timeDistance: '20 minutes' },
  { name: 'Parks', timeDistance: '12 minutes' },
  { name: 'Gyms', timeDistance: '10 minutes' }
];

// Helper functions for getting booking address information
const getBookingStreet = (booking: PhotoshootBooking): string => {
  if (booking.propertyAddress?.street) {
    const streetNumber = booking.propertyAddress.streetNumber || '';
    return `${booking.propertyAddress.street} ${streetNumber}`.trim();
  } else if (booking.streetName) {
    const streetNumber = booking.streetNumber || '';
    return `${booking.streetName} ${streetNumber}`.trim();
  }
  return '';
};

const getBookingCity = (booking: PhotoshootBooking): string => {
  return booking.propertyAddress?.city || booking.city || '';
};

const PhotoshootBookingDetail: React.FC<PhotoshootBookingDetailProps> = ({ onUpdateBooking }) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to extract ID from URL path if useParams doesn't work
  const extractIdFromPath = (): string | null => {
    const match = location.pathname.match(/\/view\/([^\/]+)/);
    return match ? match[1] : null;
  };
  
  const bookingId = params.id || extractIdFromPath();
  
  console.log('PhotoshootBookingDetail: params =', params);
  console.log('PhotoshootBookingDetail: location =', location);
  console.log('PhotoshootBookingDetail: extracted bookingId =', bookingId);
  
  const [booking, setBooking] = useState<PhotoshootBooking | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamDebugInfo, setTeamDebugInfo] = useState<string>('');
  
  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  
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
    deposit: 0,
    serviceFee: 0,
    minstay: '',
    availableFrom: '',
    images: [],
    amenities: [],
    features: [],
    status: 'available',
    location: null,
    rooms: [],
    isFurnished: false,
    capacity: 0,
    rules: [],
    nearbyPlaces: [],
  });
  
  const [amenityInput, setAmenityInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  
  // New state for room management
  const [roomFormData, setRoomFormData] = useState<{ type: 'bedroom' | 'bathroom' | 'kitchen' | 'storage' | 'living'; area: number }>({
    type: 'bedroom',
    area: 0
  });
  
  // New state for rules and nearby places
  const [ruleInput, setRuleInput] = useState('');
  const [placeNameInput, setPlaceNameInput] = useState('');
  const [placeDistanceInput, setPlaceDistanceInput] = useState('');
  
  // Add handler for rule toggling
  const handleRuleToggle = (index: number) => {
    setPropertyData(prevData => {
      const updatedRules = [...prevData.rules];
      updatedRules[index] = {
        ...updatedRules[index],
        allowed: !updatedRules[index].allowed
      };
      return {
        ...prevData,
        rules: updatedRules
      };
    });
  };

  // Add new rule
  const addRule = () => {
    if (!ruleInput.trim()) return;
    
    setPropertyData(prevData => ({
      ...prevData,
      rules: [
        ...prevData.rules,
        { name: ruleInput, allowed: false }
      ]
    }));
    
    setRuleInput('');
  };

  // Remove rule
  const removeRule = (index: number) => {
    setPropertyData(prevData => ({
      ...prevData,
      rules: prevData.rules.filter((_, i) => i !== index)
    }));
  };

  // Add nearby place
  const addNearbyPlace = () => {
    if (!placeNameInput.trim() || !placeDistanceInput.trim()) return;
    
    setPropertyData(prevData => ({
      ...prevData,
      nearbyPlaces: [
        ...prevData.nearbyPlaces,
        { name: placeNameInput, timeDistance: placeDistanceInput }
      ]
    }));
    
    setPlaceNameInput('');
    setPlaceDistanceInput('');
  };

  // Remove nearby place
  const removeNearbyPlace = (index: number) => {
    setPropertyData(prevData => ({
      ...prevData,
      nearbyPlaces: prevData.nearbyPlaces.filter((_, i) => i !== index)
    }));
  };

  // Update nearby place
  const updateNearbyPlace = (index: number, field: 'name' | 'timeDistance', value: string) => {
    setPropertyData(prevData => {
      const updatedPlaces = [...prevData.nearbyPlaces];
      updatedPlaces[index] = {
        ...updatedPlaces[index],
        [field]: value
      };
      return {
        ...prevData,
        nearbyPlaces: updatedPlaces
      };
    });
  };
  
  // Handle capacity change
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPropertyData(prevData => ({
      ...prevData,
      capacity: isNaN(value) ? 0 : value
    }));
  };

  // Handle furnished toggle
  const handleFurnishedToggle = () => {
    setPropertyData(prevData => ({
      ...prevData,
      isFurnished: !prevData.isFurnished
    }));
  };
  
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
        deposit: propertyData.deposit,
        serviceFee: propertyData.serviceFee,
        minstay: propertyData.minstay,
        availableFrom: propertyData.availableFrom ? propertyData.availableFrom : null,
        images: propertyData.images,
        amenities: propertyData.amenities,
        features: propertyData.features,
        status: propertyData.status,
        // Include location data if available
        location: propertyData.location,
        // Include rooms array
        rooms: propertyData.rooms,
        isFurnished: propertyData.isFurnished,
        capacity: propertyData.capacity,
        rules: propertyData.rules,
        nearbyPlaces: propertyData.nearbyPlaces,
      };
      
      // Log the data being sent to Firestore for debugging
      console.log('Property data being saved:', JSON.stringify({
        ...propertyWithTimestamps,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }, null, 2));
      
      // Specifically log the location data to verify it's being passed correctly
      console.log('GEOLOCATION DATA BEING SAVED:', propertyWithTimestamps.location);
      
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
    if (bookingId) {
      console.log('ID for loading data:', bookingId);
      setLoadError(null);
      loadData(bookingId);
    } else {
      const error = 'ID parameter is missing from URL';
      console.error(error);
      setLoadError(error);
      // Only navigate if we're not already on the main page to avoid loops
      if (location.pathname.includes('/view/')) {
        navigate('/dashboard/admin/photoshoot-bookings');
      }
    }
  }, [bookingId, navigate, location.pathname]);
  
  const loadData = async (id: string) => {
      setLoading(true);
    setLoadError(null);
    try {
      const bookingData = await PhotoshootBookingServerActions.getBookingById(id);
      console.log('Loaded booking data:', bookingData);
      
      if (!bookingData) {
        throw new Error('Booking not found');
      }
      
      // Debug location information from booking
      console.log('LOCATION DATA FROM BOOKING:', bookingData.location);
      
      setBooking(bookingData);
      
      // Initialize property data with booking address
      setPropertyData({
        id: '',
        ownerId: bookingData.advertiserId || bookingData.userId || '',
        title: `${bookingData.propertyType || 'Property'} in ${getBookingCity(bookingData)}`,
        description: `A beautiful ${bookingData.propertyType || 'property'} located in ${getBookingCity(bookingData)}.`,
          address: {
          street: getBookingStreet(bookingData),
          city: getBookingCity(bookingData),
          state: bookingData.stateRegion || bookingData.propertyAddress?.state || '',
          zipCode: bookingData.postalCode || bookingData.propertyAddress?.zipCode || '',
          country: bookingData.country || bookingData.propertyAddress?.country || 'Morocco',
        },
        propertyType: bookingData.propertyType === 'house' ? 'house' : 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        price: 0,
        deposit: 0,
        serviceFee: 0,
        minstay: '',
        availableFrom: new Date().toISOString().split('T')[0],
        images: bookingData.images || [],
        amenities: [],
        features: [],
        status: 'available',
          location: bookingData.location || null,
        rooms: [],
        isFurnished: false,
        capacity: 2,
        rules: [...COMMON_RULES], // Use the common rules as defaults
        nearbyPlaces: [...COMMON_NEARBY_PLACES], // Use the common nearby places as defaults
      });
      
      // Load teams for assignment
      const teamsData = await TeamServerActions.getAllTeams();
      console.log('Loaded teams data:', teamsData);
      setTeams(teamsData);
      
      // If no teams were found through server actions, try direct Firebase query
        if (!teamsData || teamsData.length === 0) {
            await checkTeamsInFirebase();
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      setLoadError(error instanceof Error ? error.message : 'Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/dashboard/admin/photoshoot-bookings');
  };
  
  const handleAssignTeam = async () => {
    if (!bookingId || !selectedTeam || !booking) return;
    
    try {
      // Get team data to get members
      const team = await TeamServerActions.getTeamById(selectedTeam);
      
      if (!team) {
        console.error('Team not found');
        return;
      }
      
      // Assign team to booking
      await PhotoshootBookingServerActions.assignTeamToBooking(bookingId, selectedTeam, team.members);
      
      // Refresh booking data
      loadData(bookingId);
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
  
  // Function to handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to array and add to state
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Auto-start the upload process
      try {
        setUploading(true);
        
        // For temporary property ID use a timestamp + random string
        const tempPropertyId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const basePath = `properties/${tempPropertyId}/images`;
        
        // Upload files using secure upload
        const uploadedUrls = await secureUploadMultipleFiles(
          newFiles,
          basePath,
          'property_'
        );
        
        // Update property data with the new image URLs
        setPropertyData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
        
        // Clear the selected files after successful upload
        setImageFiles([]);
        
      } catch (error) {
        console.error('Error uploading files:', error);
        alert(`Error uploading files: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setUploading(false);
      }
    }
  };
  
  // Function to remove a selected file
  const handleRemoveFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Function to upload files
  const handleUploadFiles = async () => {
    if (imageFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // For temporary property ID use a timestamp + random string
      const tempPropertyId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const basePath = `properties/${tempPropertyId}/images`;
      
      // Upload files using secure upload
      const uploadedUrls = await secureUploadMultipleFiles(
        imageFiles,
        basePath,
        'property_'
      );
      
      // Update property data with the new image URLs
      setPropertyData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      // Clear the selected files after successful upload
      setImageFiles([]);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      alert(`Error uploading files: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploading(false);
    }
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
  
  // Function to add a new room
  const handleAddRoom = () => {
    if (roomFormData.area <= 0) {
      alert('Room area must be greater than 0');
      return;
    }
    
    setPropertyData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { ...roomFormData }]
    }));
    
    // Update bedrooms/bathrooms count for backward compatibility
    if (roomFormData.type === 'bedroom') {
      setPropertyData(prev => ({
        ...prev,
        bedrooms: prev.bedrooms + 1
      }));
    } else if (roomFormData.type === 'bathroom') {
      setPropertyData(prev => ({
        ...prev,
        bathrooms: prev.bathrooms + 1
      }));
    }
    
    // Reset room form
    setRoomFormData({
      type: 'bedroom',
      area: 0
    });
  };
  
  // Function to remove a room
  const handleRemoveRoom = (index: number) => {
    const roomToRemove = propertyData.rooms[index];
    
    setPropertyData(prev => {
      // Update bedrooms/bathrooms count for backward compatibility
      let updatedBedroomsCount = prev.bedrooms;
      let updatedBathroomsCount = prev.bathrooms;
      
      if (roomToRemove.type === 'bedroom') {
        updatedBedroomsCount = Math.max(0, updatedBedroomsCount - 1);
      } else if (roomToRemove.type === 'bathroom') {
        updatedBathroomsCount = Math.max(0, updatedBathroomsCount - 1);
      }
      
      return {
        ...prev,
        rooms: prev.rooms.filter((_, i) => i !== index),
        bedrooms: updatedBedroomsCount,
        bathrooms: updatedBathroomsCount
      };
    });
  };
  
  // Function to handle room form input changes
  const handleRoomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setRoomFormData(prev => ({
      ...prev,
      [name]: name === 'area' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleCompleteBooking = async () => {
    if (!bookingId || !booking) return;
    
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
      console.log(`Completing booking ${bookingId} for advertiser/user ID: ${ownerId}`);
      
      // Step 1: Create the property
      const createdPropertyId = await createPropertyAndLinkToAdvertiser(propertyData, ownerId);
      
      // Step 2: Update the booking with the new property ID and mark as completed
      const finalImages = propertyData.images.length > 0 ? propertyData.images : images;
      await PhotoshootBookingServerActions.completeBooking(bookingId, createdPropertyId, finalImages);
      
      // Show success message
      alert(`Booking completed and property created successfully!\nProperty ID: ${createdPropertyId}\nProperty was added to advertiser's properties.`);
      
      // Refresh booking data
      loadData(bookingId);
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
    if (!bookingId || !booking) return;
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await PhotoshootBookingServerActions.cancelBooking(bookingId);
        
        // Refresh booking data
        loadData(bookingId);
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
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={handleBackClick}>
            <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Bookings
          </Button>
        </div>
        
        <DashboardCard>
          <CardTitle>Loading Booking Details...</CardTitle>
          <CardContent>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #6200EA',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  animation: 'spin 2s linear infinite',
                  margin: '0 auto 20px'
                }} />
                <p>Loading booking information for ID: {bookingId}...</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  This may take a few moments. If it continues loading for more than a minute, 
                  please try refreshing the page.
                </p>
              </div>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          </CardContent>
        </DashboardCard>
      </div>
    );
  }
  
  if (loadError || !booking) {
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Button onClick={handleBackClick}>
            <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Bookings
          </Button>
        </div>
        
        <DashboardCard>
          <CardTitle>Error Loading Booking</CardTitle>
          <CardContent>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <p style={{ color: 'red', marginBottom: '15px' }}>
                {loadError || 'The requested booking could not be found or there was an error loading it.'}
              </p>
              <p>Booking ID: {bookingId || 'Not provided'}</p>
              <Button onClick={handleBackClick} style={{ marginTop: '20px' }}>
                Return to Bookings List
              </Button>
            </div>
          </CardContent>
        </DashboardCard>
      </div>
    );
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
          {booking && (
            <StatusBadge $status={booking.status} style={{ marginLeft: '10px' }}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </StatusBadge>
          )}
        </CardTitle>
        
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <FormGroup>
                  <Label>Total Area (sq m)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.area} 
                    onChange={(e) => handleNumberInput(e, 'area')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Price (per month)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.price} 
                    onChange={(e) => handleNumberInput(e, 'price')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Capacity (people)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.capacity} 
                    onChange={handleCapacityChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="furnished-checkbox"
                      checked={propertyData.isFurnished}
                      onChange={handleFurnishedToggle}
                      style={{ marginRight: '8px' }}
                    />
                    <Label htmlFor="furnished-checkbox" style={{ margin: 0 }}>Furnished</Label>
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Deposit Amount</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.deposit} 
                    onChange={(e) => handleNumberInput(e, 'deposit')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Service Fee</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.serviceFee} 
                    onChange={(e) => handleNumberInput(e, 'serviceFee')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Min. Stay Length</Label>
                  <Input 
                    type="text" 
                    name="minstay"
                    placeholder="e.g., 6 months"
                    value={propertyData.minstay} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Available From</Label>
                  <Input 
                    type="date" 
                    name="availableFrom"
                    value={propertyData.availableFrom} 
                    onChange={handlePropertyInputChange}
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
                    <option value="occupied">Occupied</option>
                  </Select>
                </FormGroup>
                
                {/* Location display */}
                {propertyData.location && (
                  <div style={{ 
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginTop: '10px',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                      Property Location Data (for Map Display)
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>Latitude:</strong> {propertyData.location.lat}</span>
                      <span><strong>Longitude:</strong> {propertyData.location.lng}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      This geolocation data will be used to display the property on maps and for searches.
                    </p>
                  </div>
                )}
              </div>
              
              <h3>Property Images</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add images of the property. At least one image is required.
                </p>
                
                {/* Existing images */}
                {propertyData.images.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Current Images</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.images.map((image, index) => (
                        <div key={index} style={{ 
                          position: 'relative',
                          width: '120px', 
                          height: '120px',
                          border: '1px solid #eee',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Image+Error';
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
                              background: 'rgba(255, 0, 0, 0.7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
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
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No images added yet. Please add at least one property image.
                  </p>
                )}
                
                {/* File Upload UI */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Upload Property Images</h4>
                  
                  {/* Selected files section */}
                  {imageFiles.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ fontSize: '14px', color: '#555' }}>Selected Files:</h5>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px',
                        marginBottom: '10px'
                      }}>
                        {imageFiles.map((file, index) => (
                          <div key={index} style={{ 
                            position: 'relative',
                            border: '1px solid #eee',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            paddingRight: '30px',
                            backgroundColor: '#f9f9f9'
                          }}>
                            <span style={{ fontSize: '14px' }}>
                              {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                            </span>
                            <button 
                              onClick={() => handleRemoveFile(index)}
                              style={{ 
                                position: 'absolute',
                                top: '50%',
                                right: '5px',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                color: '#666',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={handleUploadFiles}
                        disabled={uploading || imageFiles.length === 0}
                        style={{ 
                          backgroundColor: '#6200EA',
                          marginRight: '10px'
                        }}
                      >
                        {uploading ? 'Uploading...' : `Upload ${imageFiles.length} file${imageFiles.length !== 1 ? 's' : ''}`}
                      </Button>
                    </div>
                  )}
                  
                  {/* File input */}
                  <div style={{ 
                    border: '2px dashed #ddd',
                    borderRadius: '4px',
                    padding: '15px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    position: 'relative'
                  }}>
                    {uploading ? (
                      <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        borderRadius: '4px'
                      }}>
                        <div style={{ 
                          border: '4px solid #f3f3f3',
                          borderTop: '4px solid #6200EA',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '10px'
                        }} />
                        <p>Uploading images...</p>
                      </div>
                    ) : null}
                    <FaUpload size={24} style={{ color: '#666', marginBottom: '10px' }} />
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                      {uploading 
                        ? 'Images are being uploaded...' 
                        : 'Drag and drop your property images here, or click to select files'}
                    </p>
                    <input
                      type="file"
                      id="property-images-input"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="property-images-input">
                      <Button
                        as="span"
                        style={{ 
                          display: 'inline-block',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          opacity: uploading ? 0.7 : 1
                        }}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Select Images'}
                      </Button>
                    </label>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#999' }}>
                      Allowed formats: JPG, PNG, WEBP | Max size: 10MB per file
                    </p>
                  </div>
                  
                  {/* Legacy URL input for backward compatibility */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <h4 style={{ fontSize: '14px', color: '#666' }}>Alternative: Add an Image URL</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Image URL</Label>
                      <Input 
                        type="text" 
                        placeholder="https://example.com/image.jpg"
                        value={imageInput} 
                        onChange={(e) => setImageInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={() => {
                        if (imageInput.trim()) {
                          setPropertyData(prev => ({
                            ...prev,
                            images: [...prev.images, imageInput.trim()]
                          }));
                          setImageInput('');
                        }
                      }}
                      style={{ height: '38px' }}
                      disabled={!imageInput.trim()}
                    >
                        Add URL
                    </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rooms Management Section */}
              <h3>Rooms</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginTop: 0 }}>Add a Room</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 2 }}>
                      <Label>Room Type</Label>
                      <Select 
                        name="type"
                        value={roomFormData.type} 
                        onChange={handleRoomFormChange}
                      >
                        {ROOM_TYPES.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Area (sq m)</Label>
                      <Input 
                        type="number" 
                        name="area"
                        min="0"
                        value={roomFormData.area} 
                        onChange={handleRoomFormChange}
                      />
                    </FormGroup>
                    <Button 
                      onClick={handleAddRoom}
                      style={{ height: '38px' }}
                    >
                      Add Room
                    </Button>
                  </div>
                </div>
                
                {propertyData.rooms.length > 0 ? (
                  <div>
                    <h4>Added Rooms</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                      gap: '10px' 
                    }}>
                          {propertyData.rooms.map((room, index) => (
                        <div key={index} style={{ 
                          padding: '10px', 
                          border: '1px solid #eee', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>
                              {ROOM_TYPES.find(t => t.value === room.type)?.label || room.type}
                            </div>
                            <div>{room.area} sq m</div>
                          </div>
                                <button 
                                  onClick={() => handleRemoveRoom(index)}
                                  style={{
                              background: 'none', 
                                    border: 'none',
                              cursor: 'pointer',
                              color: 'red',
                              fontSize: '16px'
                            }}
                          >
                            <FaTrash />
                                </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No rooms added yet.</p>
                )}
                    </div>
                    
              {/* Rules Management Section */}
              <h3>Rules</h3>
                    <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                {/* Existing rules with toggle */}
                {propertyData.rules.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Rules</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                      gap: '10px' 
                    }}>
                      {propertyData.rules.map((rule, index) => (
                        <div key={index} style={{ 
                          padding: '10px', 
                          border: '1px solid #eee', 
                          borderRadius: '4px',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div 
                              style={{ 
                                width: '18px', 
                                height: '18px', 
                                borderRadius: '50%', 
                                backgroundColor: rule.allowed ? '#4CAF50' : '#F44336',
                                marginRight: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px'
                              }}
                            >
                              {rule.allowed ? '✓' : '✕'}
                      </div>
                            <div>{rule.name}</div>
                      </div>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              onClick={() => handleRuleToggle(index)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: '#2196F3',
                                fontSize: '16px',
                                padding: '4px'
                              }}
                              title={rule.allowed ? "Mark as not allowed" : "Mark as allowed"}
                            >
                              {rule.allowed ? <FaBan /> : <FaCheck />}
                            </button>
                            <button 
                              onClick={() => removeRule(index)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: 'red',
                                fontSize: '16px',
                                padding: '4px'
                              }}
                              title="Remove rule"
                            >
                              <FaTrash />
                            </button>
                      </div>
                      </div>
                      ))}
                    </div>
                  </div>
              ) : (
                  <p>No rules added yet.</p>
                )}
                
                {/* Add new rule */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Rule</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Rule Name</Label>
                      <Input 
                        type="text" 
                        placeholder="e.g., No pets"
                        value={ruleInput} 
                        onChange={(e) => setRuleInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addRule}
                      style={{ height: '38px' }}
                    >
                      Add Rule
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Nearby Places Management Section */}
              <h3>Nearby Places</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add nearby amenities with their distance/time. These will be displayed in the property listing to help potential renters understand the neighborhood.
                </p>
                
                {/* Existing nearby places */}
                {propertyData.nearbyPlaces.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Places Nearby</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '10px' 
                    }}>
                      {propertyData.nearbyPlaces.map((place, index) => (
                        <div key={index} style={{ 
                          padding: '12px 15px', 
                          border: '1px solid #eee', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#f9f9f9'
                        }}>
                          <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{place.name}</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>{place.timeDistance}</div>
                          </div>
                          <button 
                            onClick={() => removeNearbyPlace(index)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              color: 'red',
                              fontSize: '16px'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No nearby places added yet. Common examples include Workplaces, Schools, Grocery stores, Supermarkets, Medical transport, etc.
                  </p>
                )}
                
                {/* Add new nearby place */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Nearby Place</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Place Name</Label>
                <Input 
                        type="text" 
                        placeholder="e.g., Supermarkets, Schools, Workplaces"
                        value={placeNameInput} 
                        onChange={(e) => setPlaceNameInput(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Distance (time)</Label>
                <Input 
                        type="text" 
                        placeholder="e.g., 10 minutes"
                        value={placeDistanceInput} 
                        onChange={(e) => setPlaceDistanceInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addNearbyPlace}
                      style={{ height: '38px' }}
                      disabled={!placeNameInput.trim() || !placeDistanceInput.trim()}
                    >
                      Add Place
                    </Button>
                  </div>
              </div>
              
                {/* Quick add buttons for common places */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Quick Add Common Places:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_NEARBY_PLACES.map((place, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPropertyData(prev => ({
                            ...prev,
                            nearbyPlaces: [...prev.nearbyPlaces, place]
                          }));
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaPlus size={10} /> {place.name} ({place.timeDistance})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Amenities Management Section */}
              <h3>Amenities</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px', 
                marginBottom: '20px' 
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add amenities that are included with the property, such as furniture, appliances, etc.
                </p>
                
                {/* Existing amenities */}
                {propertyData.amenities.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Amenities</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.amenities.map((amenity, index) => (
                        <div key={index} style={{ 
                          padding: '8px 12px',
                          background: '#f0f8ff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <span>{amenity}</span>
                          <button 
                            onClick={() => removeAmenity(index)}
                            style={{ 
                              background: 'none',
                              border: 'none',
                              color: 'red',
                              cursor: 'pointer',
                              padding: '0',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No amenities added yet. Common examples include furnishings, appliances, etc.
                  </p>
                )}
                
                {/* Add new amenity */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add an Amenity</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Amenity Name</Label>
                      <Input 
                        type="text" 
                        placeholder="e.g., sofa, dining table"
                        value={amenityInput} 
                        onChange={(e) => setAmenityInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addAmenity}
                      style={{ height: '38px' }}
                      disabled={!amenityInput.trim()}
                    >
                      Add Amenity
                    </Button>
                  </div>
                </div>
                
                {/* Quick add common amenities */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Common Amenities:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_AMENITIES.map((amenity, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: isItemSelected('amenities', amenity) ? '#e6f7ff' : '#f0f0f0',
                          border: `1px solid ${isItemSelected('amenities', amenity) ? '#91d5ff' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <input 
                            type="checkbox"
                            checked={isItemSelected('amenities', amenity)}
                            onChange={(e) => handleCheckboxChange('amenities', amenity, e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Features Management Section */}
              <h3>Features</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add features available at the property, such as utilities, facilities, etc.
                </p>
                
                {/* Existing features */}
                {propertyData.features.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Features</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.features.map((feature, index) => (
                        <div key={index} style={{ 
                          padding: '8px 12px',
                          background: '#f0fff0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <span>{feature}</span>
                          <button 
                            onClick={() => removeFeature(index)}
                            style={{ 
                              background: 'none',
                              border: 'none',
                              color: 'red',
                              cursor: 'pointer',
                              padding: '0',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No features added yet. Common examples include utilities, facilities, etc.
                  </p>
                )}
                
                {/* Add new feature */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Feature</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Feature Name</Label>
                      <Input 
                        type="text" 
                        placeholder="e.g., wifi, water, electricity"
                        value={featureInput} 
                        onChange={(e) => setFeatureInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addFeature}
                      style={{ height: '38px' }}
                      disabled={!featureInput.trim()}
                    >
                      Add Feature
                    </Button>
                  </div>
                </div>
                
                {/* Quick add common features */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Common Features:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_FEATURES.map((feature, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: isItemSelected('features', feature) ? '#e6ffe6' : '#f0f0f0',
                          border: `1px solid ${isItemSelected('features', feature) ? '#b7eb8f' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <input 
                            type="checkbox"
                            checked={isItemSelected('features', feature)}
                            onChange={(e) => handleCheckboxChange('features', feature, e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                    <Button onClick={() => loadData(bookingId)}>
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
              
              <h3>Property Images</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add images of the property. At least one image is required.
                </p>
                
                {/* Existing images */}
                {propertyData.images.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Current Images</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.images.map((image, index) => (
                        <div key={index} style={{ 
                          position: 'relative',
                          width: '120px', 
                          height: '120px',
                          border: '1px solid #eee',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={image} 
                            alt={`Property ${index + 1}`} 
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover' 
                            }} 
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/120x120?text=Image+Error';
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
                              background: 'rgba(255, 0, 0, 0.7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '24px',
                              height: '24px',
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
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No images added yet. Please add at least one property image.
                  </p>
                )}
                
                {/* File Upload UI */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Upload Property Images</h4>
                  
                  {/* Selected files section */}
                  {imageFiles.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ fontSize: '14px', color: '#555' }}>Selected Files:</h5>
                      <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px',
                        marginBottom: '10px'
                      }}>
                        {imageFiles.map((file, index) => (
                          <div key={index} style={{ 
                            position: 'relative',
                            border: '1px solid #eee',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            paddingRight: '30px',
                            backgroundColor: '#f9f9f9'
                          }}>
                            <span style={{ fontSize: '14px' }}>
                              {file.name.length > 20 ? `${file.name.substring(0, 17)}...` : file.name}
                            </span>
                            <button 
                              onClick={() => handleRemoveFile(index)}
                              style={{ 
                                position: 'absolute',
                                top: '50%',
                                right: '5px',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                color: '#666',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={handleUploadFiles}
                        disabled={uploading || imageFiles.length === 0}
                        style={{ 
                          backgroundColor: '#6200EA',
                          marginRight: '10px'
                        }}
                      >
                        {uploading ? 'Uploading...' : `Upload ${imageFiles.length} file${imageFiles.length !== 1 ? 's' : ''}`}
                      </Button>
                    </div>
                  )}
                  
                  {/* File input */}
                  <div style={{ 
                    border: '2px dashed #ddd',
                    borderRadius: '4px',
                    padding: '15px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                    position: 'relative'
                  }}>
                    {uploading ? (
                      <div style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        borderRadius: '4px'
                      }}>
                        <div style={{ 
                          border: '4px solid #f3f3f3',
                          borderTop: '4px solid #6200EA',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          animation: 'spin 1s linear infinite',
                          marginBottom: '10px'
                        }} />
                        <p>Uploading images...</p>
                      </div>
                    ) : null}
                    <FaUpload size={24} style={{ color: '#666', marginBottom: '10px' }} />
                    <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                      {uploading 
                        ? 'Images are being uploaded...' 
                        : 'Drag and drop your property images here, or click to select files'}
                    </p>
                    <input
                      type="file"
                      id="property-images-input"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="property-images-input">
                      <Button
                        as="span"
                        style={{ 
                          display: 'inline-block',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          opacity: uploading ? 0.7 : 1
                        }}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Select Images'}
                      </Button>
                    </label>
                    <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#999' }}>
                      Allowed formats: JPG, PNG, WEBP | Max size: 10MB per file
                    </p>
                  </div>
                  
                  {/* Legacy URL input for backward compatibility */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <h4 style={{ fontSize: '14px', color: '#666' }}>Alternative: Add an Image URL</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Image URL</Label>
                      <Input 
                        type="text" 
                        placeholder="https://example.com/image.jpg"
                        value={imageInput} 
                        onChange={(e) => setImageInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={() => {
                        if (imageInput.trim()) {
                          setPropertyData(prev => ({
                            ...prev,
                            images: [...prev.images, imageInput.trim()]
                          }));
                          setImageInput('');
                        }
                      }}
                      style={{ height: '38px' }}
                      disabled={!imageInput.trim()}
                    >
                        Add URL
                    </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <FormGroup>
                  <Label>Total Area (sq m)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.area} 
                    onChange={(e) => handleNumberInput(e, 'area')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Price (per month)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.price} 
                    onChange={(e) => handleNumberInput(e, 'price')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Capacity (people)</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.capacity} 
                    onChange={handleCapacityChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="furnished-checkbox"
                      checked={propertyData.isFurnished}
                      onChange={handleFurnishedToggle}
                      style={{ marginRight: '8px' }}
                    />
                    <Label htmlFor="furnished-checkbox" style={{ margin: 0 }}>Furnished</Label>
                  </div>
                </FormGroup>
                
                <FormGroup>
                  <Label>Deposit Amount</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.deposit} 
                    onChange={(e) => handleNumberInput(e, 'deposit')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Service Fee</Label>
                  <Input 
                    type="number" 
                    min="0"
                    value={propertyData.serviceFee} 
                    onChange={(e) => handleNumberInput(e, 'serviceFee')}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Min. Stay Length</Label>
                  <Input 
                    type="text" 
                    name="minstay"
                    placeholder="e.g., 6 months"
                    value={propertyData.minstay} 
                    onChange={handlePropertyInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Available From</Label>
                  <Input 
                    type="date" 
                    name="availableFrom"
                    value={propertyData.availableFrom} 
                    onChange={handlePropertyInputChange}
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
                    <option value="occupied">Occupied</option>
                  </Select>
                </FormGroup>
                
                {/* Location display */}
                {propertyData.location && (
                  <div style={{ 
                    padding: '10px 15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    background: '#f8f9fa'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                      Property Location Data (for Map Display)
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>Latitude:</strong> {propertyData.location.lat}</span>
                      <span><strong>Longitude:</strong> {propertyData.location.lng}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px', marginBottom: '0' }}>
                      This geolocation data from the photoshoot booking will be used to display the property on maps and for location-based searches.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Rooms Management Section */}
              <h3>Rooms</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ marginTop: 0 }}>Add a Room</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 2 }}>
                      <Label>Room Type</Label>
                      <Select 
                        name="type"
                        value={roomFormData.type} 
                        onChange={handleRoomFormChange}
                      >
                        {ROOM_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Area (sq m)</Label>
                      <Input 
                        type="number" 
                        name="area"
                        min="0"
                        value={roomFormData.area} 
                        onChange={handleRoomFormChange}
                      />
                    </FormGroup>
                    
                    <Button onClick={handleAddRoom} style={{ marginBottom: '5px' }}>
                      <FaPlus /> Add Room
                    </Button>
                  </div>
                </div>
                
                {propertyData.rooms.length > 0 ? (
                  <div>
                    <h4 style={{ marginTop: 0 }}>Room List</h4>
                    <div style={{ 
                      maxHeight: '200px',
                      overflowY: 'auto',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Room Type</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Area (sq m)</th>
                            <th style={{ padding: '8px', textAlign: 'center', width: '80px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propertyData.rooms.map((room, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                              <td style={{ padding: '8px' }}>
                                {ROOM_TYPES.find(type => type.value === room.type)?.label || room.type}
                              </td>
                              <td style={{ padding: '8px' }}>{room.area} sq m</td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => handleRemoveRoom(index)}
                                  style={{
                                    background: 'rgba(220, 53, 69, 0.8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '5px 10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <FaTimes size={12} /> Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px'
                    }}>
                      <div>
                        <strong>Bedrooms:</strong> {propertyData.rooms.filter(room => room.type === 'bedroom').length}
                      </div>
                      <div>
                        <strong>Bathrooms:</strong> {propertyData.rooms.filter(room => room.type === 'bathroom').length}
                      </div>
                      <div>
                        <strong>Total Rooms:</strong> {propertyData.rooms.length}
                      </div>
                      <div>
                        <strong>Total Room Area:</strong> {propertyData.rooms.reduce((total, room) => total + room.area, 0)} sq m
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No rooms added yet. Add rooms to specify bedroom, bathroom, and other room details.</p>
                )}
              </div>
              
              {/* Rules Management Section */}
              <h3>Rules</h3>
                    <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                      borderRadius: '4px', 
                marginBottom: '20px' 
                    }}>
                {/* Existing rules with toggle */}
                {propertyData.rules.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Rules</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                      gap: '10px' 
                    }}>
                      {propertyData.rules.map((rule, index) => (
                        <div key={index} style={{ 
                          padding: '10px 15px', 
                          border: '1px solid #eee', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div 
                              style={{ 
                                width: '18px', 
                                height: '18px', 
                                borderRadius: '50%', 
                                backgroundColor: rule.allowed ? '#4CAF50' : '#F44336',
                                marginRight: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '10px'
                              }}
                            >
                              {rule.allowed ? '✓' : '✕'}
                            </div>
                            <div>{rule.name}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button 
                              onClick={() => handleRuleToggle(index)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: '#2196F3',
                                fontSize: '16px',
                                padding: '4px'
                              }}
                              title={rule.allowed ? "Mark as not allowed" : "Mark as allowed"}
                            >
                              {rule.allowed ? <FaBan /> : <FaCheck />}
                            </button>
                            <button 
                              onClick={() => removeRule(index)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: 'red',
                                fontSize: '16px',
                                padding: '4px'
                              }}
                              title="Remove rule"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                        </div>
                ) : (
                  <p>No rules added yet.</p>
                )}
                
                {/* Add new rule */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Rule</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Rule Name</Label>
                  <Input 
                    type="text" 
                        placeholder="e.g., No pets"
                        value={ruleInput} 
                        onChange={(e) => setRuleInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addRule}
                      style={{ height: '38px' }}
                    >
                      Add Rule
                  </Button>
                  </div>
                </div>
                </div>
                
              {/* Nearby Places Management Section */}
              <h3>Nearby Places</h3>
                    <div style={{ 
                padding: '15px',
                      border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add nearby amenities with their distance/time. These will be displayed in the property listing to help potential renters understand the neighborhood.
                </p>
                
                {/* Existing nearby places */}
                {propertyData.nearbyPlaces.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Places Nearby</h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '10px' 
                    }}>
                      {propertyData.nearbyPlaces.map((place, index) => (
                        <div key={index} style={{ 
                          padding: '12px 15px', 
                          border: '1px solid #eee', 
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#f9f9f9'
                        }}>
                          <div>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{place.name}</div>
                            <div style={{ fontSize: '14px', color: '#666' }}>{place.timeDistance}</div>
                          </div>
                          <button 
                            onClick={() => removeNearbyPlace(index)}
                            style={{
                              background: 'none', 
                              border: 'none',
                              cursor: 'pointer',
                              color: 'red',
                              fontSize: '16px'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No nearby places added yet. Common examples include Workplaces, Schools, Grocery stores, Supermarkets, Medical transport, etc.
                  </p>
                )}
                
                {/* Add new nearby place */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Nearby Place</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Place Name</Label>
                  <Input 
                    type="text" 
                        placeholder="e.g., Supermarkets, Schools, Workplaces"
                        value={placeNameInput} 
                        onChange={(e) => setPlaceNameInput(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Distance (time)</Label>
                      <Input 
                        type="text" 
                        placeholder="e.g., 10 minutes"
                        value={placeDistanceInput} 
                        onChange={(e) => setPlaceDistanceInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addNearbyPlace}
                      style={{ height: '38px' }}
                      disabled={!placeNameInput.trim() || !placeDistanceInput.trim()}
                    >
                      Add Place
                  </Button>
                  </div>
                </div>
                
                {/* Quick add buttons for common places */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Quick Add Common Places:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_NEARBY_PLACES.map((place, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPropertyData(prev => ({
                            ...prev,
                            nearbyPlaces: [...prev.nearbyPlaces, place]
                          }));
                        }}
                        style={{ 
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaPlus size={10} /> {place.name} ({place.timeDistance})
                      </button>
                    ))}
                  </div>
                  </div>
                </div>
                
              {/* Amenities Management Section */}
              <h3>Amenities</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add amenities that are included with the property, such as furniture, appliances, etc.
                </p>
                
                {/* Existing amenities */}
                {propertyData.amenities.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Amenities</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.amenities.map((amenity, index) => (
                        <div key={index} style={{ 
                          padding: '8px 12px',
                          background: '#f0f8ff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <span>{amenity}</span>
                          <button 
                            onClick={() => removeAmenity(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'red',
                              cursor: 'pointer',
                              padding: '0',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No amenities added yet. Common examples include furnishings, appliances, etc.
                  </p>
                )}
                
                {/* Add new amenity */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add an Amenity</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Amenity Name</Label>
                  <Input 
                    type="text" 
                        placeholder="e.g., sofa, dining table"
                        value={amenityInput} 
                        onChange={(e) => setAmenityInput(e.target.value)}
                      />
                    </FormGroup>
                    <Button 
                      onClick={addAmenity}
                      style={{ height: '38px' }}
                      disabled={!amenityInput.trim()}
                    >
                      Add Amenity
                  </Button>
                  </div>
                </div>
                
                {/* Quick add common amenities */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Common Amenities:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_AMENITIES.map((amenity, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: isItemSelected('amenities', amenity) ? '#e6f7ff' : '#f0f0f0',
                          border: `1px solid ${isItemSelected('amenities', amenity) ? '#91d5ff' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <input 
                            type="checkbox"
                            checked={isItemSelected('amenities', amenity)}
                            onChange={(e) => handleCheckboxChange('amenities', amenity, e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
                
              {/* Features Management Section */}
              <h3>Features</h3>
              <div style={{ 
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '20px'
              }}>
                <p style={{ marginBottom: '15px', color: '#666' }}>
                  Add features available at the property, such as utilities, facilities, etc.
                </p>
                
                {/* Existing features */}
                {propertyData.features.length > 0 ? (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ marginTop: 0 }}>Property Features</h4>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {propertyData.features.map((feature, index) => (
                        <div key={index} style={{ 
                          padding: '8px 12px',
                          background: '#f0fff0',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <span>{feature}</span>
                          <button 
                            onClick={() => removeFeature(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'red',
                              cursor: 'pointer',
                              padding: '0',
                              fontSize: '14px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '15px' }}>
                    No features added yet. Common examples include utilities, facilities, etc.
                  </p>
                )}
                
                {/* Add new feature */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Add a Feature</h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <Label>Feature Name</Label>
                      <Input 
                        type="text" 
                        placeholder="e.g., wifi, water, electricity"
                        value={featureInput} 
                        onChange={(e) => setFeatureInput(e.target.value)}
                      />
              </FormGroup>
                    <Button 
                      onClick={addFeature}
                      style={{ height: '38px' }}
                      disabled={!featureInput.trim()}
                    >
                      Add Feature
                    </Button>
                  </div>
                </div>
                
                {/* Quick add common features */}
                <div style={{ marginTop: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Common Features:</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {COMMON_FEATURES.map((feature, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          padding: '6px 12px',
                          background: isItemSelected('features', feature) ? '#e6ffe6' : '#f0f0f0',
                          border: `1px solid ${isItemSelected('features', feature) ? '#b7eb8f' : '#ddd'}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <input 
                            type="checkbox"
                            checked={isItemSelected('features', feature)}
                            onChange={(e) => handleCheckboxChange('features', feature, e.target.checked)}
                            style={{ marginRight: '8px' }}
                          />
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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