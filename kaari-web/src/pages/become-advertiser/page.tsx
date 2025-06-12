import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdvertiserRegistrationPageStyle } from './styles';
import UnifiedHeader from '../../components/skeletons/constructed/headers/unified-header';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../components/skeletons/inputs/input-fields/textarea-variant';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../components/skeletons/buttons/white_LB60';
import { FaCheck, FaChevronRight, FaChevronLeft, FaMapMarkerAlt, FaCheckCircle, FaUserAlt, FaBuilding, FaGoogle, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { Theme } from '../../theme/theme';
import { saveAdvertiserInfo, getOrCreateUserDocument } from '../../backend/firebase/auth';
import { getGoogleMapsLoaderOptions } from '../../utils/googleMapsConfig';

// Property type options as chips
const PROPERTY_TYPES = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'condo', label: 'Condo' },
  { id: 'penthouse', label: 'Penthouse' },
  { id: 'studio', label: 'Studio' }
];

// Agency size options
const AGENCY_SIZES = [
  { value: 'small', label: 'Small (1-5 agents)' },
  { value: 'medium', label: 'Medium (6-20 agents)' },
  { value: 'large', label: 'Large (21+ agents)' }
];

// Property quantity options
const PROPERTY_QUANTITIES = [
  { value: '1-2', label: '1-2 properties' },
  { value: '3-10', label: '3-10 properties' },
  { value: '11+', label: '11+ properties' }
];

interface FormData {
  accountType: 'individual' | 'agency' | '';
  agencyName: string;
  agencySize: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  otpCode: string;
  city: string;
  propertyQuantity: string;
  propertyTypes: string[];
  termsAgreed: boolean;
  additionalInfo: string;
}

const BecomeAdvertiserPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastService();
  const signUp = useStore(state => state.signUp);
  
  // Current step (1-4)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data
  const [formData, setFormData] = useState<FormData>({
    accountType: '',
    agencyName: '',
    agencySize: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    otpCode: '',
    city: '',
    propertyQuantity: '',
    propertyTypes: [],
    termsAgreed: false,
    additionalInfo: ''
  });
  
  // Form validation
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  // OTP verification
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Places autocomplete
  const { isLoaded } = useJsApiLoader(getGoogleMapsLoaderOptions());
  
  const searchBoxRef = React.useRef<google.maps.places.SearchBox>();
  
  // Check for existing logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pre-fill email if user is already logged in
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || ''
        }));
        
        // If we're arriving from Google auth flow, start at step 1 (don't skip)
        const urlParams = new URLSearchParams(window.location.search);
        const fromAuth = urlParams.get('fromAuth') === 'true';
        
        // If coming directly from auth flow, ensure we start at step 1
        if (fromAuth) {
          setCurrentStep(1);
          
          // Scroll to top of form container for better UX
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 300);
        }
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Ensure page is scrolled to top on initial load
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
  // Also scroll to top whenever the step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  
  // Handle input change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Handle radio selection with improved animation
  const handleAccountTypeSelect = (type: 'individual' | 'agency') => {
    // Add a slight delay before changing account type for better animation
    if (type !== formData.accountType && type === 'individual' && formData.accountType === 'agency') {
      // If switching from agency to individual, animate the fields out first
      const conditionalFields = document.querySelector('.conditional-fields');
      if (conditionalFields) {
        conditionalFields.classList.add('animating-out');
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            accountType: type,
            // Reset agency fields
            agencyName: '',
            agencySize: ''
          }));
        }, 300);
      } else {
        setFormData(prev => ({
          ...prev,
          accountType: type
        }));
      }
    } else {
      // For other transitions
      setFormData(prev => ({
        ...prev,
        accountType: type
      }));
    }
    
    // Clear error
    if (errors.accountType) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.accountType;
        return newErrors;
      });
    }
  };
  
  // Handle property type chip selection
  const togglePropertyType = (typeId: string) => {
    setFormData(prev => {
      const types = [...prev.propertyTypes];
      if (types.includes(typeId)) {
        return {
          ...prev,
          propertyTypes: types.filter(t => t !== typeId)
        };
      } else {
        return {
          ...prev,
          propertyTypes: [...types, typeId]
        };
      }
    });
  };
  
  // Handle places autocomplete
  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        
        // Extract city from address components
        let city = '';
        if (place.address_components) {
          for (const component of place.address_components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
              break;
            }
          }
        }
        
        if (city) {
          setFormData(prev => ({
            ...prev,
            city
          }));
          
          // Clear error
          if (errors.city) {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.city;
              return newErrors;
            });
          }
        }
      }
    }
  };
  
  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };
  
  // Handle phone number input change with formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (otpVerified) return; // Don't allow changes if already verified
    
    const formattedValue = formatPhoneNumber(e.target.value);
    handleInputChange('mobileNumber', formattedValue);
  };
  
  // Custom handler for OTP input to limit to 6 digits
  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only keep the first 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    handleInputChange('otpCode', value);
  };
  
  // Start OTP resend timer
  const startOtpTimer = () => {
    // 60 second countdown
    setOtpResendTimer(60);
    
    if (otpTimerRef.current) {
      clearInterval(otpTimerRef.current);
    }
    
    otpTimerRef.current = setInterval(() => {
      setOtpResendTimer(prev => {
        if (prev <= 1) {
          if (otpTimerRef.current) clearInterval(otpTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
    };
  }, []);
  
  // Generate a 6-digit OTP code
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Send OTP code
  const sendOtp = async () => {
    if (!formData.mobileNumber) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: 'Please enter your mobile number'
      }));
      return;
    }
    
    // Check if phone number has correct format
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(formData.mobileNumber)) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: 'Please enter a valid phone number in format (XXX) XXX-XXXX'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call your backend to send the OTP
      // For demo purposes, we'll simulate sending an OTP and store it in localStorage
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate and "store" the OTP (in a real app, this would be handled securely on the backend)
      const otp = generateOTP();
      localStorage.setItem('demo_otp', otp);
      
      console.log(`Demo OTP code: ${otp}`); // For testing purposes only
      
      setOtpSent(true);
      startOtpTimer(); // Start the countdown timer
      toast.showToast('success', 'Success', 'OTP code sent to your mobile number');
    } catch {
      toast.showToast('error', 'Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Verify OTP code
  const verifyOtp = async () => {
    if (!formData.otpCode) {
      setErrors(prev => ({
        ...prev,
        otpCode: 'Please enter the OTP code'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would verify the OTP with your backend
      // For demo purposes, we'll simulate verification using localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the stored demo OTP
      const storedOtp = localStorage.getItem('demo_otp') || '123456';
      
      if (formData.otpCode === storedOtp) {
        setOtpVerified(true);
        
        // Clear the timer when successfully verified
        if (otpTimerRef.current) {
          clearInterval(otpTimerRef.current);
          setOtpResendTimer(0);
        }
        
        toast.showToast('success', 'Success', 'Mobile number verified successfully');
        
        // Clear error if any
        if (errors.otpCode) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.otpCode;
            return newErrors;
          });
        }
      } else {
        setErrors(prev => ({
          ...prev,
          otpCode: 'Invalid OTP code. Please try again.'
        }));
      }
    } catch {
      toast.showToast('error', 'Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 1) {
      if (!formData.accountType) {
        newErrors.accountType = 'Please select account type';
      }
      
      if (formData.accountType === 'agency') {
        if (!formData.agencyName) {
          newErrors.agencyName = 'Please enter agency name';
        }
        if (!formData.agencySize) {
          newErrors.agencySize = 'Please select agency size';
        }
      }
    }
    
    if (step === 2) {
      if (!formData.firstName) {
        newErrors.firstName = 'Please enter your first name';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Please enter your last name';
      }
      if (!formData.email) {
        newErrors.email = 'Please enter your email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 3) {
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = 'Please enter your mobile number';
      }
      
      if (!otpVerified) {
        newErrors.otpCode = 'Please verify your mobile number';
      }
      
      if (!formData.city) {
        newErrors.city = 'Please enter your city of operation';
      }
    }
    
    if (step === 4) {
      if (!formData.propertyQuantity) {
        newErrors.propertyQuantity = 'Please select how many properties you could list';
      }
      
      if (!formData.termsAgreed) {
        newErrors.termsAgreed = 'You must agree to the Terms and Privacy Policy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Go to next step with animation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      // Always scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Animate step change
      setCurrentStep(current => current + 1);
    }
  };
  
  // Go to previous step with animation
  const prevStep = () => {
    // Always scroll to top when changing steps
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animate step change
    setCurrentStep(current => current - 1);
  };
  
  // Submit form
  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current authenticated user
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      let userId;
      
      // If user is already authenticated (like from Google sign-in), use their ID
      if (currentUser) {
        // Ensure the user has a document in Firestore
        const userDoc = await getOrCreateUserDocument();
        
        if (!userDoc) {
          throw new Error('Failed to retrieve or create user document');
        }
        
        userId = userDoc.id;
        console.log("Using existing authenticated user:", userId);
      } else {
        // User is not authenticated, create a new account
        // Generate a random password - in a real app, you'd want to handle this differently
        const password = Math.random().toString(36).slice(-8);
        
        try {
          // Create the user with email and password
          const newUser = await signUp(
            formData.email, 
            password, 
            `${formData.firstName} ${formData.lastName}`, 
            'advertiser'
          );
          
          userId = newUser.id;
          console.log("Created new user:", userId);
        } catch (signUpError: any) {
          console.error('Sign up error:', signUpError);
          
          // Handle specific signup errors
          if (signUpError?.code === 'auth/email-already-in-use') {
            toast.showToast('error', 'Email In Use', 'This email is already registered. Please sign in with that account instead.');
          } else {
            toast.showToast('error', 'Registration Failed', signUpError?.message || 'Failed to create account');
          }
          
          setIsSubmitting(false);
          return;
        }
      }
      
      // Save additional advertiser information regardless of whether user is new or existing
      try {
        await saveAdvertiserInfo({
          userId: userId,
          isBusiness: formData.accountType === 'agency',
          businessName: formData.accountType === 'agency' ? formData.agencyName : undefined,
          businessSize: formData.accountType === 'agency' ? formData.agencySize : undefined,
          city: formData.city,
          phoneNumber: formData.mobileNumber,
          propertyQuantity: formData.propertyQuantity,
          propertyTypes: formData.propertyTypes,
          additionalInfo: formData.additionalInfo
        });
        
        // Display success message
        toast.showToast('success', 'Success', 'Registration completed successfully');
        
        // Redirect to the photoshoot booking page
        navigate('/photoshoot-booking');
      } catch (saveError: any) {
        console.error('Error saving advertiser info:', saveError);
        toast.showToast('error', 'Registration Incomplete', 'Your account was created but we couldn\'t save your advertiser details. Please try again or contact support.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle generic errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.showToast('error', 'Registration Failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      
      // Add advertiser role hint to the authentication
      provider.setCustomParameters({
        prompt: 'select_account',
        // This allows us to identify this as an advertiser sign-up
        login_hint: 'advertiser_registration'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Pre-fill user information
        setFormData(prev => ({
          ...prev,
          email: result.user.email || '',
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || ''
        }));
        
        // Show success message
        toast.showToast('success', 'Success', 'Successfully signed in with Google');
        
        // Keep the user on step 2 to verify their information
        // They can modify their details if needed before proceeding
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.showToast('error', 'Google Sign-in Failed', (error as any)?.message || 'Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render step 1: Account Type
  const renderStep1 = () => {
    return (
      <>
        <h2 className="form-title">Select Account Type</h2>
        
        <div className="form-group required">
          <label>I am a</label>
          <div className="radio-group">
            <div 
              className={`radio-option ${formData.accountType === 'individual' ? 'selected' : ''}`}
              onClick={() => handleAccountTypeSelect('individual')}
            >
              <div className="radio-title">
                <input 
                  type="radio" 
                  name="accountType" 
                  checked={formData.accountType === 'individual'} 
                  onChange={() => handleAccountTypeSelect('individual')}
                />
                <span>Landlord - Broker</span>
              </div>
              <div className="radio-description">
                I'm an individual property owner or broker
              </div>
              <div className="option-icon">
                <FaUserAlt />
              </div>
            </div>
            
            <div 
              className={`radio-option ${formData.accountType === 'agency' ? 'selected' : ''}`}
              onClick={() => handleAccountTypeSelect('agency')}
            >
              <div className="radio-title">
                <input 
                  type="radio" 
                  name="accountType" 
                  checked={formData.accountType === 'agency'} 
                  onChange={() => handleAccountTypeSelect('agency')}
                />
                <span>Real-Estate Agency</span>
              </div>
              <div className="radio-description">
                I represent a real estate company or agency
              </div>
              <div className="option-icon">
                <FaBuilding />
              </div>
            </div>
          </div>
          {errors.accountType && <div className="error-message">{errors.accountType}</div>}
        </div>
        
        {formData.accountType === 'agency' && (
          <div className="conditional-fields">
            <div className="form-group required" style={{ marginBottom: '16px' }}>
              <label htmlFor="agencyName">Agency Name</label>
              <InputBaseModel
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                placeholder="Enter your agency name"
                error={errors.agencyName}
              />
            </div>
            
            <div className="form-group required">
              <label htmlFor="agencySize">Agency Size</label>
              <div style={{ marginBottom: '24px' }}> </div>
              <SelectFieldBaseModelVariant1
                options={AGENCY_SIZES.map(size => size.label)}
                value={AGENCY_SIZES.find(size => size.value === formData.agencySize)?.label || ''}
                onChange={(value) => {
                  const selectedSize = AGENCY_SIZES.find(size => size.label === value);
                  if (selectedSize) {
                    handleInputChange('agencySize', selectedSize.value);
                  }
                }}
                placeholder="Select agency size"
              />
              {errors.agencySize && <div className="error-message">{errors.agencySize}</div>}
            </div>
          </div>
        )}
        
        <div className="buttons-container">
          <div></div> {/* Empty div for space-between alignment */}
          <PurpleButtonLB60
            text="Continue"
            onClick={nextStep}
            disabled={isSubmitting}
          />
        </div>
      </>
    );
  };
  
  // Render step 2: User Information
  const renderStep2 = () => {
    return (
      <>
        <h2 className="form-title">Your Information</h2>
        
        <div className="form-row">
          <div className="form-group required">
            <label htmlFor="firstName">First Name</label>
            <InputBaseModel
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              error={errors.firstName}
            />
          </div>
          
          <div className="form-group required">
            <label htmlFor="lastName">Last Name</label>
            <InputBaseModel
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              error={errors.lastName}
            />
          </div>
        </div>
        
        <div className="form-group required">
          <label htmlFor="email">Email Address</label>
          <InputBaseModel
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email address"
            // Using text type as email is not supported
            type="text"
            error={errors.email}
          />
        </div>
        
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text="Back"
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text="Continue"
            onClick={nextStep}
            disabled={isSubmitting}
          />
        </div>
      </>
    );
  };
  
  // Render step 3: Contact and Location
  const renderStep3 = () => {
    return (
      <>
        <h2 className="form-title">Contact Information & Location</h2>
        
        <div className="form-step-content">
          <div className="form-group required">
            <label htmlFor="mobileNumber">
              <FaPhoneAlt className="label-icon" /> Mobile Number
            </label>
            <div className="input-group mobile-input-group">
              <InputBaseModel
                value={formData.mobileNumber}
                onChange={otpVerified ? undefined : handlePhoneChange}
                placeholder="(XXX) XXX-XXXX"
                error={errors.mobileNumber}
              />
              <button 
                className="send-otp-button"
                onClick={sendOtp}
                disabled={isSubmitting || otpVerified || !formData.mobileNumber || otpResendTimer > 0}
              >
                {otpSent && otpResendTimer > 0 
                  ? `Resend (${otpResendTimer}s)` 
                  : otpSent 
                    ? "Resend OTP" 
                    : "Send OTP"}
              </button>
            </div>
            {otpVerified && (
              <div className="verified-badge">
                <FaCheckCircle /> Mobile number verified successfully
              </div>
            )}
          </div>
          
          {otpSent && !otpVerified && (
            <div className="form-group required otp-group">
              <label htmlFor="otpCode">
                <FaShieldAlt className="label-icon" /> Verification Code
              </label>
              <div className="input-group otp-input-group">
                <InputBaseModel
                  value={formData.otpCode}
                  onChange={handleOtpInput}
                  placeholder="Enter 6-digit code"
                  error={errors.otpCode}
                />
                <button 
                  className="verify-button"
                  onClick={verifyOtp}
                  disabled={isSubmitting || !formData.otpCode || formData.otpCode.length < 6}
                >
                  Verify
                </button>
              </div>
              <div className="otp-help-text">
                Enter the 6-digit code sent to your mobile number.
                <div className="demo-note">
                  <strong>Demo mode:</strong> The OTP is shown in the browser console for testing.
                </div>
              </div>
            </div>
          )}
          
          <div className="form-group required location-group">
            <label htmlFor="city">
              <FaMapMarkerAlt className="label-icon" /> City of Operation
            </label>
            <div className="city-input-container">
              {isLoaded ? (
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                >
                  <div className="location-input-wrapper">
                    <InputBaseModel
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Search for your city"
                      error={errors.city}
                    />
                    <FaMapMarkerAlt className="city-icon" />
                  </div>
                </StandaloneSearchBox>
              ) : (
                <div className="location-input-wrapper">
                  <InputBaseModel
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter your city"
                    error={errors.city}
                  />
                  <FaMapMarkerAlt className="city-icon" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text="Back"
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text="Continue"
            onClick={nextStep}
            disabled={isSubmitting}
          />
        </div>
      </>
    );
  };
  
  // Render step 4: Listing Information and Legal
  const renderStep4 = () => {
    return (
      <>
        <h2 className="form-title">Listing Information</h2>
        
        <div className="form-group required">
          <label htmlFor="propertyQuantity">How many properties could you list?</label>
          <SelectFieldBaseModelVariant1
            options={PROPERTY_QUANTITIES.map(q => q.label)}
            value={PROPERTY_QUANTITIES.find(q => q.value === formData.propertyQuantity)?.label || ''}
            onChange={(value) => {
              const selectedQuantity = PROPERTY_QUANTITIES.find(q => q.label === value);
              if (selectedQuantity) {
                handleInputChange('propertyQuantity', selectedQuantity.value);
              }
            }}
            placeholder="Select number of properties"
          />
          {errors.propertyQuantity && <div className="error-message">{errors.propertyQuantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="propertyTypes">Primary property types</label>
          <div className="chips-container">
            {PROPERTY_TYPES.map(type => (
              <div 
                key={type.id}
                className={`chip ${formData.propertyTypes.includes(type.id) ? 'selected' : ''}`}
                onClick={() => togglePropertyType(type.id)}
              >
                {type.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information (Optional)</label>
          <TextAreaBaseModel
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            placeholder="Tell us more about your properties or any special requirements"
            rows={4}
          />
        </div>
        
        <div className="form-group required">
          <div className="terms-checkbox">
            <input 
              type="checkbox" 
              id="termsAgreed" 
              checked={formData.termsAgreed}
              onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
            />
            <label htmlFor="termsAgreed">
              I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
            </label>
          </div>
          {errors.termsAgreed && <div className="error-message">{errors.termsAgreed}</div>}
        </div>
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text="Back"
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text={isSubmitting ? "Creating Account..." : "Create my account"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </>
    );
  };
  
  // Update renderStepContent to include transition animations
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <div key="step1" className="step-content">{renderStep1()}</div>;
      case 2:
        return <div key="step2" className="step-content">{renderStep2()}</div>;
      case 3:
        return <div key="step3" className="step-content">{renderStep3()}</div>;
      case 4:
        return <div key="step4" className="step-content">{renderStep4()}</div>;
      default:
        return null;
    }
  };
  
  return (
    <>
      <UnifiedHeader />
      
      <AdvertiserRegistrationPageStyle>
        <h1 className="page-title" style={{ marginBottom: '70px' }}></h1>
        
        
        <div className="steps-container">
          <div className="step">
            <div className={`step-number ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? <FaCheck /> : 1}
            </div>
            <div className={`step-label ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              Account Type
            </div>
          </div>
          
          <div className="step">
            <div className={`step-number ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              {currentStep > 2 ? <FaCheck /> : 2}
            </div>
            <div className={`step-label ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              User Info
            </div>
          </div>
          
          <div className="step">
            <div className={`step-number ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              {currentStep > 3 ? <FaCheck /> : 3}
            </div>
            <div className={`step-label ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              Contact & Location
            </div>
          </div>
          
          <div className="step">
            <div className={`step-number ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
              {currentStep > 4 ? <FaCheck /> : 4}
            </div>
            <div className={`step-label ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
              Listing Info
            </div>
          </div>
        </div>
        
        <div className="form-container">
          {renderStepContent()}
        </div>
      </AdvertiserRegistrationPageStyle>
    </>
  );
};

export default BecomeAdvertiserPage;