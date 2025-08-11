import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaUpload, FaCheck, FaPlus, FaTimes, FaTrash, FaBan, FaExclamationCircle, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { PageContainer, PageHeader, GlassCard, GlassInput, GlassSelect, GlassTextArea, PrimaryButton, SecondaryButton, DangerButton, ButtonGroup } from '../../../components/admin/AdminUI';
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
import NotificationService from '../../../services/NotificationService';
import { createPhotoshootTeamAssignedNotification } from '../../../utils/notification-helpers';

interface PhotoshootBookingDetailProps {
  onUpdateBooking: () => void;
}

interface PropertyFormData {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  propertyType: 'apartment' | 'house' | 'studio' | 'room' | 'villa' | 'penthouse' | 'townhouse';
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
  price: number;
  deposit: number;
  serviceFee: number;
  minstay: string;
  availableFrom: string;
  images: string[];
  videos: string[];
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
  nearbyPlaces: Array<{
    name: string;
    timeDistance: string;
  }>;
  rules: Array<{
    name: string;
    allowed: boolean;
  }>;
  
  // Housing preferences
  housingPreference?: string; // 'womenOnly' | 'familiesOnly' | ''
  
  // Dedicated fields for allowed rules
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  

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
  'water-heater',
  'heating',
  'parking',
  'security',
  'gym',
];

const COMMON_FEATURES = [
  'water',
  'gas',
  'electricity',
  'wifi',
  'balcony',
  'central-heating',
  'parking-space',
  'air-conditioning',
  'wooden-floors',
  'elevator',
  'swimming-pool',
  'fireplace',
  'accessible'
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

// Add these styled components at the top of the file after the imports
const PropertyFormContainer = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  padding: 1rem;

  h3 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.primary};
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${Theme.colors.secondary}20;
  }

  .section-title {
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.secondary};
    margin: 1.5rem 0 1rem;
  }
  
  .subsection-title {
    font: ${Theme.typography.fonts.smallB};
    color: ${Theme.colors.primary};
    margin: 0.5rem 0 0.75rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 1.5rem;

  label {
    display: block;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.primary};
    margin-bottom: 0.5rem;
  }

  input, select, textarea {
    ${'' /* Use glass inputs globally inside this form */}
    border-radius: 14px;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .helper-text {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray};
    margin-top: 0.25rem;
  }
`;

const ListContainer = styled.div`
  margin-top: 1rem;
  
  .list-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: ${Theme.colors.gray}20;
    border-radius: ${Theme.borders.radius.sm};
    gap: 1rem;
    
    .item-content {
      flex: 1;
      font: ${Theme.typography.fonts.mediumM};
    }
    
    .item-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    span {
      flex: 1;
      font: ${Theme.typography.fonts.mediumM};
    }
    
    button {
      padding: 0.5rem;
      margin-left: 0.5rem;
      color: ${Theme.colors.error};
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      &:hover { color: ${Theme.colors.error}dd; background: ${Theme.colors.error}10; }
    }
  }
  
  .rule-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background: ${Theme.colors.gray}20;
    border-radius: ${Theme.borders.radius.sm};
    gap: 1rem;
    
    .rule-name {
      flex: 1;
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.primary};
    }
    
    .rule-controls {
      display: flex;
      align-items: center;
      gap: 2rem; // Increased from 1rem to 2rem for better spacing
    }
    
    .rule-status {
      font: ${Theme.typography.fonts.smallM};
      color: ${Theme.colors.gray};
      min-width: 80px;
      text-align: center;
    }
    
    .delete-button {
      padding: 0.5rem;
      color: ${Theme.colors.error};
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: ${Theme.borders.radius.sm};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      
      &:hover {
        color: ${Theme.colors.error}dd;
        background: ${Theme.colors.error}10;
      }
    }
  }
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  .image-preview {
    position: relative;
    aspect-ratio: 1;
    border-radius: ${Theme.borders.radius.sm};
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: ${Theme.colors.error}dd;
      color: white;
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      
      &:hover {
        background: ${Theme.colors.error};
      }
    }
    
    &:hover button {
      opacity: 1;
    }
  }
`;

const VideoPreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  .video-preview {
    position: relative;
    border-radius: ${Theme.borders.radius.sm};
    overflow: hidden;
    
    video {
      width: 100%;
      border-radius: ${Theme.borders.radius.sm};
    }
    
    button {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: ${Theme.colors.error}dd;
      color: white;
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      
      &:hover {
        background: ${Theme.colors.error};
      }
    }
    
    &:hover button {
      opacity: 1;
    }
  }
`;

