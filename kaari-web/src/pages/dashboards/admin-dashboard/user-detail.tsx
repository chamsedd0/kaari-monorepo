import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaUserTie, 
  FaUserCog, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaGlobe, 
  FaLanguage, 
  FaBan, 
  FaTrash, 
  FaUnlock, 
  FaArrowLeft, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaIdCard
} from 'react-icons/fa';
import { PageContainer, PageHeader, GlassCard, PrimaryButton, SecondaryButton, IconButton } from '../../../components/admin/AdminUI';
import { Button, StatusBadge, FormGroup, Label, Input, Select, TextArea } from './styles';
import { 
  getUserById, 
  blockUser, 
  unblockUser, 
  updateUser 
} from '../../../backend/server-actions/UserServerActions';
import { deleteDocument } from '../../../backend/firebase/firestore';
import { User } from '../../../backend/entities';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

// Function to format date properly
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

// Function to format date and time
const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
};

const USERS_COLLECTION = 'users';

const DetailContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const UserInfo = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  .header {
    padding: 1.5rem;
    background-color: ${Theme.colors.primary}10;
    position: relative;
    text-align: center;
    
    .avatar {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      margin: 0 auto 1rem;
      background-color: ${Theme.colors.gray}30;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 600;
      color: ${Theme.colors.primary};
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    
    .name {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .email {
      color: ${Theme.colors.gray};
    }
    
    .role {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      
      &.admin {
        background-color: ${Theme.colors.error}20;
        color: ${Theme.colors.error};
      }
      
      &.advertiser {
        background-color: ${Theme.colors.secondary}20;
        color: ${Theme.colors.secondary};
      }
      
      &.client {
        background-color: ${Theme.colors.success}20;
        color: ${Theme.colors.success};
      }
    }
  }
  
  .info-items {
    padding: 1.5rem;
    
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      
      svg {
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 1rem;
        color: ${Theme.colors.primary};
      }
      
      .label {
        font-weight: 500;
        margin-right: 0.5rem;
        min-width: 3rem;
      }
      
      .value {
        color: ${Theme.colors.gray};
        flex: 1;
        word-break: break-word;
      }
    }
  }
  
  .actions {
    padding: 1rem 1.5rem;
    border-top: 1px solid ${Theme.colors.gray}20;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      
      &.block {
        background-color: ${Theme.colors.error};
        
        &:hover {
          background-color: ${Theme.colors.error}dd;
        }
      }
      
      &.unblock {
        background-color: ${Theme.colors.success};
        
        &:hover {
          background-color: ${Theme.colors.success}dd;
        }
      }
      
      &.delete {
        background-color: ${Theme.colors.error};
        
        &:hover {
          background-color: ${Theme.colors.error}dd;
        }
      }
    }
  }
`;

const UserDetailSection = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${Theme.colors.primary};
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${Theme.colors.gray}20;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const EditButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &.edit {
      background-color: ${Theme.colors.primary};
      color: white;
      
      &:hover {
        background-color: ${Theme.colors.primary}dd;
      }
    }
    
    &.save {
      background-color: ${Theme.colors.success};
      color: white;
      
      &:hover {
        background-color: ${Theme.colors.success}dd;
      }
    }
    
    &.cancel {
      background-color: ${Theme.colors.gray}30;
      color: ${Theme.colors.gray};
      
      &:hover {
        background-color: ${Theme.colors.gray}50;
      }
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const LanguageTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: ${Theme.colors.primary}10;
  color: ${Theme.colors.primary};
  border-radius: 4px;
  margin: 0.25rem;
  font-size: 0.875rem;
`;

const MetaSection = styled.div`
  margin-top: 2rem;
  
  .meta-item {
    display: flex;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    
    .label {
      font-weight: 500;
      min-width: 8rem;
    }
    
    .value {
      color: ${Theme.colors.gray};
    }
  }
`;

const IDDocuments = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  
  .id-document {
    border: 1px solid ${Theme.colors.gray}30;
    border-radius: 8px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .label {
      padding: 0.5rem;
      font-size: 0.875rem;
      background-color: ${Theme.colors.gray}10;
      text-align: center;
      font-weight: 500;
    }
  }
