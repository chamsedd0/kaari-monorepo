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

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  min-width: 150px;
  padding: 8px 10px;
  border: 1px solid ${Theme.colors.gray};
  border-radius: 4px;
  font: ${Theme.typography.fonts.smallM};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${Theme.colors.secondary};
  }
`;

const ReferralsPage: React.FC = () => {
  const navigate = useNavigate();
  const [advertisers, setAdvertisers] = useState<ReferralAdvertiser[]>([]);
  const [filteredAdvertisers, setFilteredAdvertisers] = useState<ReferralAdvertiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [passStatusFilter, setPassStatusFilter] = useState<string>('all');
  
  // Load referral advertisers data
  useEffect(() => {
    const loadAdvertisers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all referral advertisers
        const allAdvertisers = await getAllReferralAdvertisers();
        
        // Sort by earnings (pending + paid) descending
        allAdvertisers.sort((a, b) => {
          const totalEarningsA = a.earningsPending + a.earningsPaid;
          const totalEarningsB = b.earningsPending + b.earningsPaid;
          return totalEarningsB - totalEarningsA;
        });
        
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
  
  // Apply filters when search query or pass status filter changes
  useEffect(() => {
    let filtered = [...advertisers];
    
    // Apply pass status filter
    if (passStatusFilter !== 'all') {
      filtered = filtered.filter(advertiser => advertiser.passStatus === passStatusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        advertiser =>
          advertiser.name.toLowerCase().includes(query) ||
          advertiser.phoneNumber.toLowerCase().includes(query) ||
          advertiser.referralCode.toLowerCase().includes(query) ||
          (advertiser.email && advertiser.email.toLowerCase().includes(query))
      );
    }
    
    setFilteredAdvertisers(filtered);
  }, [searchQuery, passStatusFilter, advertisers]);
  
  // Open advertiser detail drawer
  const openAdvertiserDetail = (advertiser: ReferralAdvertiser) => {
    navigate(`/dashboard/admin/referrals/${advertiser.id}`);
  };
  
  // Copy referral code to clipboard
  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getTotalReferrals = (advertiser: ReferralAdvertiser) => {
    // Use referralStats if available, otherwise use bookingsViaCode
    if (advertiser.referralStats) {
      return advertiser.referralStats.totalReferrals + advertiser.referralStats.successfulBookings;
    }
    return advertiser.bookingsViaCode;
  };
  
  const getTotalEarnings = (advertiser: ReferralAdvertiser) => {
    return advertiser.earningsPending + advertiser.earningsPaid;
  };
  
  const handlePassStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPassStatusFilter(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <DashboardCard>
      <CardTitle>Referral Program Management</CardTitle>
      <CardContent>
        <FilterContainer>
          <FilterSelect
            value={passStatusFilter}
            onChange={handlePassStatusFilterChange}
          >
            <option value="all">All Pass Statuses</option>
            <option value="active">Active Pass</option>
            <option value="locked">Locked Pass</option>
          </FilterSelect>
          
          <SearchContainer>
            <FaSearch />
            <SearchInput
              type="text"
              placeholder="Search by name, phone, or code"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </SearchContainer>
        </FilterContainer>
        
        <TableContainer>
          {loading ? (
            <LoadingMessage>Loading referral data...</LoadingMessage>
          ) : error ? (
            <NoDataMessage>{error}</NoDataMessage>
          ) : filteredAdvertisers.length === 0 ? (
            <NoDataMessage>No referral advertisers found matching your criteria.</NoDataMessage>
          ) : (
            <ReferralTable>
              <ReferralTableHead>
                <tr>
                  <ReferralTableHeader style={{ width: '20%' }}>Advertiser</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '15%' }}>Referral Code</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '10%' }}>Total Referrals</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '15%' }}>Earnings (Pending)</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '15%' }}>Earnings (Paid)</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '15%' }}>Total Earnings</ReferralTableHeader>
                  <ReferralTableHeader style={{ width: '10%' }}>Pass Status</ReferralTableHeader>
                </tr>
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
                        <FaCopy 
                          size={14} 
                          onClick={(e) => copyToClipboard(advertiser.referralCode, e)}
                        />
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
                      <EarningsAmount>{formatCurrency(getTotalEarnings(advertiser))}</EarningsAmount>
                    </ReferralCell>
                    <ReferralCell>
                      <PassStatusBadge $status={advertiser.passStatus}>
                        {advertiser.passStatus === 'active' ? 'Active' : 'Locked'}
                      </PassStatusBadge>
                    </ReferralCell>
                  </ReferralRow>
                ))}
              </tbody>
            </ReferralTable>
          )}
        </TableContainer>
      </CardContent>
    </DashboardCard>
  );
};

export default ReferralsPage; 