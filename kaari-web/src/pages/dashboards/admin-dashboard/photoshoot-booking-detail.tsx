import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaUpload, FaCheck, FaPlus, FaTimes, FaTrash, FaBan, FaExclamationCircle, FaSync, FaExclamationTriangle } from 'react-icons/fa';
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
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

interface PhotoshootBookingDetailProps {
  onUpdateBooking: () => void;
}

interface PropertyFormData {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'room';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    streetNumber: string;
    floor: string;
    flat: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: {
    monthly: number;
  deposit: number;
  serviceFee: number;
  };
  minstay: string;
  availableFrom: string;
  images: string[];
  amenities: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    size: number;
  };
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
  nearbyPlaces: Array<{
    name: string;
    timeDistance: string;
  }>;
  rules: Array<{
    name: string;
    allowed: boolean;
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
  
  // Move property form state to modal only
  const [propertyData, setPropertyData] = useState<PropertyFormData>({
    id: '',
    ownerId: '',
    title: '',
    description: '',
    propertyType: 'apartment',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      streetNumber: '',
      floor: '',
      flat: ''
    },
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    price: {
      monthly: 0,
    deposit: 0,
      serviceFee: 0
    },
    minstay: '',
    availableFrom: '',
    images: [],
    amenities: [],
    features: {
      bedrooms: 0,
      bathrooms: 0,
      size: 0
    },
    status: 'available',
    location: null,
    rooms: [],
    isFurnished: false,
    capacity: 2,
    nearbyPlaces: [],
    rules: []
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
        deposit: propertyData.price.deposit,
        serviceFee: propertyData.price.serviceFee,
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
          streetNumber: bookingData.propertyAddress?.streetNumber || '',
          floor: bookingData.propertyAddress?.floor || '',
          flat: bookingData.propertyAddress?.flat || ''
        },
        propertyType: bookingData.propertyType === 'house' ? 'house' : 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        price: {
          monthly: 0,
        deposit: 0,
          serviceFee: 0
        },
        minstay: '',
        availableFrom: new Date().toISOString().split('T')[0],
        images: bookingData.images || [],
        amenities: [],
        features: {
          bedrooms: 0,
          bathrooms: 0,
          size: 0
        },
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
  
  // Handle file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      try {
        setUploading(true);
        const tempPropertyId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const basePath = `public/properties/${tempPropertyId}/images`;
        
        const uploadedUrls = await secureUploadMultipleFiles(
          newFiles,
          basePath,
          'property_'
        );
        
        setPropertyData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));
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
      // Use a public folder path to avoid unauthorized path error
      const basePath = `public/properties/${tempPropertyId}/images`;
      
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
  const handleCheckboxChange = (category: 'amenities', item: string, checked: boolean) => {
    setPropertyData(prev => {
      if (category === 'amenities') {
      const currentItems = [...prev[category]];
      
      if (checked && !currentItems.includes(item)) {
        return {
          ...prev,
          [category]: [...currentItems, item]
        };
      } else if (!checked && currentItems.includes(item)) {
        return {
          ...prev,
          [category]: currentItems.filter(i => i !== item)
        };
      }
      }
      return prev;
    });
  };
  
  const isItemSelected = (category: 'amenities', item: string): boolean => {
    if (category === 'amenities') {
    return propertyData[category].includes(item);
    }
    return false;
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
        features: {
          ...prev.features,
          // Add a new numeric feature if needed
          // For now, we'll just keep the existing structure
          bedrooms: prev.features.bedrooms,
          bathrooms: prev.features.bathrooms,
          size: prev.features.size
        }
      }));
      setFeatureInput('');
    }
  };
  
  const removeFeature = () => {
    // Since features is an object with fixed properties, we don't need this function
    console.warn('removeFeature is not applicable to the current data structure');
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
  
  // Pre-fill property data from booking if available
  if (booking?.propertyAddress) {
    const propertyAddress = booking.propertyAddress;
    setPropertyData(prev => ({
      ...prev,
      address: {
        street: propertyAddress?.street || '',
        city: propertyAddress?.city || '',
        state: propertyAddress?.state || '',
        zipCode: propertyAddress?.zipCode || '',
        country: propertyAddress?.country || '',
        streetNumber: propertyAddress?.streetNumber || '',
        floor: propertyAddress?.floor || '',
        flat: propertyAddress?.flat || ''
      }
    }));
  }
  
    return (
      <div>
        <DashboardCard>
        <CardHeader>
          <BackButton onClick={handleBackClick}>
            <FaArrowLeft /> Back to Bookings
          </BackButton>
          <h2>Photoshoot Booking Details</h2>
        </CardHeader>
        
        <StyledCardContent>
          {loading ? (
            <div className="loading">Loading booking details...</div>
          ) : loadError ? (
            <div className="error-state">
              <FaExclamationCircle />
              <h3>Error Loading Booking</h3>
              <p>{loadError}</p>
                          <button 
                            onClick={() => {
                  if (bookingId) {
                    loadData(bookingId);
                  }
                }} 
                className="retry-button"
              >
                <FaSync /> Retry
                                </button>
                        </div>
          ) : !booking ? (
            <div className="empty-state">
              <FaExclamationTriangle />
              <h3>Booking Not Found</h3>
              <p>The requested booking could not be found.</p>
                  </div>
                ) : (
            <>
              <div className="booking-info">
              <h3>Booking Information</h3>
              <p><strong>Date:</strong> {booking.date ? formatDate(booking.date) : 'N/A'}</p>
              <p><strong>Time Slot:</strong> {booking.timeSlot || 'N/A'}</p>
              <p><strong>Created:</strong> {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</p>
              <p><strong>Last Updated:</strong> {booking.updatedAt ? formatDate(booking.updatedAt) : 'N/A'}</p>
              {booking.completedAt && <p><strong>Completed:</strong> {formatDate(booking.completedAt)}</p>}
              {booking.comments && <p><strong>Comments:</strong> {booking.comments}</p>}
              {booking.propertyId && <p><strong>Property ID:</strong> {booking.propertyId}</p>}
          </div>
          
          {booking.teamId && (
                <div className="team-info">
              <h3>Assigned Team</h3>
              <p><strong>Team ID:</strong> {booking.teamId}</p>
              <p><strong>Team Members:</strong> {booking.teamMembers?.join(', ') || 'No members'}</p>
            </div>
          )}
          
          {booking.images && booking.images.length > 0 && (
                <div className="images-preview">
              <h3>Property Images</h3>
                  <div className="image-grid">
                {booking.images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img src={image} alt={`Property ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
              <div className="action-buttons">
            {booking.status === 'pending' && (
              <Button onClick={() => {
                setShowAssignModal(true);
                if (teams.length === 0) {
                  checkTeamsInFirebase();
                }
              }}>
                    <FaUsers /> Assign Team
              </Button>
            )}
            
            {booking.status === 'assigned' && (
                  <Button onClick={() => {
                    // Pre-fill property data from booking if available
                    if (booking.propertyAddress) {
                      const propertyAddress = booking.propertyAddress || {};
                      setPropertyData(prev => ({
                        ...prev,
                        address: {
                          street: propertyAddress.street || '',
                          city: propertyAddress.city || '',
                          state: propertyAddress.state || '',
                          zipCode: propertyAddress.zipCode || '',
                          country: propertyAddress.country || '',
                          streetNumber: propertyAddress.streetNumber || '',
                          floor: propertyAddress.floor || '',
                          flat: propertyAddress.flat || ''
                        }
                      }));
                    }
                    setShowCompleteModal(true);
                  }}>
                    <FaCheck /> Complete Booking
              </Button>
            )}
            
            {(booking.status === 'pending' || booking.status === 'assigned') && (
                  <Button onClick={handleCancelBooking} className="cancel-button">
                Cancel Booking
              </Button>
            )}
          </div>
            </>
          )}
        </StyledCardContent>
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
                <div className="no-teams-message">
                  <p>No teams available.</p>
                  <p>Please make sure teams are created in the system before assigning.</p>
                  <div className="action-buttons">
                    <Button onClick={() => navigate('/dashboard/admin/teams')}>
                      Go to Teams Management
                    </Button>
                    <Button 
                      onClick={() => {
                        if (bookingId) {
                          loadData(bookingId);
                        }
                      }}
                    >
                      Reload Teams
                    </Button>
                    <Button onClick={checkTeamsInFirebase}>
                      Check Teams
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
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Complete Booking & Create Property</ModalTitle>
              <CloseButton onClick={() => setShowCompleteModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <div className="property-form">
              <h3>Property Details</h3>
                <FormGroup>
                <Label>Title*</Label>
                  <Input 
                    type="text" 
                    value={propertyData.title} 
                  onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                  placeholder="Enter property title"
                  />
                </FormGroup>
                
                <FormGroup>
                <Label>Description*</Label>
                <Input
                  as="textarea"
                  value={propertyData.description}
                  onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                  placeholder="Enter property description"
                  style={{ minHeight: '100px' }}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Property Type</Label>
                  <Select 
                    value={propertyData.propertyType} 
                  onChange={(e) => setPropertyData({ ...propertyData, propertyType: e.target.value as PropertyFormData['propertyType'] })}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="room">Room</option>
                  </Select>
                </FormGroup>
              
              <FormGroup>
                <Label>Address*</Label>
                  <Input 
                    type="text" 
                    value={propertyData.address.street} 
                  onChange={(e) => setPropertyData({
                    ...propertyData,
                    address: { ...propertyData.address, street: e.target.value }
                  })}
                  placeholder="Street"
                />
                <div className="address-grid">
                  <Input 
                    type="text" 
                    value={propertyData.address.city} 
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      address: { ...propertyData.address, city: e.target.value }
                    })}
                    placeholder="City"
                  />
                  <Input 
                    type="text" 
                    value={propertyData.address.state} 
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      address: { ...propertyData.address, state: e.target.value }
                    })}
                    placeholder="State"
                  />
                  <Input 
                    type="text" 
                    value={propertyData.address.zipCode} 
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      address: { ...propertyData.address, zipCode: e.target.value }
                    })}
                    placeholder="ZIP Code"
                  />
                </div>
                </FormGroup>
                
                <FormGroup>
                <Label>Images*</Label>
                  <Input 
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                />
                <p className="helper-text">Upload property images (max 10 images)</p>
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

// Add new styled components for better states and layout
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${Theme.colors.gray}20;
  
  h2 {
    font: ${Theme.typography.fonts.h3};
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${Theme.borders.radius.sm};
  background-color: transparent;
  color: ${Theme.colors.secondary};
  cursor: pointer;
  font: ${Theme.typography.fonts.mediumB};
  
  &:hover {
    background-color: ${Theme.colors.gray}10;
  }
`;

// Extend the imported CardContent with additional styles
const StyledCardContent = styled(CardContent)`
  padding: 1rem 0;
  
  .booking-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      margin-bottom: 1rem;
    }
    
    p {
      font: ${Theme.typography.fonts.mediumM};
      margin-bottom: 0.5rem;
      
      strong {
        font: ${Theme.typography.fonts.mediumB};
        margin-right: 0.5rem;
      }
    }
  }
  
  .team-info {
    margin-bottom: 2rem;
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      margin-bottom: 1rem;
    }
  }
  
  .images-preview {
    margin-bottom: 2rem;
    
    h3 {
      font: ${Theme.typography.fonts.h3};
      margin-bottom: 1rem;
    }
    
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      
      .image-item {
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: ${Theme.borders.radius.sm};
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    
    .cancel-button {
      background-color: ${Theme.colors.error};
      
      &:hover {
        background-color: ${Theme.colors.error}dd;
      }
    }
  }
`;

export default PhotoshootBookingDetail; 