'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch advertisers data
  useEffect(() => {
    const fetchAdvertisers = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await getAdvertisers();
        setAdvertisers(response);
        setFilteredAdvertisers(response);
        
        // Extract unique cities for filter
        const uniqueCities = [...new Set(response.map(adv => adv.city))];
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching advertisers:', error);
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
      setLoading(true);
      try {
        console.log('Fetching advertiser details for ID:', id);
        
        // Fetch advertiser basic info
        const advertiser = await getAdvertiserById(id);
        console.log('Advertiser data:', advertiser);
        setSelectedAdvertiser(advertiser);
        
        // Fetch properties
        const props = await getPropertiesByAdvertiserId(id);
        console.log('Properties data:', props);
        setProperties(props || []);
        
        // Fetch photoshoots
        const photoshoots = await getPhotoshootsByAdvertiserId(id);
        console.log('Photoshoots data:', photoshoots);
        setPhotoshootRequests(photoshoots || []);
        
        // Fetch bookings
        const advBookings = await getBookingsByAdvertiserId(id);
        console.log('Bookings data:', advBookings);
        setBookings(advBookings || []);
        
        // Fetch referrals
        const referrals = await getAdvertiserReferralData(id);
        console.log('Referrals data:', referrals);
        setReferralData(referrals || null);
        
        // Fetch notes
        const advertiserNote = await getAdvertiserNote(id);
        console.log('Note data:', advertiserNote);
        setNote(advertiserNote || '');
      } catch (error) {
        console.error('Error fetching advertiser details:', error);
      } finally {
        setLoading(false);
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
      await saveAdvertiserNote(selectedAdvertiser.id, note);
      // Show success message
    } catch (error) {
      console.error('Error saving note:', error);
      // Show error message
    }
  };

  const paginatedAdvertisers = filteredAdvertisers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAdvertisers.length / itemsPerPage);

  // Render advertiser list (overview)
  const renderAdvertiserList = () => (
    <Container>
      <h2>Advertiser Moderation</h2>
      
      <FilterBar>
        <SearchInput>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or phone"
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
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </FilterSelect>
      </FilterBar>
      
      <AdvertiserTable>
        <thead>
          <TableHeader>
            <th>Advertiser Name</th>
            <th>City</th>
            <th>Active Properties</th>
            <th>Bookings This Month</th>
            <th>Referral Earnings Pending</th>
            <th>Photoshoots Pending</th>
            <th>Status</th>
          </TableHeader>
        </thead>
        <tbody>
          {paginatedAdvertisers.map(advertiser => (
            <TableRow 
              key={advertiser.id} 
              onClick={() => handleRowClick(advertiser)}
            >
              <TableCell>{advertiser.name}</TableCell>
              <TableCell>{advertiser.city}</TableCell>
              <TableCell>{advertiser.activePropertiesCount}</TableCell>
              <TableCell>{advertiser.bookingsThisMonth}</TableCell>
              <TableCell>{advertiser.referralEarningsPending} MAD</TableCell>
              <TableCell>{advertiser.photoshootsPending}</TableCell>
              <TableCell>
                <span className={`status ${advertiser.status}`}>
                  {advertiser.status.charAt(0).toUpperCase() + advertiser.status.slice(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </AdvertiserTable>
      
      {totalPages > 1 && (
        <Pagination>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>{page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </Pagination>
      )}
    </Container>
  );

  // Render advertiser detail
  const renderAdvertiserDetail = () => {
    if (!selectedAdvertiser) {
      return (
        <DetailContainer>
          <BackButton onClick={handleBackClick}>
            <FaArrowLeft /> Back to List
          </BackButton>
          <div>No advertiser data found for ID: {id}</div>
        </DetailContainer>
      );
    }
    
    const activePropertiesCount = properties.filter(p => p.status === 'live').length;
    const hiddenPropertiesCount = properties.filter(p => p.status === 'hidden').length;
    
    return (
      <DetailContainer>
        <BackButton onClick={handleBackClick}>
          <FaArrowLeft /> Back to List
        </BackButton>
        
        <DetailHeader>
          <h2>{selectedAdvertiser.name || 'Unknown Advertiser'}</h2>
          <span className={`status ${selectedAdvertiser.status || 'active'}`}>
            {selectedAdvertiser.status ? selectedAdvertiser.status.charAt(0).toUpperCase() + selectedAdvertiser.status.slice(1) : 'Active'}
          </span>
        </DetailHeader>
        
        <DetailStats>
          <StatBox>
            <span className="label">City</span>
            <span className="value">{selectedAdvertiser.city || 'Unknown'}</span>
          </StatBox>
          <StatBox>
            <span className="label">Properties</span>
            <span className="value">{activePropertiesCount} active, {hiddenPropertiesCount} hidden</span>
          </StatBox>
          <StatBox>
            <span className="label">Bookings This Month</span>
            <span className="value">{selectedAdvertiser.bookingsThisMonth || 0}</span>
          </StatBox>
          <StatBox>
            <span className="label">Pending Photoshoots</span>
            <span className="value">{selectedAdvertiser.photoshootsPending || 0}</span>
          </StatBox>
          <StatBox>
            <span className="label">Referral Earnings Pending</span>
            <span className="value">{selectedAdvertiser.referralEarningsPending || 0} MAD</span>
          </StatBox>
        </DetailStats>
        
        <TabContainer>
          <Tab 
            $active={activeTab === 'properties'} 
            onClick={() => setActiveTab('properties')}
          >
            Properties ({properties.length})
          </Tab>
          <Tab 
            $active={activeTab === 'photoshoots'} 
            onClick={() => setActiveTab('photoshoots')}
          >
            Photoshoot Requests ({photoshootRequests.length})
          </Tab>
          <Tab 
            $active={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')}
          >
            Bookings ({bookings.length})
          </Tab>
          <Tab 
            $active={activeTab === 'referrals'} 
            onClick={() => setActiveTab('referrals')}
          >
            Referrals
          </Tab>
        </TabContainer>
        
        <TabContent $visible={activeTab === 'properties'}>
          {properties.length > 0 ? (
            <AdvertiserTable>
              <thead>
                <TableHeader>
                  <th>Property Title</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Next Availability</th>
                </TableHeader>
              </thead>
              <tbody>
                {properties.map(property => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title || 'Untitled Property'}</TableCell>
                    <TableCell>{property.city || 'Unknown'}</TableCell>
                    <TableCell>
                      <span className={`status ${property.status || 'hidden'}`}>
                        {property.status ? property.status.charAt(0).toUpperCase() + property.status.slice(1) : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell>{property.nextAvailability || 'Not specified'}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </AdvertiserTable>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>No properties found for this advertiser.</div>
          )}
        </TabContent>
        
        <TabContent $visible={activeTab === 'photoshoots'}>
          {photoshootRequests.length > 0 ? (
            <AdvertiserTable>
              <thead>
                <TableHeader>
                  <th>Property Title</th>
                  <th>Request Date</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                </TableHeader>
              </thead>
              <tbody>
                {photoshootRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>{request.propertyTitle || 'Unknown Property'}</TableCell>
                    <TableCell>{request.requestDate || 'Unknown'}</TableCell>
                    <TableCell>{request.scheduledDate || 'Not scheduled'}</TableCell>
                    <TableCell>
                      <span className={`status ${request.status || 'pending'}`}>
                        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </AdvertiserTable>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>No photoshoot requests found for this advertiser.</div>
          )}
        </TabContent>
        
        <TabContent $visible={activeTab === 'bookings'}>
          {bookings.length > 0 ? (
            <AdvertiserTable>
              <thead>
                <TableHeader>
                  <th>Booking ID</th>
                  <th>Tenant Name</th>
                  <th>Move-in Date</th>
                  <th>Status</th>
                  <th>Payout Pending</th>
                </TableHeader>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.tenantName || 'Unknown Tenant'}</TableCell>
                    <TableCell>{booking.moveInDate || 'Unknown'}</TableCell>
                    <TableCell>
                      <span className={`status ${booking.status || 'await-confirm'}`}>
                        {booking.status 
                          ? booking.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
                          : 'Await Confirm'}
                      </span>
                    </TableCell>
                    <TableCell>{booking.payoutPending || 0} MAD</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </AdvertiserTable>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>No bookings found for this advertiser.</div>
          )}
        </TabContent>
        
        <TabContent $visible={activeTab === 'referrals'}>
          {referralData ? (
            <div className="referral-content">
              <div className="referral-stats">
                <StatBox>
                  <span className="label">Referral Code</span>
                  <span className="value">{referralData.code || 'No code'}</span>
                </StatBox>
                <StatBox>
                  <span className="label">Bookings via Code</span>
                  <span className="value">{referralData.bookingsCount || 0}</span>
                </StatBox>
                <StatBox>
                  <span className="label">Earnings Pending</span>
                  <span className="value">{referralData.earningsPending || 0} MAD</span>
                </StatBox>
                <StatBox>
                  <span className="label">Earnings Paid</span>
                  <span className="value">{referralData.earningsPaid || 0} MAD</span>
                </StatBox>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>No referral data found for this advertiser.</div>
          )}
        </TabContent>
        
        <NoteBox>
          <h4>Admin Notes</h4>
          <NoteInput
            placeholder="Add notes about this advertiser here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <SaveNoteButton onClick={handleSaveNote}>Save Note</SaveNoteButton>
        </NoteBox>
      </DetailContainer>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return id ? renderAdvertiserDetail() : renderAdvertiserList();
};

export default AdvertiserModerationPage; 