const ToggleSwitch = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin: 0 1rem; // Add horizontal margin for better spacing
  
  input {
    display: none;
  }
  
  .slider {
    position: relative;
    width: 3.5rem;
    height: 1.75rem;
    background: ${Theme.colors.gray}60;
    border-radius: 1rem;
    margin-right: 0.5rem;
    transition: all 0.3s ease;
    border: 2px solid ${Theme.colors.gray}40;
    
    &:before {
      content: '';
      position: absolute;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: white;
      top: 0.125rem;
      left: 0.125rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
  
  input:checked + .slider {
    background: ${Theme.colors.secondary};
    border-color: ${Theme.colors.secondary};
    
    &:before {
      transform: translateX(1.75rem);
    }
  }
  
  &:hover .slider {
    box-shadow: 0 0 0 3px ${Theme.colors.secondary}20;
  }
`;

const AddButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${Theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${Theme.borders.radius.sm};
  font: ${Theme.typography.fonts.mediumB};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${Theme.colors.secondary}dd;
  }
  
  &:disabled {
    background: ${Theme.colors.gray}40;
    cursor: not-allowed;
  }
`;

// Add new styled components
const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font: ${Theme.typography.fonts.mediumM};
  cursor: pointer;

  input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }
`;

const CustomInputSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${Theme.colors.gray}20;

  .input-row {
    display: flex;
    gap: 1rem;
    align-items: center;

    input {
      flex: 1;
    }
  }
`;

// Add new styled components for the room adder
const RoomAdderSection = styled.div`
  .room-form {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1rem;
  }

  .rooms-list {
    display: grid;
    gap: 0.5rem;
  }

  .room-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background: ${Theme.colors.gray}20;
    border-radius: ${Theme.borders.radius.sm};
    
    .room-info {
      flex: 1;
      display: flex;
      gap: 1rem;
      align-items: center;
      
      .room-type {
        font-weight: 600;
        color: ${Theme.colors.secondary};
      }
      
      .room-size {
        color: ${Theme.colors.primary}80;
      }
    }
    
    .delete-button {
      padding: 0.5rem;
      color: ${Theme.colors.error};
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        color: ${Theme.colors.error}dd;
      }
    }
  }
`;

// Add missing styled components
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid ${Theme.colors.gray}20;
  
  h2 {
    font: ${Theme.typography.fonts.h2};
    color: ${Theme.colors.primary};
    margin: 0;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${Theme.colors.gray}20;
  color: ${Theme.colors.primary};
  border: 1px solid ${Theme.colors.gray}40;
  border-radius: ${Theme.borders.radius.sm};
  font: ${Theme.typography.fonts.mediumM};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${Theme.colors.gray}30;
    border-color: ${Theme.colors.gray}60;
  }
`;

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
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamDebugInfo, setTeamDebugInfo] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  
  // Add missing state variables
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  
  // Property form state
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
    price: 0,
    deposit: 0,
    serviceFee: 0,
    minstay: '',
    availableFrom: '',
    images: [],
    videos: [],
    amenities: [],
    features: [], // Start with empty features array instead of COMMON_FEATURES
    status: 'available',
    location: null,
    rooms: [],
    isFurnished: false,
    capacity: 2,
    nearbyPlaces: [],
    rules: [],
    
    // Initialize new fields
    housingPreference: '',
    petsAllowed: false,
    smokingAllowed: false,

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
    console.log('=== Starting createPropertyAndLinkToAdvertiser ===');
    console.log('Advertiser ID:', advertiserId);
    console.log('Property data:', JSON.stringify(propertyData, null, 2));

    try {
      // Create a new property document in the properties collection
      const propertiesCollectionRef = collection(db, 'properties');
      console.log('Properties collection reference created');

      const propertyDocRef = doc(propertiesCollectionRef);
      console.log('New property document reference created:', propertyDocRef.id);
      
      // Prepare the property data with timestamps
      const propertyWithTimestamps = {
        ...propertyData,
        id: propertyDocRef.id,
        ownerId: advertiserId,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      // Ensure dedicated fields are also in the features array for backward compatibility
      let processedFeatures = [...(propertyData.features || [])];
      
      // Add included services to features array for backward compatibility
      if (!processedFeatures.includes('water')) {
        processedFeatures.push('water');
      }
      if (!processedFeatures.includes('electricity')) {
        processedFeatures.push('electricity');
      }
      if (!processedFeatures.includes('wifi')) {
        processedFeatures.push('wifi');
      }
      if (!processedFeatures.includes('gas')) {
        processedFeatures.push('gas');
      }
      
      // Add property features to features array
      if (!processedFeatures.includes('balcony')) {
        processedFeatures.push('balcony');
      }
      if (!processedFeatures.includes('central-heating')) {
        processedFeatures.push('central-heating');
      }
      if (!processedFeatures.includes('parking-space')) {
        processedFeatures.push('parking-space');
      }
      if (!processedFeatures.includes('air-conditioning')) {
        processedFeatures.push('air-conditioning');
      }
      if (!processedFeatures.includes('wooden-floors')) {
        processedFeatures.push('wooden-floors');
      }
      if (!processedFeatures.includes('elevator')) {
        processedFeatures.push('elevator');
      }
      if (!processedFeatures.includes('swimming-pool')) {
        processedFeatures.push('swimming-pool');
      }
      if (!processedFeatures.includes('fireplace')) {
        processedFeatures.push('fireplace');
      }
      if (!processedFeatures.includes('accessible')) {
        processedFeatures.push('accessible');
      }
      
      // Update the features array with the processed features
      propertyWithTimestamps.features = processedFeatures;
      
      // Ensure pets/smoking allowed are in rules for backward compatibility
      let processedRules = [...(propertyData.rules || [])];
      
      // Check if we have a 'Pets' rule, add/update it based on petsAllowed field
      let petsRule = processedRules.find(r => r.name.toLowerCase().includes('pet'));
      if (petsRule) {
        petsRule.allowed = propertyData.petsAllowed || false;
      } else if (propertyData.petsAllowed) {
        processedRules.push({ name: 'Pets', allowed: true });
      }
      
      // Check if we have a 'Smoking' rule, add/update it based on smokingAllowed field
      let smokingRule = processedRules.find(r => r.name.toLowerCase().includes('smok'));
      if (smokingRule) {
        smokingRule.allowed = propertyData.smokingAllowed || false;
      } else if (propertyData.smokingAllowed) {
        processedRules.push({ name: 'Smoking', allowed: true });
      }
      
      // Update the rules array with the processed rules
      propertyWithTimestamps.rules = processedRules;
      
      console.log('Property data with timestamps:', JSON.stringify(propertyWithTimestamps, null, 2));
      
      console.log('Attempting to set document in Firestore...');
      await setDoc(propertyDocRef, propertyWithTimestamps);
      console.log('Document successfully set in Firestore');
      
      // Update the advertiser's properties array
      console.log('Updating advertiser properties...');
      await updateAdvertiserProperties(advertiserId, propertyDocRef.id);
      console.log('Advertiser properties updated successfully');
      
      return propertyDocRef.id;
    } catch (error) {
      console.error('Error in createPropertyAndLinkToAdvertiser:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
      throw new Error(`Failed to create property: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  // Function to update the advertiser's properties array
  const updateAdvertiserProperties = async (advertiserId: string, propertyId: string): Promise<void> => {
    console.log('=== Starting updateAdvertiserProperties ===');
    console.log('Advertiser ID:', advertiserId);
    console.log('Property ID:', propertyId);

    try {
      // Get the advertiser document
      const advertiserDocRef = doc(db, 'users', advertiserId);
      console.log('Getting advertiser document...');
      const advertiserDoc = await getDoc(advertiserDocRef);
      
      if (!advertiserDoc.exists()) {
        console.error('Advertiser document not found');
        throw new Error(`Advertiser with ID ${advertiserId} not found`);
      }
      
      console.log('Advertiser document found:', advertiserDoc.data());
      
      // Add the property ID to the advertiser's properties array
      console.log('Updating advertiser document...');
      await updateDoc(advertiserDocRef, {
        properties: arrayUnion(propertyId),
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      console.log('Advertiser document updated successfully');
    } catch (error) {
      console.error('Error in updateAdvertiserProperties:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
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
        price: 0,
        deposit: 0,
        serviceFee: 0,
        minstay: '',
        availableFrom: new Date().toISOString().split('T')[0],
        images: bookingData.images || [],
        videos: (bookingData as any).videos || [],
        amenities: [],
        features: [], // Start with empty features array instead of COMMON_FEATURES
        status: 'available',
        location: bookingData.location || null,
        rooms: [],
        isFurnished: false,
        capacity: 2,
        rules: [...COMMON_RULES],
        nearbyPlaces: [...COMMON_NEARBY_PLACES],
        
        // Initialize new fields
        housingPreference: '',
        petsAllowed: false,
        smokingAllowed: false,

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
      
      // Assign team to booking - this will also handle sending the notification
      await PhotoshootBookingServerActions.assignTeamToBooking(bookingId, selectedTeam, team.members);
      
      // Refresh booking data
      loadData(bookingId);
      onUpdateBooking();
      
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error assigning team:', error);
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
        features: [...prev.features, featureInput.trim()]
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
  
  // Add missing file handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      console.log(`Selected ${files.length} image files:`, files);
      
      // Store the actual files for upload
      setImageFiles(prev => [...prev, ...files]);
      
      // Create preview URLs and add to property data
      const newImageUrls = files.map(file => {
        const url = URL.createObjectURL(file);
        console.log(`Created blob URL for ${file.name}:`, url);
        return url;
      });
      
      setPropertyData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
      
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  // Add video file handler
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentVideoCount = videoFiles.length + propertyData.videos.length;
      const availableSlots = Math.max(0, 2 - currentVideoCount);
      const filesToAdd = files.slice(0, availableSlots);
      
      if (filesToAdd.length < files.length) {
        alert(`You can only upload a maximum of 2 videos. ${files.length - filesToAdd.length} video(s) were not added.`);
      }
      
      setVideoFiles(prev => [...prev, ...filesToAdd]);
      
      // Create preview URLs
      const newVideoUrls = filesToAdd.map(file => URL.createObjectURL(file));
      setPropertyData(prev => ({
        ...prev,
        videos: [...prev.videos, ...newVideoUrls]
      }));
    }
  };
  
  const handleCompleteBooking = async () => {
    console.clear();
    console.log('=== STARTING PROPERTY CREATION ===');
    setStatusMessage('Starting property creation process...');
    
    if (!booking || !bookingId) {
      alert('No booking data available');
      setStatusMessage('Error: No booking data available');
      return;
    }
    
    // Get owner ID from booking
    const ownerId = booking.advertiserId || booking.userId;
    if (!ownerId) {
      alert('No owner ID found in booking');
      setStatusMessage('Error: No owner ID found in booking');
      return;
    }
    
    try {
      setLoading(true);
    
      // Create a Set to ensure uniqueness of images
      const imageSet = new Set<string>();
      // Track blob URLs separately
      const blobUrls = new Set<string>();
      
      // Add images from all sources to the Set
      // Only valid URLs will be added (filter out blob: URLs and other temporary preview URLs)
      const addValidImages = (imgArray: string[] | undefined) => {
        if (!imgArray) return;
        imgArray.forEach(img => {
          if (img && img.startsWith('blob:')) {
            // Track blob URLs separately
            blobUrls.add(img);
          } else if (img && img.startsWith('http')) {
            imageSet.add(img);
          }
        });
      };
      
      // Add images from all sources
      addValidImages(booking.images);
      addValidImages(propertyData.images);
      addValidImages(images);
      
      // Convert Set back to array
      const allImages = Array.from(imageSet);
      
      console.log(`Total unique images collected: ${allImages.length}`);
      console.log('Images:', allImages);
      console.log(`Total blob URLs (to be uploaded): ${blobUrls.size}`);
      setStatusMessage(`Found ${allImages.length} existing images and ${imageFiles.length} new images to upload`);
      
      // Create a Set for videos to ensure uniqueness
      const videoSet = new Set<string>();
      // Track blob URLs for videos separately
      const videoBlobUrls = new Set<string>();
      
      // Add videos from all sources
      const addValidVideos = (vidArray: string[] | undefined) => {
        if (!vidArray) return;
        vidArray.forEach(vid => {
          if (vid && vid.startsWith('blob:')) {
            // Track blob URLs separately
            videoBlobUrls.add(vid);
          } else if (vid && vid.startsWith('http')) {
            videoSet.add(vid);
          }
        });
      };
      
      addValidVideos((booking as any).videos);
      addValidVideos(propertyData.videos);
      
      // Convert Set back to array
      const allVideos = Array.from(videoSet);
      
      console.log(`Total unique videos collected: ${allVideos.length}`);
      console.log('Videos:', allVideos);
      console.log(`Total video blob URLs (to be uploaded): ${videoBlobUrls.size}`);
      
      // Check if we have any images (either already uploaded or files to upload)
      if (allImages.length === 0 && imageFiles.length === 0) {
        alert('Please add at least one image to the property');
        setStatusMessage('Error: No images available');
        setLoading(false);
        return;
      }
      
      // Upload any pending image files if needed
      if (imageFiles.length > 0) {
        console.log(`Uploading ${imageFiles.length} image files...`);
        setStatusMessage(`Uploading ${imageFiles.length} image files...`);
        try {
          const tempPropertyId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const basePath = `public/properties/${tempPropertyId}/images`;
          
          const uploadedUrls = await secureUploadMultipleFiles(
            imageFiles,
            basePath,
            'property_'
          );
          
          console.log(`Successfully uploaded ${uploadedUrls.length} files:`, uploadedUrls);
          setStatusMessage(`Successfully uploaded ${uploadedUrls.length} image files`);
          
          // Add the newly uploaded images to our collection
          allImages.push(...uploadedUrls);
          
          // Clear the image files
          setImageFiles([]);
        } catch (uploadError) {
          console.error('Error uploading image files:', uploadError);
          setStatusMessage(`Error uploading images: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          alert(`Error uploading images: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          setLoading(false);
          return; // Stop the process if image upload fails
        }
      }
      
      // Upload any pending video files if needed
      if (videoFiles.length > 0) {
        console.log(`Uploading ${videoFiles.length} video files...`);
        try {
          const tempPropertyId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const basePath = `public/properties/${tempPropertyId}/videos`;
          
          const uploadedVideoUrls = await secureUploadMultipleFiles(
            videoFiles,
            basePath,
            'property_video_'
          );
          
          console.log(`Successfully uploaded ${uploadedVideoUrls.length} video files:`, uploadedVideoUrls);
          
          // Add the newly uploaded videos to our collection
          allVideos.push(...uploadedVideoUrls);
          
          // Clear the video files
          setVideoFiles([]);
        } catch (uploadError) {
          console.error('Error uploading video files:', uploadError);
          alert(`Error uploading videos: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          // Continue with existing videos
        }
      }
      
      // Final check if we have any images after uploads
      if (allImages.length === 0) {
        alert('Failed to upload images. Please try again.');
        setStatusMessage('Error: Failed to upload images');
        setLoading(false);
        return;
      }
      
      // Create the property in Firestore
      const propertiesRef = collection(db, 'properties');
      const newPropertyRef = doc(propertiesRef);
      const propertyId = newPropertyRef.id;
      
      // Create timestamp for Date objects
      const now = new Date();
      
      // Ensure location data is properly prepared
      const propertyLocation = propertyData.location || booking.location;
      
      // Format the availableFrom date as Date object
      let availableFromDate: Date;
      if (propertyData.availableFrom) {
        // Convert from string to Date
        availableFromDate = new Date(propertyData.availableFrom);
      } else {
        availableFromDate = new Date(); // Default to today
      }
      
      console.log('Available from date:', availableFromDate);
      
      // Process features array to include service inclusions and property features
      let processedFeatures = [...(propertyData.features || [])];
      
      // Add included services to features array for backward compatibility
      if (!processedFeatures.includes('water')) {
        processedFeatures.push('water');
      }
      if (!processedFeatures.includes('electricity')) {
        processedFeatures.push('electricity');
      }
      if (!processedFeatures.includes('wifi')) {
        processedFeatures.push('wifi');
      }
      if (!processedFeatures.includes('gas')) {
        processedFeatures.push('gas');
      }
      
      // Add property features to features array
      if (!processedFeatures.includes('balcony')) {
        processedFeatures.push('balcony');
      }
      if (!processedFeatures.includes('central-heating')) {
        processedFeatures.push('central-heating');
      }
      if (!processedFeatures.includes('parking-space')) {
        processedFeatures.push('parking-space');
      }
      if (!processedFeatures.includes('air-conditioning')) {
        processedFeatures.push('air-conditioning');
      }
      if (!processedFeatures.includes('wooden-floors')) {
        processedFeatures.push('wooden-floors');
      }
      if (!processedFeatures.includes('elevator')) {
        processedFeatures.push('elevator');
      }
      if (!processedFeatures.includes('swimming-pool')) {
        processedFeatures.push('swimming-pool');
      }
      if (!processedFeatures.includes('fireplace')) {
        processedFeatures.push('fireplace');
      }
      if (!processedFeatures.includes('accessible')) {
        processedFeatures.push('accessible');
      }
      
      // Process housing preference
      let housingPreferenceFormatted = '';
      if (propertyData.housingPreference) {
        // Ensure we're using camelCase without hyphens for filtering to match correctly
        if (propertyData.housingPreference === 'women-only' || propertyData.housingPreference.toLowerCase() === 'womenonly') {
          housingPreferenceFormatted = 'womenOnly';
        } else if (propertyData.housingPreference === 'families-only' || propertyData.housingPreference.toLowerCase() === 'familiesonly') {
          housingPreferenceFormatted = 'familiesOnly';
        } else {
          housingPreferenceFormatted = propertyData.housingPreference;
        }
      }
      
      // Ensure pets/smoking allowed are in rules for backward compatibility
      let processedRules = [...(propertyData.rules || [])];
      
      // Check if we have a 'Pets' rule, add/update it based on petsAllowed field
      let petsRule = processedRules.find(r => r.name.toLowerCase().includes('pet'));
      if (petsRule) {
        petsRule.allowed = propertyData.petsAllowed || false;
      } else if (propertyData.petsAllowed) {
        processedRules.push({ name: 'Pets', allowed: true });
      }
      
      // Check if we have a 'Smoking' rule, add/update it based on smokingAllowed field
      let smokingRule = processedRules.find(r => r.name.toLowerCase().includes('smok'));
      if (smokingRule) {
        smokingRule.allowed = propertyData.smokingAllowed || false;
      } else if (propertyData.smokingAllowed) {
        processedRules.push({ name: 'Smoking', allowed: true });
      }
      
      // Create a typed property object without location first (to satisfy TypeScript)
      const propertyToSave: Omit<Property, 'location'> = {
        id: propertyId,
        ownerId: ownerId,
        title: propertyData.title || `Property in ${propertyData.address.city || ''}`,
        description: propertyData.description || '',
        address: {
          street: propertyData.address.street || '',
          city: propertyData.address.city || '',
          state: propertyData.address.state || '',
          zipCode: propertyData.address.zipCode || '',
          country: propertyData.address.country || 'Morocco',
        },
        propertyType: (propertyData.propertyType as 'apartment' | 'house' | 'condo' | 'land' | 'commercial') || 'apartment',
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        area: propertyData.area || 0,
        price: propertyData.price || 0,
        deposit: propertyData.deposit || 0,
        serviceFee: propertyData.serviceFee || 0,
        minstay: propertyData.minstay || '',
        availableFrom: availableFromDate,
        images: allImages,
        videos: allVideos,
        amenities: propertyData.amenities || [],
        features: processedFeatures,
        status: 'available',
        createdAt: now,
        updatedAt: now,
        rooms: propertyData.rooms || [],
        isFurnished: propertyData.isFurnished || false,
        capacity: propertyData.capacity || 2,
        rules: processedRules,
        nearbyPlaces: propertyData.nearbyPlaces || COMMON_NEARBY_PLACES,
        
        // Add all the new fields
        housingPreference: housingPreferenceFormatted,
        petsAllowed: propertyData.petsAllowed || false,
        smokingAllowed: propertyData.smokingAllowed || false,

      };
      
      // Then create the Firestore data object with location added
      const firestoreProperty = {
        ...propertyToSave,
        location: propertyLocation, // Add location here for Firestore
        createdAt: Timestamp.fromDate(propertyToSave.createdAt),
        updatedAt: Timestamp.fromDate(propertyToSave.updatedAt),
        availableFrom: propertyToSave.availableFrom ? Timestamp.fromDate(propertyToSave.availableFrom) : null
      };
      
      console.log('SAVING PROPERTY TO FIRESTORE WITH IMAGES:', propertyToSave.images);
      console.log('Final property data with location:', firestoreProperty);
      
      // Save to Firestore
      await setDoc(newPropertyRef, firestoreProperty);
      console.log(`Property created with ID: ${propertyId}`);
      console.log(`Property has ${propertyToSave.images.length} images`);
      
      // Link property to user
      try {
        const userRef = doc(db, 'users', ownerId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            properties: arrayUnion(propertyId),
            updatedAt: Timestamp.fromDate(now)
          });
          console.log(`Added property to user ${ownerId}'s properties list`);
        } else {
          console.warn(`User document ${ownerId} not found. Cannot update properties array.`);
        }
      } catch (error: any) {
        console.error('Error updating user properties:', error);
        // Continue anyway, as the property was created
      }
      
      // Complete the booking, passing the correct images
      await PhotoshootBookingServerActions.completeBooking(bookingId, propertyId, allImages);
      console.log(`Booking ${bookingId} marked as completed with ${allImages.length} images`);
      
      // Show success message with image count
      alert(`Property created with ${allImages.length} images and ${allVideos.length} videos. Booking completed successfully!`);
      
      // Update UI
      loadData(bookingId);
      onUpdateBooking();
      
      // Create notification for the property owner
      try {
        if (ownerId) {
          await NotificationService.createNotification(
            ownerId,
            'advertiser',
            'property_created',
            'Property Created Successfully',
            `Your property "${propertyToSave.title}" has been created with ${allImages.length} images and ${allVideos.length} videos.`,
            `/dashboard/advertiser/properties/${propertyId}`,
            { propertyId, imageCount: allImages.length, videoCount: allVideos.length }
          );
          console.log(`Additional frontend notification sent to advertiser ${ownerId} about property creation`);
        }
      } catch (notifError) {
        // Don't fail if notification fails
        console.error('Error sending property creation notification:', notifError);
      }
      
    } catch (error: any) {
      console.error('Error creating property:', error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async () => {
    if (!bookingId || !booking) return;
    
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // Reason could be added through a prompt or modal in a more sophisticated UI
        const reason = "Cancelled by administrator";
        
        // Cancel the booking - this will also send a notification through the server action
        await PhotoshootBookingServerActions.cancelBooking(bookingId, reason);
        
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
              <p><strong>Property Type:</strong> {booking.propertyType || 'N/A'}</p>
              <p><strong>Status:</strong> <StatusBadge status={booking.status}>{booking.status}</StatusBadge></p>
              
              {/* Address Information */}
              <div style={{ marginTop: '1rem' }}>
                <h4>Photoshoot Address</h4>
                {booking.propertyAddress ? (
                  <div>
                    <p><strong>Street:</strong> {booking.propertyAddress.street} {booking.propertyAddress.streetNumber}</p>
                    {booking.propertyAddress.floor && <p><strong>Floor:</strong> {booking.propertyAddress.floor}</p>}
                    {booking.propertyAddress.flat && <p><strong>Flat:</strong> {booking.propertyAddress.flat}</p>}
                    <p><strong>City:</strong> {booking.propertyAddress.city}</p>
                    <p><strong>State:</strong> {booking.propertyAddress.state}</p>
                    <p><strong>ZIP Code:</strong> {booking.propertyAddress.zipCode}</p>
                    <p><strong>Country:</strong> {booking.propertyAddress.country}</p>
                  </div>
                ) : (
                  <div>
                    <p><strong>Street:</strong> {getBookingStreet(booking) || 'N/A'}</p>
                    <p><strong>City:</strong> {getBookingCity(booking) || 'N/A'}</p>
                    {booking.stateRegion && <p><strong>State:</strong> {booking.stateRegion}</p>}
                    {booking.postalCode && <p><strong>ZIP Code:</strong> {booking.postalCode}</p>}
                    {booking.country && <p><strong>Country:</strong> {booking.country}</p>}
                    {booking.floor && <p><strong>Floor:</strong> {booking.floor}</p>}
                    {booking.flat && <p><strong>Flat:</strong> {booking.flat}</p>}
                  </div>
                )}
              </div>
              
              {/* Contact Information */}
              {booking.phoneNumber && (
                <div style={{ marginTop: '1rem' }}>
                  <h4>Contact Information</h4>
                  {booking.name && <p><strong>Name:</strong> {booking.name}</p>}
                  <p><strong>Phone Number:</strong> {booking.phoneNumber}</p>
                </div>
              )}
              
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Created:</strong> {booking.createdAt ? formatDate(booking.createdAt) : 'N/A'}</p>
                <p><strong>Last Updated:</strong> {booking.updatedAt ? formatDate(booking.updatedAt) : 'N/A'}</p>
                {booking.completedAt && <p><strong>Completed:</strong> {formatDate(booking.completedAt)}</p>}
                {booking.comments && (
                  <div>
                    <h4>Additional Comments</h4>
                    <p>{booking.comments}</p>
                  </div>
                )}
                {booking.propertyId && <p><strong>Property ID:</strong> {booking.propertyId}</p>}
              </div>
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
            
            {booking.status === 'completed' && (
              <div className="completed-status">
                <FaCheck style={{ color: 'green' }} />
                <span>Booking Completed</span>
                {booking.propertyId && (
                  <p>Property ID: {booking.propertyId}</p>
                )}
              </div>
            )}
            
            {(booking.status === 'pending' || booking.status === 'assigned') && (
              <Button className="cancel-button" onClick={handleCancelBooking}>
                <FaBan /> Cancel Booking
              </Button>
            )}
          </div>
          
          {/* Property Creation Form - Show directly on page when status is 'assigned' */}
          {booking.status === 'assigned' && (
            <div style={{ marginTop: '2rem' }}>
              <h3>Complete Booking & Create Property</h3>
              
              <PropertyFormContainer>
                {/* Basic Information */}
                <div className="section-title">Basic Information</div>
                <GridContainer>
                  <StyledFormGroup>
                  <Label>Title*</Label>
                    <Input 
                      type="text" 
                      value={propertyData.title} 
                    onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                    placeholder="Enter property title"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Property Type*</Label>
                    <Select 
                      value={propertyData.propertyType} 
                      onChange={(e) => setPropertyData({ ...propertyData, propertyType: e.target.value as PropertyFormData['propertyType'] })}
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="room">Room</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="townhouse">Townhouse</option>
                    </Select>
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Status*</Label>
                    <Select 
                      value={propertyData.status} 
                      onChange={(e) => setPropertyData({ ...propertyData, status: e.target.value as 'available' | 'occupied' })}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                    </Select>
                  </StyledFormGroup>
                </GridContainer>
                
                <StyledFormGroup>
                  <Label>Description*</Label>
                  <Input
                    as="textarea"
                    value={propertyData.description}
                    onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                    placeholder="Enter property description"
                  />
                </StyledFormGroup>
                
                {/* Pricing Information */}
                <div className="section-title">Pricing Information</div>
                <GridContainer>
                  <StyledFormGroup>
                    <Label>Monthly Price*</Label>
                    <Input 
                      type="number" 
                      value={propertyData.price} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        price: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Monthly Price"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Deposit</Label>
                    <Input 
                      type="number" 
                      value={propertyData.deposit} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        deposit: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Deposit"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Service Fee</Label>
                    <Input 
                      type="number" 
                      value={propertyData.serviceFee} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        serviceFee: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Service Fee"
                    />
                  </StyledFormGroup>
                </GridContainer>
                
                {/* Rooms */}
                <div className="section-title">Rooms</div>
                <StyledFormGroup>
                  <RoomAdderSection>
                    <div className="room-form">
                    <Select 
                        value={roomFormData.type}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          type: e.target.value as typeof roomFormData.type
                        })}
                      >
                        {ROOM_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </Select>
                      <Input
                        type="number"
                        value={roomFormData.area}
                        onChange={(e) => setRoomFormData({
                          ...roomFormData,
                          area: parseFloat(e.target.value) || 0
                        })}
                        placeholder="Size (m²)"
                      />
                      <AddButton 
                        onClick={handleAddRoom}
                        disabled={roomFormData.area <= 0}
                      >
                        <FaPlus /> Add Room
                      </AddButton>
                    </div>

                    <div className="rooms-list">
                      {propertyData.rooms.map((room, index) => (
                        <div key={index} className="room-item">
                          <div className="room-info">
                            <span className="room-type">
                              {ROOM_TYPES.find(type => type.value === room.type)?.label || room.type}
                            </span>
                            <span className="room-size">{room.area} m²</span>
                          </div>
                          <button 
                            className="delete-button"
                            onClick={() => handleRemoveRoom(index)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </RoomAdderSection>
                </StyledFormGroup>
                
                {/* Property Summary */}
                <div className="section-title">Property Summary</div>
                <StyledFormGroup>
                  <GridContainer>
                    <div>
                      <Label>Total Bedrooms</Label>
                      <div className="summary-value">
                        {propertyData.rooms.filter(room => room.type === 'bedroom').length}
                      </div>
                    </div>
                    <div>
                      <Label>Total Bathrooms</Label>
                      <div className="summary-value">
                        {propertyData.rooms.filter(room => room.type === 'bathroom').length}
                      </div>
                    </div>
                    <div>
                      <Label>Total Area</Label>
                      <div className="summary-value">
                        {propertyData.rooms.reduce((total, room) => total + room.area, 0)} m²
                      </div>
                    </div>
                  </GridContainer>
                </StyledFormGroup>
                
                {/* Housing Preferences */}
                <div className="section-title">Housing Preferences</div>
                <StyledFormGroup>
                  <Label>Housing Preference</Label>
                  <Select 
                    value={propertyData.housingPreference} 
                    onChange={(e) => setPropertyData({ ...propertyData, housingPreference: e.target.value })}
                  >
                    <option value="">No Specific Preference</option>
                    <option value="womenOnly">Women Only</option>
                    <option value="familiesOnly">Families Only</option>
                  </Select>
                </StyledFormGroup>
                
                {/* Features */}
                <div className="section-title">Features</div>
                <StyledFormGroup>
                  <div className="subsection-title">Included Services</div>
                  <CheckboxGrid>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('water')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'water'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'water') 
                            });
                          }
                        }}
                      />
                      <span>Water</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('electricity')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'electricity'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'electricity') 
                            });
                          }
                        }}
                      />
                      <span>Electricity</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('wifi')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'wifi'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'wifi') 
                            });
                          }
                        }}
                      />
                      <span>Wi-Fi</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('gas')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'gas'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'gas') 
                            });
                          }
                        }}
                      />
                      <span>Gas</span>
                    </CheckboxLabel>
                  </CheckboxGrid>
                </StyledFormGroup>

                <StyledFormGroup>
                  <div className="subsection-title">Property Features</div>
                  <CheckboxGrid>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('balcony')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'balcony'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'balcony') 
                            });
                          }
                        }}
                      />
                      <span>Balcony</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('central-heating')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'central-heating'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'central-heating') 
                            });
                          }
                        }}
                      />
                      <span>Central Heating</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('parking-space')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'parking-space'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'parking-space') 
                            });
                          }
                        }}
                      />
                      <span>Parking Space</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('air-conditioning')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'air-conditioning'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'air-conditioning') 
                            });
                          }
                        }}
                      />
                      <span>Air Conditioning</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('wooden-floors')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'wooden-floors'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'wooden-floors') 
                            });
                          }
                        }}
                      />
                      <span>Wooden Floors</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('elevator')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'elevator'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'elevator') 
                            });
                          }
                        }}
                      />
                      <span>Elevator</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('swimming-pool')}    
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'swimming-pool'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'swimming-pool') 
                            });
                          }
                        }}
                      />
                      <span>Swimming Pool</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('fireplace')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'fireplace'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'fireplace') 
                            });
                          }
                        }}
                      />
                      <span>Fireplace</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.features.includes('accessible')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPropertyData({ 
                              ...propertyData, 
                              features: [...propertyData.features, 'accessible'] 
                            });
                          } else {
                            setPropertyData({ 
                              ...propertyData, 
                              features: propertyData.features.filter(f => f !== 'accessible') 
                            });
                          }
                        }}
                      />
                      <span>Accessible</span>
                    </CheckboxLabel>
                  </CheckboxGrid>
                </StyledFormGroup>

                <StyledFormGroup>
                  <div className="subsection-title">Allowed Rules</div>
                  <CheckboxGrid>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.petsAllowed}
                        onChange={(e) => setPropertyData({ ...propertyData, petsAllowed: e.target.checked })}
                      />
                      <span>Pets Allowed</span>
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <input
                        type="checkbox"
                        checked={propertyData.smokingAllowed}
                        onChange={(e) => setPropertyData({ ...propertyData, smokingAllowed: e.target.checked })}
                      />
                      <span>Smoking Allowed</span>
                    </CheckboxLabel>
                    {propertyData.rules.map((rule, index) => (
                      <CheckboxLabel key={rule.name}>
                        <input
                          type="checkbox"
                          checked={rule.allowed}
                          onChange={(e) => handleRuleToggle(index)}
                        />
                        {rule.name}
                      </CheckboxLabel>
                    ))}
                  </CheckboxGrid>
                </StyledFormGroup>
                
                {/* Availability */}
                <div className="section-title">Availability</div>
                <GridContainer>
                  <StyledFormGroup>
                    <Label>Available From*</Label>
                    <Input 
                      type="date" 
                      value={propertyData.availableFrom} 
                      onChange={(e) => setPropertyData({ ...propertyData, availableFrom: e.target.value })}
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Minimum Stay</Label>
                    <Input 
                      type="text" 
                      value={propertyData.minstay} 
                      onChange={(e) => setPropertyData({ ...propertyData, minstay: e.target.value })}
                      placeholder="e.g., 6 months"
                    />
                  </StyledFormGroup>
                </GridContainer>
                
                {/* Address */}
                <div className="section-title">Address Information</div>
                <StyledFormGroup>
                  <Label>Street Address*</Label>
                    <Input 
                      type="text" 
                      value={propertyData.address.street} 
                    onChange={(e) => setPropertyData({
                      ...propertyData,
                      address: { ...propertyData.address, street: e.target.value }
                    })}
                    placeholder="Street"
                  />
                </StyledFormGroup>
                
                <GridContainer>
                  <StyledFormGroup>
                    <Label>City*</Label>
                    <Input 
                      type="text" 
                      value={propertyData.address.city} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        address: { ...propertyData.address, city: e.target.value }
                      })}
                      placeholder="City"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>State/Region</Label>
                    <Input 
                      type="text" 
                      value={propertyData.address.state} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        address: { ...propertyData.address, state: e.target.value }
                      })}
                      placeholder="State"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>ZIP Code</Label>
                    <Input 
                      type="text" 
                      value={propertyData.address.zipCode} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        address: { ...propertyData.address, zipCode: e.target.value }
                      })}
                      placeholder="ZIP Code"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Country*</Label>
                    <Input 
                      type="text" 
                      value={propertyData.address.country} 
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        address: { ...propertyData.address, country: e.target.value }
                      })}
                      placeholder="Country"
                    />
                  </StyledFormGroup>
                </GridContainer>
                
                {/* Location */}
                <div className="section-title">Location Coordinates</div>
                <GridContainer>
                  <StyledFormGroup>
                    <Label>Latitude</Label>
                    <Input 
                      type="number" 
                      value={propertyData.location?.lat || ''} 
                      onChange={(e) => {
                        const currentLat = parseFloat(e.target.value) || 0;
                        const currentLng = propertyData.location?.lng || 0;
                        setPropertyData({
                          ...propertyData,
                          location: { lat: currentLat, lng: currentLng }
                        });
                      }}
                      placeholder="Latitude"
                    />
                  </StyledFormGroup>
                  
                  <StyledFormGroup>
                    <Label>Longitude</Label>
                    <Input 
                      type="number" 
                      value={propertyData.location?.lng || ''} 
                      onChange={(e) => {
                        const currentLat = propertyData.location?.lat || 0;
                        const currentLng = parseFloat(e.target.value) || 0;
                        setPropertyData({
                          ...propertyData,
                          location: { lat: currentLat, lng: currentLng }
                        });
                      }}
                      placeholder="Longitude"
                    />
                  </StyledFormGroup>
                </GridContainer>
                
                {/* Amenities */}
                <div className="section-title">Amenities</div>
                <StyledFormGroup>
                  <CheckboxGrid>
                    {COMMON_AMENITIES.map((amenity) => (
                      <CheckboxLabel key={amenity}>
                        <input
                          type="checkbox"
                          checked={propertyData.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPropertyData({
                                ...propertyData,
                                amenities: [...propertyData.amenities, amenity]
                              });
                            } else {
                              setPropertyData({
                                ...propertyData,
                                amenities: propertyData.amenities.filter(a => a !== amenity)
                              });
                            }
                          }}
                        />
                        {amenity}
                      </CheckboxLabel>
                    ))}
                  </CheckboxGrid>
                  
                  <CustomInputSection>
                    <Label>Add Custom Amenity</Label>
                    <div className="input-row">
                      <Input 
                        type="text" 
                        value={amenityInput} 
                        onChange={(e) => setAmenityInput(e.target.value)}
                        placeholder="Enter custom amenity"
                      />
                      <AddButton onClick={addAmenity}>
                        <FaPlus /> Add
                      </AddButton>
                  </div>
                    {propertyData.amenities.filter(a => !COMMON_AMENITIES.includes(a)).length > 0 && (
                      <ListContainer>
                        {propertyData.amenities
                          .filter(a => !COMMON_AMENITIES.includes(a))
                          .map((amenity, index) => (
                            <div key={index} className="list-item">
                              <span>{amenity}</span>
                              <button onClick={() => removeAmenity(propertyData.amenities.indexOf(amenity))}>
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                      </ListContainer>
                    )}
                  </CustomInputSection>
                </StyledFormGroup>
                
                {/* Rules */}
                <div className="section-title">Rules</div>
                <StyledFormGroup>
                  <div className="rules-section">
                    <GridContainer>
                      <Input
                        type="text"
                        value={ruleInput}
                        onChange={(e) => setRuleInput(e.target.value)}
                        placeholder="Add new rule"
                      />
                      <AddButton onClick={addRule}>
                        <FaPlus /> Add Rule
                      </AddButton>
                    </GridContainer>
                    <ListContainer>
                      {propertyData.rules.map((rule, index) => (
                        <div key={index} className="rule-item">
                          <div className="rule-name">{rule.name}</div>
                          <div className="rule-controls">
                            <div className="rule-status">
                              {rule.allowed ? 'Allowed' : 'Not Allowed'}
                            </div>
                            <ToggleSwitch>
                              <input
                                type="checkbox"
                                checked={rule.allowed}
                                onChange={() => handleRuleToggle(index)}
                              />
                              <span className="slider"></span>
                            </ToggleSwitch>
                            <button 
                              className="delete-button"
                              onClick={() => removeRule(index)}
                              title="Delete rule"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </ListContainer>
                  </div>
                </StyledFormGroup>
                
                {/* Nearby Places */}
                <div className="section-title">Nearby Places</div>
                <StyledFormGroup>
                  <GridContainer>
                    <Input
                      type="text"
                      value={placeNameInput}
                      onChange={(e) => setPlaceNameInput(e.target.value)}
                      placeholder="Place name"
                    />
                    <Input
                      type="text"
                      value={placeDistanceInput}
                      onChange={(e) => setPlaceDistanceInput(e.target.value)}
                      placeholder="Time distance"
                    />
                    <AddButton onClick={addNearbyPlace}>
                      <FaPlus /> Add Place
                    </AddButton>
                  </GridContainer>
                  <ListContainer>
                    {propertyData.nearbyPlaces.map((place, index) => (
                      <div key={index} className="list-item">
                        <span>{place.name} - {place.timeDistance}</span>
                        <button onClick={() => removeNearbyPlace(index)}>
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </ListContainer>
                </StyledFormGroup>
                
                {/* Images */}
                <div className="section-title">Images</div>
                <StyledFormGroup>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <p className="helper-text">Upload property images</p>
                  
                  {/* Image upload status */}
                  <div className="upload-status">
                    <p>Selected images: {imageFiles.length}</p>
                    <p>Total images: {propertyData.images.length}</p>
                    {loading && <p className="uploading">Uploading images...</p>}
                    {statusMessage && <p className="status-message">{statusMessage}</p>}
                  </div>
                  
                  {propertyData.images.length > 0 && (
                    <ImagePreviewContainer>
                      {propertyData.images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={image} alt={`Property ${index + 1}`} />
                          <button onClick={() => {
                            setPropertyData({
                              ...propertyData,
                              images: propertyData.images.filter((_, i) => i !== index)
                            });
                          }}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </ImagePreviewContainer>
                  )}
                </StyledFormGroup>
                
                {/* Videos */}
                <div className="section-title">Videos</div>
                <StyledFormGroup>
                    <Input 
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoSelect}
                  />
                  <p className="helper-text">Upload property videos (max 2 videos)</p>
                  {propertyData.videos.length > 0 && (
                    <VideoPreviewContainer>
                      {propertyData.videos.map((video, index) => (
                        <div key={index} className="video-preview">
                          <video src={video} controls width="200" height="150" />
                          <button onClick={() => {
                            setPropertyData({
                              ...propertyData,
                              videos: propertyData.videos.filter((_, i) => i !== index)
                            });
                            // Also remove from videoFiles if it's a local file
                            setVideoFiles(prev => prev.filter((_, i) => i !== index));
                          }}>
                            <FaTrash />
                          </button>
                    </div>
                      ))}
                    </VideoPreviewContainer>
                  )}
                </StyledFormGroup>
                
                {/* Furnished Status */}
                <div className="section-title">Additional Information</div>
                <StyledFormGroup>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={propertyData.isFurnished}
                      onChange={(e) => setPropertyData({
                        ...propertyData,
                        isFurnished: e.target.checked
                      })}
                    />
                    Furnished
                  </CheckboxLabel>
                </StyledFormGroup>
                
                {/* Submit Button */}
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <PrimaryButton 
                    onClick={handleCompleteBooking}
                    disabled={!propertyData.title || !propertyData.description || !propertyData.address.street}
                  >
                    <FaCheck /> Complete Booking & Create Property
                  </PrimaryButton>
                </div>
              </PropertyFormContainer>
            </div>
          )}
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
    </div>
  );
};

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