`;

const UserDetailPage = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit state
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  
  useEffect(() => {
    if (params.id) {
      loadUser(params.id);
    }
  }, [params.id]);
  
  const loadUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await getUserById(userId);
      
      if (!userData) {
        setError('User not found');
        return;
      }
      
      // Prevent viewing admin user details
      if (userData.role === 'admin') {
        setError('Admin user details cannot be viewed for security reasons');
        setTimeout(() => {
          navigate('/dashboard/admin/users');
        }, 2000); // Redirect after 2 seconds
        return;
      }
      
      setUser(userData);
      // Initialize edit form with user data
      setEditedUser({
        name: userData.name,
        surname: userData.surname,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        nationality: userData.nationality,
        aboutMe: userData.aboutMe,
        languages: userData.languages || []
      });
    } catch (error) {
      console.error('Error loading user:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackClick = () => {
    navigate('/dashboard/admin/users');
  };
  
  const handleBlockUser = async () => {
    if (!user) return;
    
    try {
      const isBlocked = user.isBlocked || false;
      
      if (isBlocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }
      
      // Reload user to get updated status
      loadUser(user.id);
    } catch (error) {
      console.error('Error toggling user block status:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update user status'}`);
    }
  };
  
  const handleDeleteUser = async () => {
    if (!user) return;
    
    if (window.confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
      try {
        await deleteDocument(USERS_COLLECTION, user.id);
        navigate('/dashboard/admin/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete user'}`);
      }
    }
  };
  
  const handleEditToggle = () => {
    setEditing(!editing);
    
    // Reset edited user to current user data if canceling
    if (editing && user) {
      setEditedUser({
        name: user.name,
        surname: user.surname,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        nationality: user.nationality,
        aboutMe: user.aboutMe,
        languages: user.languages || []
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };
  

  
  const handleRemoveLanguage = (language: string) => {
    setEditedUser({
      ...editedUser,
      languages: (editedUser.languages || []).filter(lang => lang !== language)
    });
  };
  
  const handleSaveChanges = async () => {
    if (!user) return;
    
    try {
      await updateUser(user.id, editedUser);
      setEditing(false);
      
      // Reload user to get updated data
      loadUser(user.id);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update user'}`);
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="User Details" />
        <GlassCard>
          <div>Loading user details...</div>
        </GlassCard>
      </PageContainer>
    );
  }
  
  if (error || !user) {
    return (
      <PageContainer>
        <PageHeader title="User Details" />
        <GlassCard>
          <div>Error: {error || 'User not found'}</div>
          <SecondaryButton onClick={handleBackClick}>
            <FaArrowLeft /> Back to Users
          </SecondaryButton>
        </GlassCard>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader title="User Details" />
      <GlassCard>
        <DetailContainer>
          {/* User Info Sidebar */}
          <UserInfo>
            <div className="header">
              <div className="avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="name">{user.name} {user.surname}</div>
              <div className="email">{user.email}</div>
              <div className={`role ${user.role}`}>
                {user.role === 'admin' ? (
                  <>
                    <FaUserCog /> Admin
                  </>
                ) : user.role === 'advertiser' ? (
                  <>
                    <FaUserTie /> Advertiser
                  </>
                ) : (
                  <>
                    <FaUser /> Client
                  </>
                )}
              </div>
            </div>
            
            <div className="info-items">
              <div className="info-item">
                <FaEnvelope />
                <div className="label">Email:</div>
                <div className="value">{user.email}</div>
              </div>
              
              <div className="info-item">
                <FaPhone />
                <div className="label">Phone:</div>
                <div className="value">{user.phoneNumber || 'Not provided'}</div>
              </div>
              
              <div className="info-item">
                <FaCalendarAlt />
                <div className="label">DOB:</div>
                <div className="value">{formatDate(user.dateOfBirth || '')}</div>
              </div>
              
              <div className="info-item">
                <FaGlobe />
                <div className="label">From:</div>
                <div className="value">{user.nationality || 'Not provided'}</div>
              </div>
              
              <div className="info-item">
                <FaLanguage />
                <div className="label">Languages:</div>
                <div className="value">
                  {user.languages && user.languages.length > 0 
                    ? user.languages.map(lang => (
                        <LanguageTag key={lang}>{lang}</LanguageTag>
                      ))
                    : 'None specified'}
                </div>
              </div>
            </div>
            
            <div className="actions">
              <PrimaryButton onClick={handleBlockUser}>
                {user.isBlocked ? (
                  <>
                    <FaUnlock /> Unblock User
                  </>
                ) : (
                  <>
                    <FaBan /> Block User
                  </>
                )}
              </PrimaryButton>
              <SecondaryButton onClick={handleDeleteUser}>
                <FaTrash /> Delete User
              </SecondaryButton>
            </div>
          </UserInfo>
          
          {/* User Details */}
          <div>
            <UserDetailSection>
              <h3>
                Personal Information
                <EditButtons>
                  {editing ? (
                    <>
                      <button className="save" onClick={handleSaveChanges}>
                        <FaSave />
                      </button>
                      <button className="cancel" onClick={handleEditToggle}>
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button className="edit" onClick={handleEditToggle}>
                      <FaEdit />
                    </button>
                  )}
                </EditButtons>
              </h3>
              
              {editing ? (
                <FormGrid>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input 
                      type="text" 
                      name="name" 
                      value={editedUser.name || ''}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input 
                      type="text" 
                      name="surname" 
                      value={editedUser.surname || ''}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input 
                      type="text" 
                      name="phoneNumber" 
                      value={editedUser.phoneNumber || ''}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Date of Birth</Label>
                    <Input 
                      type="date" 
                      name="dateOfBirth" 
                      value={editedUser.dateOfBirth || ''}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Gender</Label>
                    <Select 
                      name="gender" 
                      value={editedUser.gender || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Nationality</Label>
                    <Input 
                      type="text" 
                      name="nationality" 
                      value={editedUser.nationality || ''}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </FormGrid>
              ) : (
                <div>
                  <p><strong>Full Name:</strong> {user.name} {user.surname || ''}</p>
                  <p><strong>Phone Number:</strong> {user.phoneNumber || 'Not provided'}</p>
                  <p><strong>Date of Birth:</strong> {formatDate(user.dateOfBirth || '')}</p>
                  <p><strong>Gender:</strong> {user.gender || 'Not provided'}</p>
                  <p><strong>Nationality:</strong> {user.nationality || 'Not provided'}</p>
                </div>
              )}
            </UserDetailSection>
            
            <UserDetailSection>
              <h3>About</h3>
              {editing ? (
                <FormGroup>
                  <Label>About Me</Label>
                  <TextArea 
                    name="aboutMe" 
                    value={editedUser.aboutMe || ''}
                    onChange={handleInputChange}
                    rows={5}
                  />
                </FormGroup>
              ) : (
                <div>
                  {user.aboutMe || 'No information provided.'}
                </div>
              )}
            </UserDetailSection>
            
            <UserDetailSection>
              <h3>Languages</h3>
              {editing ? (
                <div>
                  <FormGroup>
                    <Label>Add Language</Label>
                    <Input 
                      type="text" 
                      placeholder="Type language and press Enter" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = e.currentTarget.value;
                          if (value) {
                            setEditedUser({
                              ...editedUser,
                              languages: [...(editedUser.languages || []), value]
                            });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </FormGroup>
                  
                  <div style={{ marginTop: '1rem' }}>
                    {editedUser.languages && editedUser.languages.length > 0 ? (
                      editedUser.languages.map(language => (
                        <LanguageTag key={language}>
                          {language}
                          <span 
                            style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                            onClick={() => handleRemoveLanguage(language)}
                          >
                            &times;
                          </span>
                        </LanguageTag>
                      ))
                    ) : (
                      <div>No languages added yet.</div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {user.languages && user.languages.length > 0 ? (
                    user.languages.map(language => (
                      <LanguageTag key={language}>{language}</LanguageTag>
                    ))
                  ) : (
                    'No languages specified.'
                  )}
                </div>
              )}
            </UserDetailSection>
            
            {/* ID Documents Section */}
            {user.identificationDocuments && (
              <UserDetailSection>
                <h3>
                  Identification Documents
                  <StatusBadge status={user.identificationDocuments.verified ? 'active' : 'pending'}>
                    {user.identificationDocuments.verified ? 'Verified' : 'Pending Verification'}
                  </StatusBadge>
                </h3>
                
                <IDDocuments>
                  {user.identificationDocuments.frontId && (
                    <div className="id-document">
                      <img src={user.identificationDocuments.frontId} alt="ID Front" />
                      <div className="label">ID Front</div>
                    </div>
                  )}
                  
                  {user.identificationDocuments.backId && (
                    <div className="id-document">
                      <img src={user.identificationDocuments.backId} alt="ID Back" />
                      <div className="label">ID Back</div>
                    </div>
                  )}
                  
                  {!user.identificationDocuments.frontId && !user.identificationDocuments.backId && (
                    <div>No ID documents uploaded.</div>
                  )}
                </IDDocuments>
                
                {user.identificationDocuments.uploadDate && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: Theme.colors.gray }}>
                    Uploaded on: {formatDate(user.identificationDocuments.uploadDate)}
                  </div>
                )}
              </UserDetailSection>
            )}
            
            {/* User Meta Information */}
            <MetaSection>
              <UserDetailSection>
                <h3>Account Information</h3>
                
                <div className="meta-item">
                  <div className="label">User ID:</div>
                  <div className="value">{user.id}</div>
                </div>
                
                <div className="meta-item">
                  <div className="label">Created:</div>
                  <div className="value">{formatDateTime(user.createdAt)}</div>
                </div>
                
                <div className="meta-item">
                  <div className="label">Last Updated:</div>
                  <div className="value">{formatDateTime(user.updatedAt)}</div>
                </div>
                
                <div className="meta-item">
                  <div className="label">Email Verified:</div>
                  <div className="value">{user.emailVerified ? 'Yes' : 'No'}</div>
                </div>
                
                <div className="meta-item">
                  <div className="label">Google Connected:</div>
                  <div className="value">{user.googleConnected ? 'Yes' : 'No'}</div>
                </div>
                
                {user.googleConnected && user.googleEmail && (
                  <div className="meta-item">
                    <div className="label">Google Email:</div>
                    <div className="value">{user.googleEmail}</div>
                  </div>
                )}
              </UserDetailSection>
            </MetaSection>
          </div>
        </DetailContainer>
      </GlassCard>
    </PageContainer>
  );
};

export default UserDetailPage; 