'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft, FaCopy } from 'react-icons/fa';
import {
  Container,
  FilterBar,
  SearchInput,
  FilterSelect,
  AdvertiserTable,
  TableHeader,
  TableRow,
  TableCell,
  Pagination,
  DetailContainer,
  TabContainer,
  Tab,
  TabContent,
  DetailHeader,
  DetailStats,
  StatBox,
  NoteBox,
  NoteInput,
  SaveNoteButton,
  BackButton
} from './styles';
import { 
  getAdvertisers, 
  getAdvertiserById, 
  getBookingsByAdvertiserId,
  getAdvertiserNote,
  saveAdvertiserNote
} from '../../../../backend/server-actions/AdminServerActions';
import { getAdvertiserReferralData } from '../../../../backend/server-actions/AdvertiserServerActions';
import { getPropertiesByAdvertiserId } from '../../../../backend/server-actions/PropertyServerActions';
import { getPhotoshootsByAdvertiserId } from '../../../../backend/server-actions/PhotoshootBookingServerActions';
import { Theme } from '../../../../theme/theme';

// Types
interface Advertiser {
  id: string;
  name: string;
  city: string;
  activePropertiesCount: number;
  bookingsThisMonth: number;
  referralEarningsPending: number;
  photoshootsPending: number;
  status: 'active' | 'suspended';
}

interface Property {
  id: string;
  title: string;
  city: string;
  status: 'live' | 'hidden';
  nextAvailability: string;
  thumbnail?: string;
}

interface PhotoshootRequest {
  id: string;
  propertyTitle: string;
  requestDate: string;
  scheduledDate: string;
  status: 'pending' | 'done';
}

interface Booking {
  id: string;
  tenantName: string;
  moveInDate: string;
  status: 'await-confirm' | 'confirmed' | 'safety-window-closed';
  payoutPending: number;
}

interface ReferralData {
  code: string;
  bookingsCount: number;
  earningsPending: number;
  earningsPaid: number;
}

const AdvertiserModerationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<Advertiser[]>([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<Advertiser | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [photoshootRequests, setPhotoshootRequests] = useState<PhotoshootRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [note, setNote] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch advertisers data
  useEffect(() => {
    const fetchAdvertisers = async () => {
      setLoading(true);
      try {
        // Get advertisers data
        const response = await getAdvertisers();
        
        // Sort by name
        response.sort((a, b) => a.name.localeCompare(b.name));
        
        setAdvertisers(response);
        setFilteredAdvertisers(response);
        
        // Extract unique cities for filter
        const uniqueCities = [...new Set(response.map(adv => adv.city))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching advertisers:', error);
        setError('Failed to fetch advertisers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvertisers();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...advertisers];
    
    if (searchTerm) {
      results = results.filter(adv => 
        adv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (cityFilter !== 'all') {
      results = results.filter(adv => adv.city === cityFilter);
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(adv => adv.status === statusFilter);
    }
    
    setFilteredAdvertisers(results);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, cityFilter, statusFilter, advertisers]);

  // Fetch advertiser details
  useEffect(() => {
    if (!id) return;
    
    const fetchAdvertiserDetails = async () => {
      setDetailLoading(true);
      setError(null);
      try {
        // Fetch advertiser basic info
        const advertiser = await getAdvertiserById(id);
        setSelectedAdvertiser(advertiser);
        
        // Fetch properties
        const props = await getPropertiesByAdvertiserId(id);
        setProperties(props || []);
        
        // Fetch photoshoots
        const photoshoots = await getPhotoshootsByAdvertiserId(id);
        setPhotoshootRequests(photoshoots || []);
        
        // Fetch bookings
        const advBookings = await getBookingsByAdvertiserId(id);
        setBookings(advBookings || []);
        
        // Fetch referrals
        const referrals = await getAdvertiserReferralData(id);
        setReferralData(referrals || null);
        
        // Fetch notes
        const advertiserNote = await getAdvertiserNote(id);
        setNote(advertiserNote || '');
      } catch (error) {
        console.error('Error fetching advertiser details:', error);
        setError('Failed to load advertiser details. Please try again later.');
      } finally {
        setDetailLoading(false);
      }
    };
    
    fetchAdvertiserDetails();
  }, [id]);

  const handleRowClick = (advertiser: Advertiser) => {
    navigate(`/dashboard/admin/advertiser-moderation/${advertiser.id}`);
  };

  const handleBackClick = () => {
    navigate('/dashboard/admin/advertiser-moderation');
  };

  const handleSaveNote = async () => {
    if (!selectedAdvertiser) return;
    
    try {
      setSavingNote(true);
      setError(null);
      setSuccess(null);
      
      await saveAdvertiserNote(selectedAdvertiser.id, note);
      setSuccess('Note saved successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    } finally {
      setSavingNote(false);
    }
  };
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const paginatedAdvertisers = filteredAdvertisers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  const getPlaceholderImage = (title: string) => {
    // Generate a placeholder image based on title
    const colors = ['#6c5ce7', '#00cec9', '#fdcb6e', '#e17055', '#74b9ff'];
    const colorIndex = title.length % colors.length;
    const initials = title.substring(0, 2).toUpperCase();
    
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(0, 0, 40, 40);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, 20, 20);
    }
    
    return canvas.toDataURL();
  };

  // Render advertiser list (overview)
  const renderAdvertiserList = () => (
    <Container>
      <h2>Advertiser Moderation</h2>
      
      <FilterBar>
        <SearchInput>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        
        <FilterSelect
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="all">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </FilterSelect>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </FilterSelect>
      </FilterBar>
      
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading advertisers...</div>
      ) : filteredAdvertisers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          No advertisers found matching your criteria.
        </div>
      ) : (
        <>
          <AdvertiserTable>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Active Properties</th>
                <th>Bookings (Month)</th>
                <th>Pending Referrals</th>
                <th>Pending Photoshoots</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdvertisers.map(advertiser => (
                <TableRow key={advertiser.id} onClick={() => handleRowClick(advertiser)}>
                  <TableCell>{advertiser.name}</TableCell>
                  <TableCell>{advertiser.city}</TableCell>
                  <TableCell>{advertiser.activePropertiesCount}</TableCell>
                  <TableCell>{advertiser.bookingsThisMonth}</TableCell>
                  <TableCell>{formatCurrency(advertiser.referralEarningsPending)}</TableCell>
                  <TableCell>{advertiser.photoshootsPending}</TableCell>
                  <TableCell>
                    <span className={`status ${advertiser.status}`}>
                      {advertiser.status === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </AdvertiserTable>
          
          {totalPages > 1 && (
            <Pagination>
              <button 
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );

  // Render advertiser detail
  const renderAdvertiserDetail = () => {
    if (!selectedAdvertiser) {
      return <div>Select an advertiser to view details</div>;
    }

    return (
      <DetailContainer>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft /> Back to Advertisers
        </BackButton>
        
        {success && <div style={{ color: 'green', marginBottom: '15px' }}>{success}</div>}
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading advertiser details...</div>
        ) : (
          <>
            <DetailHeader>
              <h2>{selectedAdvertiser.name}</h2>
              <span className={`status ${selectedAdvertiser.status}`}>
                {selectedAdvertiser.status === 'active' ? 'Active' : 'Suspended'}
              </span>
            </DetailHeader>
            
            <DetailStats>
              <StatBox>
                <h3>Properties</h3>
                <p>{selectedAdvertiser.activePropertiesCount}</p>
              </StatBox>
              <StatBox>
                <h3>Bookings (Month)</h3>
                <p>{selectedAdvertiser.bookingsThisMonth}</p>
              </StatBox>
              <StatBox>
                <h3>Pending Referrals</h3>
                <p>{formatCurrency(selectedAdvertiser.referralEarningsPending)}</p>
              </StatBox>
              <StatBox>
                <h3>Pending Photoshoots</h3>
                <p>{selectedAdvertiser.photoshootsPending}</p>
              </StatBox>
            </DetailStats>
            
            <NoteBox>
              <h3>Admin Notes</h3>
              <NoteInput
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal notes about this advertiser..."
              />
              <SaveNoteButton 
                onClick={handleSaveNote}
                disabled={savingNote}
              >
                {savingNote ? 'Saving...' : 'Save Note'}
              </SaveNoteButton>
            </NoteBox>
            
            <TabContainer>
              <div className="tabs">
                <Tab 
                  className={activeTab === 'properties' ? 'active' : ''} 
                  onClick={() => handleTabChange('properties')}
                >
                  Properties
                </Tab>
                <Tab 
                  className={activeTab === 'bookings' ? 'active' : ''} 
                  onClick={() => handleTabChange('bookings')}
                >
                  Bookings
                </Tab>
                <Tab 
                  className={activeTab === 'photoshoots' ? 'active' : ''} 
                  onClick={() => handleTabChange('photoshoots')}
                >
                  Photoshoots
                </Tab>
                <Tab 
                  className={activeTab === 'referrals' ? 'active' : ''} 
                  onClick={() => handleTabChange('referrals')}
                >
                  Referrals
                </Tab>
              </div>
              
              <TabContent className={activeTab === 'properties' ? 'active' : ''}>
                {properties.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    No properties found for this advertiser.
                  </div>
                ) : (
                  <AdvertiserTable>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Next Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map(property => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={property.thumbnail || getPlaceholderImage(property.title)} 
                                alt={property.title}
                                style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = getPlaceholderImage(property.title);
                                }}
                              />
                              <span>{property.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{property.city}</TableCell>
                          <TableCell>
                            <span className={`status ${property.status}`}>
                              {property.status === 'live' ? 'Live' : 'Hidden'}
                            </span>
                          </TableCell>
                          <TableCell>{property.nextAvailability}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </AdvertiserTable>
                )}
              </TabContent>
              
              <TabContent className={activeTab === 'bookings' ? 'active' : ''}>
                {bookings.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    No bookings found for this advertiser.
                  </div>
                ) : (
                  <AdvertiserTable>
                    <thead>
                      <tr>
                        <th>Tenant</th>
                        <th>Move-in Date</th>
                        <th>Status</th>
                        <th>Payout Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.tenantName}</TableCell>
                          <TableCell>{formatDate(booking.moveInDate)}</TableCell>
                          <TableCell>
                            <span className={`status ${booking.status}`}>
                              {booking.status === 'await-confirm' ? 'Awaiting Confirmation' :
                               booking.status === 'confirmed' ? 'Confirmed' : 'Safety Window Closed'}
                            </span>
                          </TableCell>
                          <TableCell>{formatCurrency(booking.payoutPending)}</TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </AdvertiserTable>
                )}
              </TabContent>
              
              <TabContent className={activeTab === 'photoshoots' ? 'active' : ''}>
                {photoshootRequests.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    No photoshoot requests found for this advertiser.
                  </div>
                ) : (
                  <AdvertiserTable>
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Request Date</th>
                        <th>Scheduled Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {photoshootRequests.map(request => (
                        <TableRow key={request.id}>
                          <TableCell>{request.propertyTitle}</TableCell>
                          <TableCell>{formatDate(request.requestDate)}</TableCell>
                          <TableCell>{formatDate(request.scheduledDate)}</TableCell>
                          <TableCell>
                            <span className={`status ${request.status}`}>
                              {request.status === 'pending' ? 'Pending' : 'Done'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </AdvertiserTable>
                )}
              </TabContent>
              
              <TabContent className={activeTab === 'referrals' ? 'active' : ''}>
                {!referralData ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    No referral data found for this advertiser.
                  </div>
                ) : (
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <h3>Referral Code</h3>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        padding: '10px',
                        background: '#f5f5f5',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '1.2rem'
                      }}>
                        {referralData.code}
                        <button 
                          onClick={() => copyToClipboard(referralData.code)}
                          style={{ 
                            background: 'none', 
                            border: 'none',
                            cursor: 'pointer',
                            color: Theme.colors.secondary
                          }}
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                    
                    <DetailStats>
                      <StatBox>
                        <h3>Bookings Count</h3>
                        <p>{referralData.bookingsCount}</p>
                      </StatBox>
                      <StatBox>
                        <h3>Earnings (Pending)</h3>
                        <p>{formatCurrency(referralData.earningsPending)}</p>
                      </StatBox>
                      <StatBox>
                        <h3>Earnings (Paid)</h3>
                        <p>{formatCurrency(referralData.earningsPaid)}</p>
                      </StatBox>
                      <StatBox>
                        <h3>Total Earnings</h3>
                        <p>{formatCurrency(referralData.earningsPending + referralData.earningsPaid)}</p>
                      </StatBox>
                    </DetailStats>
                  </div>
                )}
              </TabContent>
            </TabContainer>
          </>
        )}
      </DetailContainer>
    );
  };

  return id ? renderAdvertiserDetail() : renderAdvertiserList();
};

export default AdvertiserModerationPage; 