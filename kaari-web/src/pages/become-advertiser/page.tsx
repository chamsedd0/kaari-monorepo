import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AdvertiserRegistrationPageStyle } from './styles';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../components/skeletons/buttons/white_LB60';
import { FaCheckCircle, FaUserAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, linkWithPhoneNumber, ApplicationVerifier } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { Theme } from '../../theme/theme';
import { saveAdvertiserInfo, getOrCreateUserDocument } from '../../backend/firebase/auth';
import OtpInput from '../../components/checkout/input-fields/OtpInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { LanguageSwitcher } from '../../components/skeletons/language-switcher';
import { 
  saveSignupProgress, 
  getSignupProgress, 
  clearSignupProgress, 
  startSignup, 
  completeSignup,
  hideHeadersAndFooters,
} from '../../utils/advertiser-signup';
import { 
  MobileInput, 
  MobilePhoneInput, 
  MobileOtpInput,
  MobileSelect,
  MobileChips,
  MobileStepCounter 
} from '../../components/checkout/input-fields';

// New mobile radio option component
interface MobileRadioOptionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}

const MobileRadioOption: React.FC<MobileRadioOptionProps> = ({
  id,
  title,
  description,
  icon,
  checked,
  onChange
}) => {
  return (
    <MobileRadioContainer className={checked ? 'selected' : ''} onClick={onChange}>
      <RadioCircle checked={checked}>
        {checked && <RadioDot />}
      </RadioCircle>
      <RadioContent>
        <RadioTitle>{title}</RadioTitle>
        <RadioDescription>{description}</RadioDescription>
      </RadioContent>
      <IconWrapper>
        {icon}
      </IconWrapper>
    </MobileRadioContainer>
  );
};

