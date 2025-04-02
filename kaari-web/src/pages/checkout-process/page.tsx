import React from 'react';
import { CheckoutProcessStyle } from './styles';
import SelectFieldDatePicker from '../../components/skeletons/inputs/select-fields/select-field-date-picker';
import { PurpleButtonMB48 } from '../../components/skeletons/buttons/purple_MB48';
import Logo from '../../assets/images/purpleLogo.svg';
import InputBaseModel from '../../components/skeletons/inputs/input-fields/input-variant';
import UploadFieldModel from '../../components/skeletons/inputs/upload-fields/upload-field-variant';
import { CheckoutCard } from '../../components/skeletons/cards/checkout-card';
import PropertyImage from '../../assets/images/livingRoomExample.png';
import ProfileImage from '../../assets/images/ProfilePicture.png';
import SelectFieldBaseModelVariant1 from '../../components/skeletons/inputs/select-fields/select-field-base-model';
import CheckoutProgressBar from '../../components/skeletons/banners/status/banner-checkout-progressbar';
import { WhiteHeaderUsers } from '../../components/skeletons/constructed/headers/header-users-white';


const CheckoutProcess: React.FC = () => {
    return (
        <>

        <WhiteHeaderUsers user={true} />
        
        <CheckoutProcessStyle>
            
            <div className="checkout-process-header">
                <img src={Logo} alt="Kaari Logo" />
                <CheckoutProgressBar currentStep={1} />
            </div>
            
            <div className="checkout-process-content">
                <div className="checkout-process-form">
                    <div className="checkout-process-form-title">
                        Your Information
                    </div>
                    
                    <div className="form-container">
                        <div className="form-group">
                            <InputBaseModel    
                                title="First Name" 
                                placeholder="Enter your first name" 
                            />
                            <InputBaseModel 
                                title="Email" 
                                placeholder="Enter your email" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <InputBaseModel 
                                title="Last Name" 
                                placeholder="Enter your last name" 
                            />
                            <InputBaseModel 
                                title="Phone Number" 
                                placeholder="Enter your phone number" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <InputBaseModel 
                                title="Address" 
                                placeholder="Enter your address" 
                            />
                        </div>
                        
                        <div className="date-of-birth-container">
                            <SelectFieldDatePicker 
                                label="Date of Birth"
                            />
                            
                        </div>
                        
                        
                        <div className="government-id-container">
                            <UploadFieldModel 
                                label="ID Type" 
                            />
                            <UploadFieldModel 
                                label="ID Number" 
                            />
                        </div>

                        <div className="date-of-birth-container">
                            <SelectFieldBaseModelVariant1
                                label="ID Type"
                                options={["Passport", "Driver's License", "National ID"]}
                            />
                            
                        </div>
                    </div>
                    
                    <div className="button-container">
                        <PurpleButtonMB48 text="Continue to Payment" />
                    </div>
                </div>

                <div className="checkout-process-property-card">
                    <CheckoutCard 
                        title="Property Name"
                        image={PropertyImage}
                        moveInDate="2023-01-01"
                        lengthOfStay="1 month"
                        profileImage={ProfileImage}
                        profileName="John Doe"
                        monthlyRent="1000"
                        securityDeposit="1000"
                        serviceFee="1000"
                        total="1000"
                        
                    
                    />
                </div>
            </div>
        </CheckoutProcessStyle>
        </>
    );
};

export default CheckoutProcess;
