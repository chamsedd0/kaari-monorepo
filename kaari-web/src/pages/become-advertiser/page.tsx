import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { AdvertiserRegistrationPageStyle } from './styles';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import TextAreaBaseModel from '../../components/skeletons/inputs/input-fields/textarea-variant';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model-variant-1';
import { PurpleButtonLB60 } from '../../components/skeletons/buttons/purple_LB60';
import { WhiteButtonLB60 } from '../../components/skeletons/buttons/white_LB60';
import { FaCheckCircle, FaUserAlt, FaBuilding, FaGoogle, FaPhoneAlt, FaShieldAlt, FaArrowRight, FaAngleLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useStore } from '../../backend/store';
import { useToastService } from '../../services/ToastService';
import { Theme } from '../../theme/theme';
import { saveAdvertiserInfo, getOrCreateUserDocument } from '../../backend/firebase/auth';
import otpService from '../../services/OtpService';
import OtpInput from '../../components/checkout/input-fields/OtpInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import LanguageSwitcher from '../../components/skeletons/language-switcher/language-switcher';
import { 
  saveSignupProgress, 
  getSignupProgress, 
  clearSignupProgress, 
  startSignup, 
  completeSignup,
  AdvertiserSignupData 
} from '../../utils/advertiser-signup';

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

const BecomeAdvertiserPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastService();
  const signUp = useStore(state => state.signUp);
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const user = useStore(state => state.user);
  
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
  
  // Send OTP code
  const sendOtp = useCallback(async () => {
    if (!formData.mobileNumber) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: t('become_advertiser.validation.enter_mobile')
      }));
      return;
    }
    
    // No need to check format as the PhoneInput component handles formatting
    // Just ensure it's not empty, which we already checked
    
    setIsSubmitting(true);
    
    try {
      // Use the OTP service to send the OTP
      const response = await otpService.sendOtp(formData.mobileNumber);
      
      if (response.success) {
        setOtpSent(true);
        startOtpTimer(); // Start the countdown timer
        toast.showToast('success', t('become_advertiser.toast.success'), t('become_advertiser.toast.otp_sent'));
        
        // For development purposes only - in production, this would be removed
        if (process.env.NODE_ENV === 'development') {
          // Generate a fallback OTP for local testing
          const fallbackOtp = generateOTP();
          console.log(`Fallback OTP for development: ${fallbackOtp}`);
          localStorage.setItem('demo_otp', fallbackOtp);
        }
      } else {
        toast.showToast('error', 'Error', response.message || t('become_advertiser.toast.otp_failed'));
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.showToast('error', 'Error', t('become_advertiser.toast.otp_failed'));
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        // Generate a fallback OTP for local testing
        const fallbackOtp = generateOTP();
        console.log(`Fallback OTP for development: ${fallbackOtp}`);
        localStorage.setItem('demo_otp', fallbackOtp);
        
        setOtpSent(true);
        startOtpTimer();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.mobileNumber, generateOTP, startOtpTimer, toast, t]);
  
  // Verify OTP code
  const verifyOtp = useCallback(async () => {
    if (!formData.otpCode) {
      setErrors(prev => ({
        ...prev,
        otpCode: 'Please enter the OTP code'
      }));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the OTP service to verify the OTP
      const response = await otpService.verifyOtp(formData.mobileNumber, formData.otpCode);
      
      if (response.success) {
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
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      // Fallback for development
      if (process.env.NODE_ENV === 'development') {
        // For development, check against the stored OTP in localStorage
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
      } else {
        toast.showToast('error', 'Error', 'Failed to verify OTP. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.otpCode, formData.mobileNumber, errors.otpCode, toast, otpTimerRef]);
  
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
        // Set a small timeout to ensure the state is updated before sending OTP
        setTimeout(() => {
          sendOtp();
        }, 300);
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
    return (
      <>
        <h2 className="form-title">{t('become_advertiser.step1.title')}</h2>
        
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
    return (
      <>
        <h2 className="form-title">{t('become_advertiser.step2.title')}</h2>
        
        <div className="form-row">
          <div className="form-group required">
            <label htmlFor="firstName">{t('become_advertiser.step2.first_name')}</label>
            <InputBaseModel
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder={t('become_advertiser.step2.first_name_placeholder')}
              error={errors.firstName}
            />
          </div>
          
          <div className="form-group required">
            <label htmlFor="lastName">{t('become_advertiser.step2.last_name')}</label>
            <InputBaseModel
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder={t('become_advertiser.step2.last_name_placeholder')}
              error={errors.lastName}
            />
          </div>
        </div>
        
        <div className="form-group required">
          <label htmlFor="email">{t('become_advertiser.step2.email')}</label>
          <InputBaseModel
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder={t('become_advertiser.step2.email_placeholder')}
            // Using text type as email is not supported
            type="text"
            error={errors.email}
          />
        </div>
        
        <div className="form-group required">
          <label htmlFor="mobileNumber">
            <FaPhoneAlt className="label-icon" /> {t('become_advertiser.step2.mobile_number')}
          </label>
          <PhoneInput
            country={'ma'} // Morocco as default
            value={formData.mobileNumber}
            onChange={(phone) => handleInputChange('mobileNumber', phone)}
            inputProps={{
              name: 'mobileNumber',
              required: true,
              autoFocus: true
            }}
            containerClass="phone-input-container"
            inputClass="phone-input"
            buttonClass="phone-dropdown-button"
            preferredCountries={['ma']}
            enableSearch={false}
            disableSearchIcon={true}
            masks={{ma: '.. .. .. .. ..'}} // Format for Morocco: 06 XX XX XX XX
            placeholder={t('become_advertiser.step2.mobile_placeholder')}
            specialLabel=""
          />
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
      </>
    );
  };
  
  // Render step 3: OTP Verification
  const renderStep3 = () => {
    return (
      <>
        <h2 className="form-title">{t('become_advertiser.step3.title')}</h2>
        
        <div className="form-step-content">
          <div className="form-group required otp-group">
            <div className="otp-verification-container">
              <h3 className="otp-title">{t('become_advertiser.step3.verify')}</h3>
              <p className="otp-subtitle">{t('become_advertiser.step3.code_sent')} {formData.mobileNumber}</p>
              
              <OtpInput
                length={6}
                value={formData.otpCode}
                onChange={(value) => handleInputChange('otpCode', value)}
                autoFocus={true}
                isNumberInput={true}
                disabled={isSubmitting}
              />
              
              <button 
                className="verify-button"
                onClick={verifyOtp}
                disabled={isSubmitting || !formData.otpCode || formData.otpCode.length < 6}
              >
                {t('become_advertiser.step3.verify_button')}
              </button>
              
              <div className="otp-resend">
                {t('become_advertiser.step3.no_code')} <button 
                  className="resend-link" 
                  onClick={sendOtp}
                  disabled={isSubmitting || otpResendTimer > 0}
                >
                  {otpResendTimer > 0 ? t('become_advertiser.step3.request_timer', { seconds: otpResendTimer }) : t('become_advertiser.step3.request_again')}
                </button>
              </div>
              
              {otpVerified && (
                <div className="verified-badge">
                  <FaCheckCircle /> {t('become_advertiser.step3.verification_success')}
                </div>
              )}
            </div>
            {errors.otpCode && <div className="error-message">{errors.otpCode}</div>}
          </div>
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
            disabled={isSubmitting || !otpVerified}
          />
        </div>
      </>
    );
  };
  
  // Render step 4: Listing Information and Legal
  const renderStep4 = () => {
    return (
      <>
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
    <AdvertiserRegistrationPageStyle>
      <div className="page-title">{t('become_advertiser.title')}</div>
      <div className="page-subtitle">{t('become_advertiser.subtitle')}</div>
      
      <div className="steps-container">
        {[1, 2, 3, 4].map(step => (
          <div className="step" key={step}>
            <div 
              className={`step-number ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              {currentStep > step ? <FaCheckCircle /> : step}
            </div>
            <div 
              className={`step-label ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              {t(`become_advertiser.step${step}.label`)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="form-container">
        <div className="step-content">
          {renderStepContent()}
        </div>
      </div>
    </AdvertiserRegistrationPageStyle>
  );
};

export default BecomeAdvertiserPage;