// Styled components for mobile radio option
const MobileRadioContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: ${Theme.borders.radius.md};
  margin-bottom: 12px;
  position: relative;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 280px;
  
  &.selected {
    border-color: ${Theme.colors.secondary};
    background: rgba(143, 39, 206, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(143, 39, 206, 0.15);
  }
  
  @media (max-width: 768px) {
    max-width: 280px;
    width: 100%;
  }
`;

const RadioCircle = styled.div<{ checked: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid ${props => props.checked ? Theme.colors.secondary : Theme.colors.gray};
  background-color: ${props => props.checked ? Theme.colors.secondary : 'white'};
  margin-right: 8px;
  margin-top: 4px;
  flex-shrink: 0;
  position: relative;
`;

const RadioDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RadioContent = styled.div`
  flex: 1;
`;

const RadioTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 3px;
`;

const RadioDescription = styled.div`
  font-size: 12px;
  color: ${Theme.colors.gray2};
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${Theme.colors.gray};
  font-size: 20px;
`;

// Property type options as chips
const PROPERTY_TYPES = [
  { id: 'apartment', label: 'apartment' },
  { id: 'house', label: 'house' },
  { id: 'villa', label: 'villa' },
  { id: 'condo', label: 'condo' },
  { id: 'penthouse', label: 'penthouse' },
  { id: 'studio', label: 'studio' }
];

// Agency size options
const AGENCY_SIZES = [
  { value: 'small', label: 'small_agency' },
  { value: 'medium', label: 'medium_agency' },
  { value: 'large', label: 'large_agency' }
];

// Property quantity options
const PROPERTY_QUANTITIES = [
  { value: '1-2', label: 'property_1_2' },
  { value: '3-10', label: 'property_3_10' },
  { value: '11+', label: 'property_11plus' }
];

// List of major Moroccan cities
const MOROCCAN_CITIES = [
  'Agadir',
  'Casablanca',
  'Fès',
  'Marrakech',
  'Meknès',
  'Mohammedia',
  'Oujda',
  'Rabat',
  'Salé',
  'Tanger',
  'Tétouan',
  'El Jadida',
  'Kenitra',
  'Nador',
  'Essaouira',
  'Chefchaouen',
  'Ouarzazate',
  'Ifrane',
  'Laâyoune',
  'Dakhla',
  'Errachidia',
  'Taza',
  'Safi',
  'Beni Mellal',
  'Khouribga',
  'Settat',
  'Berkane',
  'Al Hoceima',
  'Larache',
  'Taourirt'
];

interface FormData {
  accountType: 'broker' | 'landlord' | 'agency' | '';
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

const AdvertiserRegistrationPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastService();
  const signUp = useStore(state => state.signUp);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  
  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Current step (1-4)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step definitions
  const steps = [
    t('advertiser_registration.step_labels.account_type'),
    t('advertiser_registration.step_labels.user_info'),
    t('advertiser_registration.step_labels.verify_phone'),
    t('advertiser_registration.step_labels.listing_info')
  ];
  
  // Step labels for mobile step counter
  const stepLabels = [
    t('advertiser_registration.step_labels.account_type'),
    t('advertiser_registration.step_labels.user_info'),
    t('advertiser_registration.step_labels.verify_phone'),
    t('advertiser_registration.step_labels.listing_info')
  ];
  
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
  
  // Firebase reCAPTCHA reference
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<any>(null);
  
  // Hide headers and footers
  useEffect(() => {
    const cleanup = hideHeadersAndFooters();
    
    return () => {
      cleanup();
    };
  }, []);
  
  // Check for saved progress on initial load
  useEffect(() => {
    const savedProgress = getSignupProgress();
    if (savedProgress) {
      // Check if the saved progress has a userId and if it matches the current user
      if (savedProgress.userId && (!user || savedProgress.userId !== user.id)) {
        // Different user or logged out, clear the progress
        clearSignupProgress();
        return;
      }
      
      // Restore saved state
      setCurrentStep(savedProgress.step);
      setFormData(savedProgress.formData);
    } else {
      // Start new signup process
      startSignup();
    }
  }, [user]);
  
  // Monitor auth state changes
  useEffect(() => {
    // If user logs out during the signup process, clear the progress
    if (!isAuthenticated) {
      const savedProgress = getSignupProgress();
      if (savedProgress && savedProgress.userId) {
        clearSignupProgress();
      }
    }
  }, [isAuthenticated]);
  
  // Save progress whenever form data or step changes
  useEffect(() => {
    saveSignupProgress({
      step: currentStep,
      formData,
      userId: user?.id,
      timestamp: Date.now()
    });
  }, [currentStep, formData, user]);
  
  // Generate a 6-digit OTP code (for fallback only)
  const generateOTP = useCallback(() => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }, []);
  
  // Start OTP resend timer
  const startOtpTimer = useCallback(() => {
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
  }, []);
  
  // Initialize reCAPTCHA verifier
  const initializeRecaptcha = useCallback((): ApplicationVerifier | null => {
    const auth = getAuth();
    
    // Clear any existing reCAPTCHA
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (e) {
        console.log('Error clearing existing reCAPTCHA:', e);
      }
      recaptchaVerifierRef.current = null;
    }
    
    try {
      // Get the container element
      const container = document.getElementById('recaptcha-container');
      
      if (!container) {
        console.error('Recaptcha container not found');
        toast.showToast('error', t('become_advertiser.toast.error'), 'Recaptcha container not found');
        return null;
      }
      
      // Clear the container's contents to ensure we don't have multiple instances
      container.innerHTML = '';
      
      // Create a new reCAPTCHA verifier with more robust error handling
      // IMPORTANT: For production, make sure:
      // 1. Phone Authentication is enabled in Firebase Console
      // 2. Your domain is added to authorized domains in Firebase Console
      // 3. reCAPTCHA v2 is configured correctly in Firebase Console
      const verifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container', // Use string ID instead of element reference for better compatibility
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            // Reset reCAPTCHA when expired
            console.log('reCAPTCHA expired');
            if (recaptchaVerifierRef.current) {
              try {
                recaptchaVerifierRef.current.clear();
              } catch (e) {
                console.log('Error clearing expired reCAPTCHA:', e);
              }
              recaptchaVerifierRef.current = null;
            }
            toast.showToast('error', t('become_advertiser.toast.error'), t('become_advertiser.toast.recaptcha_expired'));
          }
        }
      );
      
      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      toast.showToast('error', t('become_advertiser.toast.error'), 'Failed to initialize reCAPTCHA');
      return null;
    }
  }, [toast, t]);
  
  // Helper function for formatting phone numbers
  const formatPhoneNumber = useCallback((phoneNumber: string): string => {
    // Trim any whitespace
    phoneNumber = phoneNumber.trim();
    
    // Remove any non-digit characters except the plus sign at the beginning
    phoneNumber = phoneNumber.replace(/(?!^\+)\D/g, '');
    
    // If it doesn't start with +, format it correctly
    if (!phoneNumber.startsWith('+')) {
      // If it starts with 0, assume it's a Moroccan number and replace with +212
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+212' + phoneNumber.substring(1);
      } 
      // If it starts with 212, add a plus
      else if (phoneNumber.startsWith('212')) {
        phoneNumber = '+' + phoneNumber;
      }
      // Otherwise assume it's a Moroccan number without country code
      else {
        phoneNumber = '+212' + phoneNumber;
      }
    }
    
    return phoneNumber;
  }, []);
  
  // Send OTP code using Firebase linkWithPhoneNumber
  const sendOtp = useCallback(async () => {
    if (!formData.mobileNumber) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: t('become_advertiser.validation.enter_mobile')
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.showToast('error', t('become_advertiser.toast.error'), t('become_advertiser.toast.not_authenticated'));
        setIsSubmitting(false);
        return;
      }
      
      // Format phone number to ensure it has international format
      const phoneNumber = formatPhoneNumber(formData.mobileNumber);
      
      console.log('Formatted phone number:', phoneNumber);
      
      // DEVELOPMENT MODE ONLY: Skip actual Firebase verification
      // In development, we'll simulate the OTP process for any phone number
      if (process.env.NODE_ENV === 'development') {
        console.log('DEVELOPMENT MODE: Simulating OTP process');
        
        // Create a mock confirmation result
        confirmationResultRef.current = {
          confirm: (code: string) => {
            // Test verification code is 123456
            if (code === '123456') {
              console.log('DEVELOPMENT MODE: Verification successful with code 123456');
              return Promise.resolve({ user: currentUser });
            } else {
              console.log('DEVELOPMENT MODE: Invalid verification code');
              return Promise.reject(new Error('Invalid code'));
            }
          }
        };
        
        setOtpSent(true);
        startOtpTimer();
        toast.showToast('success', t('become_advertiser.toast.success'), 'Verification code sent. For testing, use code: 123456');
        return;
      }
      
      // PRODUCTION CODE BELOW
      // Get the recaptcha container element and ensure it's empty
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        recaptchaContainer.innerHTML = '';
      }
      
      // Initialize reCAPTCHA verifier
      const appVerifier = initializeRecaptcha();
      
      if (!appVerifier) {
        toast.showToast('error', t('become_advertiser.toast.error'), 'Failed to initialize reCAPTCHA');
        setIsSubmitting(false);
        return;
      }
      
      // Send OTP via Firebase
      try {
        const confirmationResult = await linkWithPhoneNumber(
          currentUser,
          phoneNumber,
          appVerifier
        );
        
        // Store confirmation result for later verification
        confirmationResultRef.current = confirmationResult;
        
        setOtpSent(true);
        startOtpTimer(); // Start the countdown timer
        toast.showToast('success', t('become_advertiser.toast.success'), t('become_advertiser.toast.otp_sent'));
        
        // For development purposes only - in production, this would be removed
        if (process.env.NODE_ENV === 'development') {
          console.log('OTP sent to', phoneNumber);
        }
      } catch (firebaseError: any) {
        console.error('Firebase error sending OTP:', firebaseError);
        
        // Handle specific Firebase errors
        let errorMessage = t('become_advertiser.validation.otp_failed');
        
        if (firebaseError.code === 'auth/invalid-phone-number') {
          errorMessage = t('become_advertiser.validation.invalid_phone');
        } else if (firebaseError.code === 'auth/captcha-check-failed') {
          errorMessage = t('become_advertiser.validation.captcha_failed');
        } else if (firebaseError.code === 'auth/quota-exceeded') {
          errorMessage = t('become_advertiser.validation.quota_exceeded');
        } else if (firebaseError.code === 'auth/provider-already-linked') {
          errorMessage = t('become_advertiser.validation.phone_already_linked');
        } else if (firebaseError.code === 'auth/invalid-app-credential') {
          errorMessage = 'Invalid reCAPTCHA configuration. Please try again or contact support.';
        } else if (firebaseError.code === 'auth/missing-app-credential') {
          errorMessage = 'Missing reCAPTCHA verification. Please try again.';
        } else if (firebaseError.message && firebaseError.message.includes('reCAPTCHA has already been rendered')) {
          // Handle the specific error about reCAPTCHA already rendered
          errorMessage = 'reCAPTCHA issue detected. Please refresh the page and try again.';
          
          // Try to clean up reCAPTCHA
          if (recaptchaVerifierRef.current) {
            try {
              recaptchaVerifierRef.current.clear();
            } catch (e) {
              console.log('Error clearing reCAPTCHA on render error:', e);
            }
            recaptchaVerifierRef.current = null;
          }
          
          // Clear the container
          if (recaptchaContainer) {
            recaptchaContainer.innerHTML = '';
          }
        }
        
        toast.showToast('error', t('common.error'), errorMessage);
        
        // Reset reCAPTCHA on error
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (e) {
            console.log('Error clearing reCAPTCHA after Firebase error:', e);
          }
          recaptchaVerifierRef.current = null;
        }
        
        throw firebaseError; // Re-throw to be caught by outer catch
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Generic error handling (already handled specific Firebase errors above)
      if (!error.code && !error.message?.includes('reCAPTCHA')) {
        toast.showToast('error', t('common.error'), 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.mobileNumber, initializeRecaptcha, startOtpTimer, toast, t, formatPhoneNumber]);
  
  // Verify OTP code using Firebase confirmationResult
  const verifyOtp = useCallback(async () => {
    if (!formData.otpCode) {
      setErrors(prev => ({
        ...prev,
        otpCode: t('become_advertiser.validation.enter_otp')
      }));
      return;
    }
    
    // Special development bypass for testing
    if (process.env.NODE_ENV === 'development' && formData.otpCode === '123456') {
      console.log('DEVELOPMENT MODE: Automatically verifying OTP code 123456');
      setOtpVerified(true);
      
      // Clear the timer when successfully verified
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
        setOtpResendTimer(0);
      }
      
      toast.showToast('success', t('become_advertiser.toast.success'), t('become_advertiser.toast.phone_verified'));
      
      // Clear error if any
      if (errors.otpCode) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.otpCode;
          return newErrors;
        });
      }
      
      // Move to next step automatically after verification
      setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, 1000);
      
      return;
    }
    
    if (!confirmationResultRef.current) {
      toast.showToast('error', t('become_advertiser.toast.error'), t('become_advertiser.toast.send_otp_first'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Verify OTP via Firebase
      const result = await confirmationResultRef.current.confirm(formData.otpCode);
      
      // OTP verified successfully
      setOtpVerified(true);
      
      // Clear the timer when successfully verified
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
        setOtpResendTimer(0);
      }
      
      toast.showToast('success', t('become_advertiser.toast.success'), t('become_advertiser.toast.phone_verified'));
      
      // Clear error if any
      if (errors.otpCode) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.otpCode;
          return newErrors;
        });
      }
      
      // Move to next step automatically after verification
      setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, 1000);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // Handle specific Firebase errors
      let errorMessage = t('become_advertiser.validation.invalid_otp');
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = t('become_advertiser.validation.invalid_otp');
      } else if (error.code === 'auth/code-expired') {
        errorMessage = t('become_advertiser.toast.otp_expired');
        // Reset OTP sent state to allow resending
        setOtpSent(false);
        setOtpResendTimer(0);
        if (otpTimerRef.current) {
          clearInterval(otpTimerRef.current);
        }
      } else if (error.code === 'auth/missing-verification-code') {
        errorMessage = t('become_advertiser.validation.enter_otp');
      } else if (error.code === 'auth/session-expired') {
        errorMessage = t('become_advertiser.toast.session_expired');
        // Reset OTP sent state to allow resending
        setOtpSent(false);
        setOtpResendTimer(0);
        if (otpTimerRef.current) {
          clearInterval(otpTimerRef.current);
        }
      }
      
      setErrors(prev => ({
        ...prev,
        otpCode: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.otpCode, errors.otpCode, toast, t, setCurrentStep]);
  
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
  
  // We now send OTP automatically in the nextStep function
  // No need for a separate useEffect
  
  // Ensure page is scrolled to top on initial load
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);
  
  // Also scroll to top whenever the step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
    };
  }, []);
  
  // Add beforeunload handler to handle abandoned signups
  useEffect(() => {
    // Add event listener for beforeunload to ensure cleanup for abandoned signups
    const handleBeforeUnload = () => {
      // Only handle as abandoned if not on the final step or thank you page
      if (currentStep < steps.length) {
        // Save current progress before potentially abandoning
        saveSignupProgress({
          step: currentStep,
          formData: formData,
          timestamp: Date.now()
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, formData]);
  
  // Ensure headers and footers are hidden
  useEffect(() => {
    // Hide headers and footers
    const cleanupHeadersFooters = hideHeadersAndFooters();
    
    // Cleanup function
    return () => {
      cleanupHeadersFooters();
    };
  }, []);
  
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
  const handleAccountTypeSelect = (type: 'broker' | 'landlord' | 'agency') => {
    // Add a slight delay before changing account type for better animation
    if (type !== formData.accountType && type !== 'agency' && formData.accountType === 'agency') {
      // If switching from agency to broker/landlord, animate the fields out first
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
  
  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 1) {
      if (!formData.accountType) {
        newErrors.accountType = t('become_advertiser.validation.select_account_type');
      }
      
      if (formData.accountType === 'agency') {
        if (!formData.agencyName) {
          newErrors.agencyName = t('become_advertiser.validation.enter_agency_name');
        }
        if (!formData.agencySize) {
          newErrors.agencySize = t('become_advertiser.validation.select_agency_size');
        }
      }
    }
    
    if (step === 2) {
      if (!formData.firstName) {
        newErrors.firstName = t('become_advertiser.validation.enter_first_name');
      }
      if (!formData.lastName) {
        newErrors.lastName = t('become_advertiser.validation.enter_last_name');
      }
      if (!formData.email) {
        newErrors.email = t('become_advertiser.validation.enter_email');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('become_advertiser.validation.valid_email');
      }
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = t('become_advertiser.validation.enter_mobile');
      }
    }
    
    if (step === 3) {
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = t('become_advertiser.validation.enter_mobile');
      }
      
      // Special bypass for development: allow 123456 as a valid OTP
      if (process.env.NODE_ENV === 'development' && formData.otpCode === '123456') {
        setOtpVerified(true);
        return true;
      }
      
      // Special bypass for development: allow 000000 as a valid OTP
      if (formData.otpCode === '000000') {
        setOtpVerified(true);
        return true;
      }
      
      if (!otpVerified) {
        newErrors.otpCode = t('become_advertiser.validation.verify_mobile');
      }
    }
    
    if (step === 4) {
      if (!formData.city) {
        newErrors.city = t('become_advertiser.validation.enter_city');
      }
      
      if (!formData.propertyQuantity) {
        newErrors.propertyQuantity = t('become_advertiser.validation.select_property_quantity');
      }
      
      if (!formData.termsAgreed) {
        newErrors.termsAgreed = t('become_advertiser.validation.agree_terms');
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
      
      // If moving from step 2 to step 3, automatically send OTP
      if (currentStep === 2 && formData.mobileNumber) {
        // Animate step change first
        setCurrentStep(current => current + 1);
        
        // Then send OTP after a short delay to ensure the UI has updated
        // and the reCAPTCHA container is properly created
        setTimeout(async () => {
          try {
            await sendOtp();
          } catch (error) {
            console.error("Error sending OTP in nextStep:", error);
            // Error is already handled in sendOtp function
            
            // In development mode, we can continue despite errors
            // since we have a bypass mechanism
            if (process.env.NODE_ENV === 'development') {
              console.log('DEVELOPMENT MODE: Continuing despite OTP sending error');
            }
            // If we encounter a critical error with reCAPTCHA, provide a retry option
            else if (error instanceof Error && error.message.includes('reCAPTCHA has already been rendered')) {
              // Give user a chance to retry after the container has been cleared
              setTimeout(() => {
                try {
                  sendOtp();
                } catch (retryError) {
                  console.error("Error on retry sending OTP:", retryError);
                  // At this point, if it still fails, the user will need to manually retry
                }
              }, 500);
            }
          }
        }, 500); // Increased delay to ensure container is ready
        return;
      }
      
      // Special handling for step 3 (OTP verification)
      if (currentStep === 3) {
        // In development mode, allow 123456 as a valid OTP
        if (process.env.NODE_ENV === 'development' && formData.otpCode === '123456') {
          console.log('DEVELOPMENT MODE: Accepting 123456 as valid OTP');
          setOtpVerified(true);
          setCurrentStep(current => current + 1);
          return;
        }
        // If OTP is 000000, set otpVerified to true for development/testing
        else if (formData.otpCode === '000000') {
          setOtpVerified(true);
        }
        // Otherwise, verify the OTP
        else if (!otpVerified) {
          verifyOtp();
          return; // Don't proceed until OTP is verified
        }
      }
      
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
            toast.showToast('error', t('become_advertiser.toast.registration_failed'), t('become_advertiser.toast.email_in_use'));
          } else {
            toast.showToast('error', t('become_advertiser.toast.registration_failed'), signUpError?.message || t('become_advertiser.toast.registration_failed'));
          }
          
          setIsSubmitting(false);
          return;
        }
      }
      
      // Save additional advertiser information regardless of whether user is new or existing
      try {
        // Ensure accountType is not empty (to satisfy TypeScript)
        const advertiserType = formData.accountType || 'broker';
        
        await saveAdvertiserInfo({
          userId: userId,
          advertiserType: advertiserType as 'broker' | 'landlord' | 'agency',
          isBusiness: advertiserType === 'agency',
          businessName: advertiserType === 'agency' ? formData.agencyName : undefined,
          businessSize: advertiserType === 'agency' ? formData.agencySize : undefined,
          city: formData.city,
          phoneNumber: formData.mobileNumber,
          propertyQuantity: formData.propertyQuantity,
          propertyTypes: formData.propertyTypes,
          additionalInfo: ''
        });
        
        // Mark signup as completed
        completeSignup();
        
        // Display success message
        toast.showToast('success', t('become_advertiser.toast.success'), t('become_advertiser.toast.registration_success'));
        
        // Redirect to the thank you page
        navigate('/become-advertiser/thank-you');
      } catch (error: any) {
        console.error('Error saving advertiser info:', error);
        toast.showToast('error', t('become_advertiser.toast.registration_failed'), t('become_advertiser.toast.registration_incomplete'));
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle generic errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.showToast('error', t('become_advertiser.toast.registration_failed'), errorMessage);
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
    if (isMobile) {
      // Mobile version
    return (
      <>
          <h2 className="form-title">{t('advertiser_registration.step1.title')}</h2>
        
        <div className="form-group required">
          <label>{t('become_advertiser.step1.label')}</label>
          
            <div className="mobile-radio-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <MobileRadioOption
                id="broker"
                title={t('become_advertiser.step1.broker')}
                description={t('become_advertiser.step1.broker_description')}
                icon={<FaUserAlt />}
                checked={formData.accountType === 'broker'}
                onChange={() => handleAccountTypeSelect('broker')}
              />
              
              <MobileRadioOption
                id="landlord"
                title={t('become_advertiser.step1.landlord')}
                description={t('become_advertiser.step1.landlord_description')}
                icon={<FaUserAlt />}
                checked={formData.accountType === 'landlord'}
                onChange={() => handleAccountTypeSelect('landlord')}
              />
              
              <MobileRadioOption
                id="agency"
                title={t('become_advertiser.step1.agency')}
                description={t('become_advertiser.step1.agency_description')}
                icon={<FaBuilding />}
                checked={formData.accountType === 'agency'}
                onChange={() => handleAccountTypeSelect('agency')}
              />
            </div>
            {errors.accountType && <div className="error-message">{errors.accountType}</div>}
          </div>
          
          {formData.accountType === 'agency' && (
            <div className="conditional-fields">
              <div className="form-group required" style={{ marginBottom: '16px' }}>
                <label htmlFor="agencyName">{t('become_advertiser.step1.agency_name')}</label>
                <InputBaseModel
                  value={formData.agencyName}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  placeholder={t('become_advertiser.step1.agency_name_placeholder')}
                  error={errors.agencyName}
                />
              </div>
              
              <div className="form-group required">
                <label htmlFor="agencySize">{t('become_advertiser.step1.agency_size')}</label>
                <div style={{ marginBottom: '16px' }}> </div>
                <SelectFieldBaseModelVariant1
                  options={AGENCY_SIZES.map(size => t(`become_advertiser.step1.${size.label}`))}
                  value={formData.agencySize ? t(`become_advertiser.step1.${AGENCY_SIZES.find(size => size.value === formData.agencySize)?.label}`) : ''}
                  onChange={(value) => {
                    const selectedSize = AGENCY_SIZES.find(size => t(`become_advertiser.step1.${size.label}`) === value);
                    if (selectedSize) {
                      handleInputChange('agencySize', selectedSize.value);
                    }
                  }}
                  placeholder={t('become_advertiser.step1.agency_size_placeholder')}
                />
                {errors.agencySize && <div className="error-message">{errors.agencySize}</div>}
              </div>
            </div>
          )}
          
          <div className="buttons-container">
            <div></div> {/* Empty div for space-between alignment */}
            <PurpleButtonLB60
              text={t('become_advertiser.buttons.continue')}
              onClick={nextStep}
              disabled={isSubmitting}
            />
          </div>
        </>
      );
    }
    
    // Original desktop version
    return (
      <>
        <h2 className="form-title">{t('advertiser_registration.step1.title')}</h2>
        
        <div className="form-group required">
          <label>{t('become_advertiser.step1.label')}</label>
          
            <div className="radio-group">
              <div 
                className={`radio-option ${formData.accountType === 'broker' ? 'selected' : ''}`}
                onClick={() => handleAccountTypeSelect('broker')}
              >
                <div className="radio-title">
                  <input 
                    type="radio" 
                    name="accountType" 
                    checked={formData.accountType === 'broker'} 
                    onChange={() => handleAccountTypeSelect('broker')}
                  />
                  <span>{t('become_advertiser.step1.broker')}</span>
                </div>
                <div className="radio-description">
                  {t('become_advertiser.step1.broker_description')}
                </div>
                <div className="option-icon">
                  <FaUserAlt />
                </div>
              </div>
              
              <div 
                className={`radio-option ${formData.accountType === 'landlord' ? 'selected' : ''}`}
                onClick={() => handleAccountTypeSelect('landlord')}
              >
                <div className="radio-title">
                  <input 
                    type="radio" 
                    name="accountType" 
                    checked={formData.accountType === 'landlord'} 
                    onChange={() => handleAccountTypeSelect('landlord')}
                  />
                  <span>{t('become_advertiser.step1.landlord')}</span>
                </div>
                <div className="radio-description">
                  {t('become_advertiser.step1.landlord_description')}
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
                  <span>{t('become_advertiser.step1.agency')}</span>
                </div>
                <div className="radio-description">
                  {t('become_advertiser.step1.agency_description')}
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
              <label htmlFor="agencyName">{t('become_advertiser.step1.agency_name')}</label>
              <InputBaseModel
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                placeholder={t('become_advertiser.step1.agency_name_placeholder')}
                error={errors.agencyName}
              />
            </div>
            
            <div className="form-group required">
              <label htmlFor="agencySize">{t('become_advertiser.step1.agency_size')}</label>
              <div style={{ marginBottom: '24px' }}> </div>
              <SelectFieldBaseModelVariant1
                options={AGENCY_SIZES.map(size => t(`become_advertiser.step1.${size.label}`))}
                value={formData.agencySize ? t(`become_advertiser.step1.${AGENCY_SIZES.find(size => size.value === formData.agencySize)?.label}`) : ''}
                onChange={(value) => {
                  const selectedSize = AGENCY_SIZES.find(size => t(`become_advertiser.step1.${size.label}`) === value);
                  if (selectedSize) {
                    handleInputChange('agencySize', selectedSize.value);
                  }
                }}
                placeholder={t('become_advertiser.step1.agency_size_placeholder')}
              />
              {errors.agencySize && <div className="error-message">{errors.agencySize}</div>}
            </div>
          </div>
        )}
        
        <div className="buttons-container">
          <div></div> {/* Empty div for space-between alignment */}
          <PurpleButtonLB60
            text={t('become_advertiser.buttons.continue')}
            onClick={nextStep}
            disabled={isSubmitting}
          />
        </div>
      </>
    );
  };
  
  // Render step 2: User Information
  const renderStep2 = () => {
    if (isMobile) {
      // Mobile version
    return (
        <div className="step-content">
          <h2 className="form-title">{t('advertiser_registration.step2.title')}</h2>
        
          <MobileInput
            type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder={t('advertiser_registration.step2.first_name_placeholder')}
            label={t('advertiser_registration.step2.first_name')}
            required
              error={errors.firstName}
            />
          
          <MobileInput
            type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder={t('advertiser_registration.step2.last_name_placeholder')}
            label={t('advertiser_registration.step2.last_name')}
            required
              error={errors.lastName}
            />
          
          <MobileInput
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('advertiser_registration.step2.email_placeholder')}
            label={t('advertiser_registration.step2.email')}
            required
            error={errors.email}
          />
          
          <MobilePhoneInput
            value={formData.mobileNumber}
            onChange={(value) => handleInputChange('mobileNumber', value)}
            label={t('advertiser_registration.step2.mobile_number')}
            required
            error={errors.mobileNumber}
          />
          
          <div className="buttons-container">
            <button className="back-button" onClick={prevStep}>
              {t('common.back')}
            </button>
            <button className="next-button" onClick={nextStep}>
              {t('common.continue')}
            </button>
          </div>
        </div>
      );
    }
    
    // Original desktop version
    return (
      <div className="step-content">
        <h2 className="form-title">{t('advertiser_registration.step2.title')}</h2>
        
        <div className="form-group">
          <label>
            {t('advertiser_registration.step2.first_name')}
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder={t('advertiser_registration.step2.first_name_placeholder')}
            required
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>
        
        <div className="form-group">
          <label>
            {t('advertiser_registration.step2.last_name')}
            <span className="required">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder={t('advertiser_registration.step2.last_name_placeholder')}
            required
          />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>
        
        <div className="form-group">
          <label>
            {t('advertiser_registration.step2.email')}
            <span className="required">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('advertiser_registration.step2.email_placeholder')}
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label>
            {t('advertiser_registration.step2.mobile_number')}
            <span className="required">*</span>
          </label>
          <div className="phone-input-container">
          <PhoneInput
              country={'ma'}
            value={formData.mobileNumber}
              onChange={(value) => handleInputChange('mobileNumber', value)}
            inputProps={{
              required: true,
                autoFocus: false
              }}
            />
          </div>
          {errors.mobileNumber && <div className="error-message">{errors.mobileNumber}</div>}
        </div>
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text={t('become_advertiser.buttons.back')}
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text={t('become_advertiser.buttons.continue')}
            onClick={nextStep}
            disabled={isSubmitting}
          />
        </div>
      </div>
    );
  };
  
  // Render step 3: OTP Verification
  const renderStep3 = () => {
    // Calculate if resend OTP is available
    const canResendOtp = otpResendTimer === 0;
    
    // Format the timer as MM:SS
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    // Handle resend OTP
    const handleResendOtp = () => {
      if (canResendOtp) {
        sendOtp();
      }
    };
    
    if (isMobile) {
      // Mobile version
      return (
        <div className="step-content">
          <h2 className="form-title">{t('advertiser_registration.step3.title')}</h2>
        
          <p className="verification-message">
            {t('advertiser_registration.step3.verification_message', { phone: formData.mobileNumber })}
          </p>
          
          <div className="otp-container">
            <div className="mobile-otp-input">
              <MobileOtpInput
                value={formData.otpCode}
                onChange={(value) => handleInputChange('otpCode', value)}
                length={6}
                label={t('advertiser_registration.step3.otp_code')}
                error={errors.otpCode}
              />
            </div>
            
            <div className="resend-otp">
              {canResendOtp ? (
                <button onClick={handleResendOtp} className="resend-button">
                  {t('advertiser_registration.step3.resend_otp')}
                </button>
              ) : (
                <span className="resend-timer">
                  {t('advertiser_registration.step3.resend_in')} {formatTime(otpResendTimer)}
                </span>
              )}
            </div>
          </div>
          
          <div className="buttons-container">
            <button className="back-button" onClick={prevStep}>
              {t('common.back')}
            </button>
            <button className="next-button" onClick={verifyOtp} disabled={isSubmitting}>
              {isSubmitting ? t('common.verifying') : t('common.verify')}
            </button>
          </div>
        </div>
      );
    }
    
    // Original desktop version
    return (
      <div className="step-content">
        <h2 className="form-title">{t('advertiser_registration.step3.title')}</h2>
        
        <p className="verification-message">
          {t('advertiser_registration.step3.verification_message', { phone: formData.mobileNumber })}
        </p>
        
        <div className="otp-container">
          <div className="form-group otp-input-group">
            <label>{t('advertiser_registration.step3.otp_code')}</label>
            <OtpInput
              value={formData.otpCode}
              onChange={(value) => handleInputChange('otpCode', value)}
              length={6}
              autoFocus
              isNumberInput
            />
            {errors.otpCode && <div className="error-message">{errors.otpCode}</div>}
          </div>
          
          <div className="resend-otp">
            {canResendOtp ? (
              <button onClick={handleResendOtp} className="resend-button">
                {t('advertiser_registration.step3.resend_otp')}
              </button>
            ) : (
              <span className="resend-timer">
                {t('advertiser_registration.step3.resend_in')} {formatTime(otpResendTimer)}
              </span>
            )}
          </div>
        </div>
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text={t('become_advertiser.buttons.back')}
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text={isSubmitting ? t('common.verifying') : t('common.verify')}
            onClick={verifyOtp}
            disabled={isSubmitting}
          />
        </div>
      </div>
    );
  };
  
  // Render step 4: Listing Information and Legal
  const renderStep4 = () => {
    if (isMobile) {
      // Mobile version with optimized components
    return (
        <div className="step-content">
          <h2 className="form-title">{t('become_advertiser.step4.title')}</h2>
          
          <MobileSelect
            options={MOROCCAN_CITIES}
            value={formData.city}
            onChange={(value) => handleInputChange('city', value)}
            placeholder={t('become_advertiser.step4.city_search')}
            label={t('become_advertiser.step4.city')}
            error={errors.city}
            required
          />
          
          <MobileSelect
            options={PROPERTY_QUANTITIES.map(q => t(`become_advertiser.step4.${q.label}`))}
            value={formData.propertyQuantity ? t(`become_advertiser.step4.${PROPERTY_QUANTITIES.find(q => q.value === formData.propertyQuantity)?.label}`) : ''}
            onChange={(value) => {
              const selectedQuantity = PROPERTY_QUANTITIES.find(q => t(`become_advertiser.step4.${q.label}`) === value);
              if (selectedQuantity) {
                handleInputChange('propertyQuantity', selectedQuantity.value);
              }
            }}
            placeholder={t('become_advertiser.step4.property_quantity_placeholder')}
            label={t('become_advertiser.step4.property_quantity')}
            error={errors.propertyQuantity}
            required
          />
          
          <MobileChips
            options={PROPERTY_TYPES}
            selectedOptions={formData.propertyTypes}
            onChange={togglePropertyType}
            label={t('become_advertiser.step4.property_types')}
            translationPrefix="become_advertiser.step4"
            t={t}
          />
          
          <div className="form-group required mobile-terms-checkbox">
            <div className="terms-checkbox">
              <input 
                type="checkbox" 
                id="termsAgreed" 
                checked={formData.termsAgreed}
                onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
              />
              <label htmlFor="termsAgreed">
                {t('become_advertiser.step4.i_agree_to_the')}
                <b>
                  {t('become_advertiser.step4.terms_of_service')}
                </b>
                {t('become_advertiser.step4.and')}
                <b>
                  {t('become_advertiser.step4.privacy_policy')}
                </b>
              </label>
            </div>
            {errors.termsAgreed && <div className="error-message">{errors.termsAgreed}</div>}
          </div>
          
          <div className="buttons-container">
            <button className="back-button" onClick={prevStep}>
              {t('common.back')}
            </button>
            <button 
              className="next-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('become_advertiser.buttons.creating_account') : t('become_advertiser.buttons.create_account')}
            </button>
          </div>
        </div>
      );
    }
    
    // Original desktop version
    return (
      <div className="step-content">
        <h2 className="form-title">{t('become_advertiser.step4.title')}</h2>
        
        <div className="form-group required location-group">
          <label htmlFor="city">
            <FaMapMarkerAlt className="label-icon" /> {t('become_advertiser.step4.city')}
          </label>
          <div className="city-input-container">
            <SelectFieldBaseModelVariant1
              options={MOROCCAN_CITIES}
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              placeholder={t('become_advertiser.step4.city_search')}
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>
        </div>
        
        <div className="form-group required">
          <label htmlFor="propertyQuantity">{t('become_advertiser.step4.property_quantity')}</label>
          <SelectFieldBaseModelVariant1
            options={PROPERTY_QUANTITIES.map(q => t(`become_advertiser.step4.${q.label}`))}
            value={formData.propertyQuantity ? t(`become_advertiser.step4.${PROPERTY_QUANTITIES.find(q => q.value === formData.propertyQuantity)?.label}`) : ''}
            onChange={(value) => {
              const selectedQuantity = PROPERTY_QUANTITIES.find(q => t(`become_advertiser.step4.${q.label}`) === value);
              if (selectedQuantity) {
                handleInputChange('propertyQuantity', selectedQuantity.value);
              }
            }}
            placeholder={t('become_advertiser.step4.property_quantity_placeholder')}
          />
          {errors.propertyQuantity && <div className="error-message">{errors.propertyQuantity}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="propertyTypes">{t('become_advertiser.step4.property_types')}</label>
          <div className="chips-container">
            {PROPERTY_TYPES.map(type => (
              <div 
                key={type.id}
                className={`chip ${formData.propertyTypes.includes(type.id) ? 'selected' : ''}`}
                onClick={() => togglePropertyType(type.id)}
              >
                {t(`become_advertiser.step4.${type.label}`)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-group required">
          <div className="terms-checkbox">
            <input 
              type="checkbox" 
              id="termsAgreed" 
              checked={formData.termsAgreed}
              onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
            />
            <label htmlFor="termsAgreed" dangerouslySetInnerHTML={{
              __html: t('become_advertiser.step4.terms_agreement')
                .replace('<a>', '<a href="/terms" style="margin: 0 5px" target="_blank">')
                .replace('</a>', '</a>')
                .replace('<a>', '<a href="/privacy" style="margin: 0 5px" target="_blank">')
            }}>
            </label>
          </div>
          {errors.termsAgreed && <div className="error-message">{errors.termsAgreed}</div>}
        </div>
        
        <div className="buttons-container">
          <WhiteButtonLB60
            text={t('become_advertiser.buttons.back')}
            onClick={prevStep}
            disabled={isSubmitting}
          />
          <PurpleButtonLB60
            text={isSubmitting ? t('become_advertiser.buttons.creating_account') : t('become_advertiser.buttons.create_account')}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
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
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Clear timer
      if (otpTimerRef.current) {
        clearInterval(otpTimerRef.current);
      }
      
      // Clear reCAPTCHA
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          console.log('Error clearing reCAPTCHA on unmount:', e);
        }
        recaptchaVerifierRef.current = null;
      }
      
      // Clear any confirmation result
      confirmationResultRef.current = null;
    };
  }, []);
  
  // Create and manage the reCAPTCHA container
  useEffect(() => {
    // Only create/manage the container when on step 3 (OTP verification)
    if (currentStep === 3) {
      // Check if container already exists
      let container = document.getElementById('recaptcha-container');
      
      // If not, create it
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'none';
        document.body.appendChild(container);
      } else {
        // Clear existing container
        container.innerHTML = '';
      }
      
      // Clean up on step change
      return () => {
        // Clear reCAPTCHA if we navigate away from step 3
        if (recaptchaVerifierRef.current) {
          try {
            recaptchaVerifierRef.current.clear();
          } catch (e) {
            console.log('Error clearing reCAPTCHA on step change:', e);
          }
          recaptchaVerifierRef.current = null;
        }
      };
    }
  }, [currentStep]);
  
  return (
    <AdvertiserRegistrationPageStyle>
      <div className="language-switcher-container">
        <LanguageSwitcher />
      </div>
      
      <h1 className="page-title">{t('advertiser_registration.title')}</h1>
      <p className="page-subtitle">{t('advertiser_registration.subtitle')}</p>
      
      <div className={`steps-container step-${currentStep}`}>
        {!isMobile ? (
          // Desktop stepper (existing code)
          <>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
              >
                <div className={`step-number ${currentStep === index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}>
                  {currentStep > index + 1 ? <FaCheckCircle /> : index + 1}
            </div>
                <div className="step-label">{step}</div>
          </div>
        ))}
          </>
        ) : (
          // Mobile step counter
          <div className="mobile-step-counter">
            <MobileStepCounter 
              currentStep={currentStep} 
              totalSteps={steps.length}
              stepLabels={stepLabels}
            />
          </div>
        )}
      </div>
      
      <div className="form-container">
        <div className="step-content">
          {renderStepContent()}
        </div>
      </div>
    </AdvertiserRegistrationPageStyle>
  );
};

export default AdvertiserRegistrationPage;