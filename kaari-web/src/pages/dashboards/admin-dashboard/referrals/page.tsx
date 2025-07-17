import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCopy } from 'react-icons/fa';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
} from '../styles';
import { useNavigate } from 'react-router-dom';
import { 
  getAllReferralAdvertisers,
  ReferralAdvertiser,
  ReferralPassStatus
} from '../../../../backend/server-actions/ReferralServerActions';

// Excel-like styled components
const ReferralTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  overflow: hidden;
  table-layout: fixed;
`;

const ReferralTableHead = styled.thead`
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ReferralTableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font: ${Theme.typography.fonts.smallB};
  color: ${Theme.colors.gray2};
  border-bottom: 1px solid ${Theme.colors.gray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReferralRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3eefb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${Theme.colors.gray};
  }
`;

const ReferralCell = styled.td`
  padding: 10px 15px;
  font: ${Theme.typography.fonts.smallM};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactName = styled.div`
  font-weight: 500;
`;

const ContactPhone = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ReferralCode = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  
  svg {
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    color: ${Theme.colors.secondary};
  }
  
  &:hover svg {
    opacity: 1;
  }
`;

const BookingsCount = styled.div`
  font-weight: 500;
`;

const EarningsAmount = styled.div`
  font-weight: 500;
  color: ${Theme.colors.primary};
`;

const PassStatusBadge = styled.span<{ $status: ReferralPassStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallB};
  
  background-color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#e6f4ea'; // green
      case 'locked':
        return '#f1f3f4'; // grey
      default:
        return '#f1f3f4';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'active':
        return '#137333'; // dark green
      case 'locked':
        return '#5f6368'; // dark grey
      default:
        return '#5f6368';
    }
  }};
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: white;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  cursor: pointer;
  
  &:hover {
    background-color: #f3eefb;
    border-color: ${Theme.colors.secondary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex-grow: 1;
  max-width: 300px;
  margin-bottom: 20px;
  
  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${Theme.colors.gray2};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 10px 8px 35px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const TableContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const [advertisers, setAdvertisers] = useState<ReferralAdvertiser[]>([]);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<ReferralAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Load referral advertisers data
  useEffect(() => {
    const loadAdvertisers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all referral advertisers
        const allAdvertisers = await getAllReferralAdvertisers();
        setAdvertisers(allAdvertisers);
        setFilteredAdvertisers(allAdvertisers);
      } catch (err) {
        console.error('Error loading referral advertisers:', err);
        setError('Failed to load referral advertisers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAdvertisers();
  }, []);
  
  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAdvertisers(advertisers);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = advertisers.filter(
      advertiser =>
        advertiser.name.toLowerCase().includes(query) ||
        advertiser.phoneNumber.toLowerCase().includes(query) ||
        advertiser.referralCode.toLowerCase().includes(query)
    );
    
    setFilteredAdvertisers(filtered);
  }, [searchQuery, advertisers]);
  
  // Open advertiser detail drawer
  const openAdvertiserDetail = (advertiser: ReferralAdvertiser) => {
    navigate(`/dashboard/admin/referrals/${advertiser.id}`);
  };
  
  // Copy referral code to clipboard
  const copyReferralCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Format currency amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get the total referrals count
  const getTotalReferrals = (advertiser: ReferralAdvertiser) => {
    return advertiser.referralStats?.totalReferrals || 0;
  };
  
  return (
    <>
      <DashboardCard>
        <CardTitle>Referral Management</CardTitle>
        <CardContent>
          {/* Search */}
          <SearchContainer>
            <FaSearch />
            <SearchInput 
              type="text" 
              placeholder="Search by name, phone, or code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
          
          {/* Error message */}
          {error && (
            <div style={{ color: 'red', marginBottom: '15px' }}>
              {error}
            </div>
          )}
          
          {/* Referral Table */}
          {loading ? (
            <p>Loading referral advertisers...</p>
          ) : filteredAdvertisers.length === 0 ? (
            <NoDataMessage>No referral advertisers found matching your criteria.</NoDataMessage>
          ) : (
            <TableContainer>
              <ReferralTable>
                <ReferralTableHead>
                  <ReferralRow>
                    <ReferralTableHeader style={{ width: '25%' }}>Advertiser</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '15%' }}>Referral Code</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '15%' }}>Bookings via Code</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '15%' }}>Earnings Pending</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '15%' }}>Earnings Paid</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '10%' }}>Pass Status</ReferralTableHeader>
                    <ReferralTableHeader style={{ width: '5%' }}>Actions</ReferralTableHeader>
                  </ReferralRow>
                </ReferralTableHead>
                <tbody>
                  {filteredAdvertisers.map(advertiser => (
                    <ReferralRow key={advertiser.id} onClick={() => openAdvertiserDetail(advertiser)}>
                      <ReferralCell>
                        <ContactInfo>
                          <ContactName>{advertiser.name}</ContactName>
                          <ContactPhone>{advertiser.phoneNumber}</ContactPhone>
                        </ContactInfo>
                      </ReferralCell>
                      <ReferralCell>
                        <ReferralCode>
                          {advertiser.referralCode}
                          <FaCopy size={14} onClick={(e) => copyReferralCode(advertiser.referralCode, e)} />
                        </ReferralCode>
                      </ReferralCell>
                      <ReferralCell>
                        <BookingsCount>{getTotalReferrals(advertiser)}</BookingsCount>
                      </ReferralCell>
                      <ReferralCell>
                        <EarningsAmount>{formatCurrency(advertiser.earningsPending)}</EarningsAmount>
                      </ReferralCell>
                      <ReferralCell>
                        <EarningsAmount>{formatCurrency(advertiser.earningsPaid)}</EarningsAmount>
                      </ReferralCell>
                      <ReferralCell>
                        <PassStatusBadge $status={advertiser.passStatus}>
                          {advertiser.passStatus === 'active' ? 'Active' : 'Locked'}
                        </PassStatusBadge>
                      </ReferralCell>
                      <ReferralCell>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          openAdvertiserDetail(advertiser);
                        }}>
                          <FaEye />
                        </ActionButton>
                      </ReferralCell>
                    </ReferralRow>
                  ))}
                </tbody>
              </ReferralTable>
            </TableContainer>
          )}
        </CardContent>
      </DashboardCard>
    </>
  );
};

export default ReferralsPage; 