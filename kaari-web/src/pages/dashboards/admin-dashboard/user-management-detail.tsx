import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaUserTie, 
  FaBuilding,
  FaHome,
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaArrowLeft,
  FaIdCard,
  FaMapMarkerAlt,
  FaGlobe,
  FaCheck,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { PageContainer, PageHeader, GlassCard } from '../../../components/admin/AdminUI';
import { Button, StatusBadge } from './styles';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

// Mock data for testing
const mockUser = {
  id: 'user123',
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  profilePicture: '',
  phone: '+1234567890',
  role: 'advertiser',
  advertiserType: 'broker',
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockAdvertiserData = {
  companyName: "Example Company",
  businessRegistrationNumber: "BRN123456789",
  taxIdentificationNumber: "TIN987654321",
  licenseNumber: "LIC-ABC-123",
  yearsInBusiness: "5",
  numberOfProperties: "10",
  referralSource: "Website",
  idVerified: true,
  additionalInfo: "This is mock data for testing purposes.",
  createdAt: new Date(),
  updatedAt: new Date()
};

const BackButton = styled(Button)`
  margin-right: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: ${Theme.colors.gray}30;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 600;
    color: ${Theme.colors.primary};
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  
  .user-info {
    h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }
    
    .user-type {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      color: ${Theme.colors.gray};
      
      svg {
        color: ${props => 
          props.role === 'admin' 
            ? Theme.colors.error
            : props.role === 'advertiser'
              ? Theme.colors.secondary
              : Theme.colors.success
        };
      }
    }
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${Theme.colors.primary}10;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${Theme.colors.primary};
    }
    
    .content {
      flex: 1;
      
      .label {
        font-size: 0.875rem;
        color: ${Theme.colors.gray};
        margin-bottom: 0.25rem;
      }
      
      .value {
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${Theme.colors.gray}30;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.25rem;
  }
  
  &.verified {
    color: ${Theme.colors.success};
  }
  
  &.not-verified {
    color: ${Theme.colors.error};
  }
  
  &.pending {
    color: ${Theme.colors.warning};
  }
`;

const AdvertiserInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
  
  .info-box {
    background-color: ${Theme.colors.gray}10;
    border-radius: 8px;
    padding: 1rem;
    
    .label {
      font-size: 0.875rem;
      color: ${Theme.colors.gray};
      margin-bottom: 0.5rem;
    }
    
    .value {
      font-size: 1rem;
      font-weight: 500;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${Theme.colors.gray};
`;

const UserManagementDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [advertiserData, setAdvertiserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // For now, use mock data
    setTimeout(() => {
      setUser(mockUser);
      if (mockUser.role === 'advertiser') {
        setAdvertiserData(mockAdvertiserData);
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleBack = () => {
    navigate('/dashboard/admin/users-management');
  };

  // Format date for display
  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Get user icon based on role
  const getUserIcon = (user: any) => {
    switch (user.role) {
      case 'admin':
        return <FaUserTie />;
      case 'advertiser':
        return <FaUserTie />;
      default:
        return <FaUser />;
    }
  };

  // Get advertiser type icon and text
  const getAdvertiserTypeInfo = (user: any) => {
    if (user.role !== 'advertiser') return { icon: null, text: 'N/A' };
    
    switch (user.advertiserType) {
      case 'broker':
        return { icon: <FaUserTie />, text: 'Broker' };
      case 'landlord':
        return { icon: <FaHome />, text: 'Landlord' };
      case 'agency':
        return { icon: <FaBuilding />, text: 'Agency' };
      default:
        return { icon: null, text: 'N/A' };
    }
  };

  // Render verification status
  const renderVerificationStatus = (isVerified: boolean | undefined) => {
    if (isVerified === undefined) {
      return (
        <StatusContainer className="pending">
          <FaExclamationTriangle />
          <span>Pending</span>
        </StatusContainer>
      );
    }
    
    return isVerified ? (
      <StatusContainer className="verified">
        <FaCheck />
        <span>Verified</span>
      </StatusContainer>
    ) : (
      <StatusContainer className="not-verified">
        <FaTimes />
        <span>Not Verified</span>
      </StatusContainer>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="User Details" />
        <GlassCard>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Users
          </BackButton>
          <LoadingState>Loading user data...</LoadingState>
        </GlassCard>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <PageHeader title="User Not Found" />
        <GlassCard>
          <BackButton onClick={handleBack}>
            <FaArrowLeft /> Back to Users
          </BackButton>
          <p>The requested user could not be found.</p>
        </GlassCard>
      </PageContainer>
    );
  }

  const advertiserTypeInfo = getAdvertiserTypeInfo(user);

  return (
    <PageContainer>
      <PageHeader title="User Details" />
      <GlassCard>
        <DetailContainer>
          {/* User Profile Section */}
          <ProfileSection>
            <ProfileHeader role={user.role}>
              <div className="avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  user.name?.charAt(0) || user.email.charAt(0).toUpperCase()
                )}
              </div>
              <div className="user-info">
                <h2>{user.name} {user.surname}</h2>
                <div className="user-type">
                  {getUserIcon(user)}
                  {user.role === 'admin' ? 'Admin' : user.role === 'advertiser' ? 'Advertiser' : 'Client'}
                  {user.role === 'advertiser' && advertiserTypeInfo.icon && (
                    <>
                      <span style={{ margin: '0 0.5rem' }}>•</span>
                      {advertiserTypeInfo.icon}
                      {advertiserTypeInfo.text}
                    </>
                  )}
                </div>
              </div>
            </ProfileHeader>
            
            <SectionTitle>Basic Information</SectionTitle>
            <InfoList>
              <div className="info-item">
                <div className="icon">
                  <FaEnvelope />
                </div>
                <div className="content">
                  <div className="label">Email</div>
                  <div className="value">{user.email}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon">
                  <FaPhone />
                </div>
                <div className="content">
                  <div className="label">Phone</div>
                  <div className="value">{user.phone || 'Not provided'}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon">
                  <FaCalendarAlt />
                </div>
                <div className="content">
                  <div className="label">Joined</div>
                  <div className="value">{formatDate(user.createdAt)}</div>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon">
                  <FaIdCard />
                </div>
                <div className="content">
                  <div className="label">User ID</div>
                  <div className="value">{user.id}</div>
                </div>
              </div>
              
              {user.address && (
                <div className="info-item">
                  <div className="icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="content">
                    <div className="label">Address</div>
                    <div className="value">{user.address}</div>
                  </div>
                </div>
              )}
              
              {user.website && (
                <div className="info-item">
                  <div className="icon">
                    <FaGlobe />
                  </div>
                  <div className="content">
                    <div className="label">Website</div>
                    <div className="value">{user.website}</div>
                  </div>
                </div>
              )}
            </InfoList>
          </ProfileSection>
          
          {/* Advertiser Data Section (only for advertisers) */}
          {user.role === 'advertiser' && (
            <ProfileSection>
              <SectionTitle>Advertiser Information</SectionTitle>
              
              {advertiserData ? (
                <>
                  <InfoList>
                    <div className="info-item">
                      <div className="icon">
                        <FaBuilding />
                      </div>
                      <div className="content">
                        <div className="label">Company Name</div>
                        <div className="value">{advertiserData.companyName || 'Not provided'}</div>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <div className="icon">
                        <FaIdCard />
                      </div>
                      <div className="content">
                        <div className="label">ID Verification</div>
                        <div className="value">
                          {renderVerificationStatus(advertiserData.idVerified)}
                        </div>
                      </div>
                    </div>
                  </InfoList>
                  
                  <AdvertiserInfoGrid>
                    {advertiserData.businessRegistrationNumber && (
                      <div className="info-box">
                        <div className="label">Business Registration Number</div>
                        <div className="value">{advertiserData.businessRegistrationNumber}</div>
                      </div>
                    )}
                    
                    {advertiserData.taxIdentificationNumber && (
                      <div className="info-box">
                        <div className="label">Tax Identification Number</div>
                        <div className="value">{advertiserData.taxIdentificationNumber}</div>
                      </div>
                    )}
                    
                    {advertiserData.licenseNumber && (
                      <div className="info-box">
                        <div className="label">License Number</div>
                        <div className="value">{advertiserData.licenseNumber}</div>
                      </div>
                    )}
                    
                    {advertiserData.yearsInBusiness && (
                      <div className="info-box">
                        <div className="label">Years in Business</div>
                        <div className="value">{advertiserData.yearsInBusiness}</div>
                      </div>
                    )}
                    
                    {advertiserData.numberOfProperties && (
                      <div className="info-box">
                        <div className="label">Number of Properties</div>
                        <div className="value">{advertiserData.numberOfProperties}</div>
                      </div>
                    )}
                    
                    {advertiserData.referralSource && (
                      <div className="info-box">
                        <div className="label">Referral Source</div>
                        <div className="value">{advertiserData.referralSource}</div>
                      </div>
                    )}
                  </AdvertiserInfoGrid>
                  
                  {advertiserData.additionalInfo && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="label">Additional Information</div>
                      <div style={{ 
                        padding: '1rem', 
                        backgroundColor: `${Theme.colors.gray}10`,
                        borderRadius: '8px',
                        marginTop: '0.5rem'
                      }}>
                        {advertiserData.additionalInfo}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>No advertiser signup data available.</p>
              )}
            </ProfileSection>
          )}
        </DetailContainer>
      </GlassCard>
    </PageContainer>
  );
};

export default UserManagementDetailPage; 