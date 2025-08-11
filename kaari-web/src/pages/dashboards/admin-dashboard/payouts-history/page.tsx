import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaSync, FaDownload, FaSpinner, FaInbox } from 'react-icons/fa';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, FilterBar, SearchBox as GlassSearchBox, GlassCard, GlassTable, StatusBadge as GlassStatusBadge, Button as AdminUIButton, Pill } from '../../../../components/admin/AdminUI';
import { formatDateSafe } from '../../../../utils/dates';
import { getAllPayouts } from '../../../../backend/server-actions/PayoutsServerActions';
import { Payout } from '../../../../services/PayoutsService';
import { formatDate } from '../../../../utils/date-utils';

// Styled components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHead = styled.thead`
  background-color: ${Theme.colors.secondary};
  color: white;
`;

const TableRow = styled.tr<{ $status?: string }>`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `background-color: rgba(255, 152, 0, 0.05);`;
      case 'approved':
        return `background-color: rgba(0, 180, 0, 0.05);`;
      case 'rejected':
        return `background-color: rgba(255, 0, 0, 0.05);`;
      case 'paid':
        return `background-color: rgba(126, 87, 194, 0.05);`;
      default:
        return '';
    }
  }}
  
  &:hover {
    background-color: #f3eefb;
  }
`;

const TableHeader = styled.th`
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const PayeeInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PayeeName = styled.span`
  font-weight: 600;
  margin-bottom: 4px;
`;

const PayeePhone = styled.span`
  font-size: 0.85rem;
  color: ${Theme.colors.gray2};
`;

const PaymentMethodInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const BankName = styled.span`
  font-weight: 500;
`;

const AccountNumber = styled.span`
  font-size: 0.85rem;
  color: ${Theme.colors.gray2};
`;

const ReasonBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$type) {
      case 'Rent – Move-in':
        return `
          background-color: #e3f2fd;
          color: #1976d2;
        `;
      case 'Cushion – Pre-move Cancel':
        return `
          background-color: #fff8e1;
          color: #ff8f00;
        `;
      // Haani Max retired
      case 'Referral Commission':
        return `
          background-color: #e8f5e9;
          color: #388e3c;
        `;
      case 'Tenant Refund':
        return `
          background-color: #f3e5f5;
          color: #7b1fa2;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #616161;
        `;
    }
  }}
`;

const Amount = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background-color: #fff8e1;
          color: #ff8f00;
        `;
      case 'paid':
        return `
          background-color: #e8f5e9;
          color: #388e3c;
        `;
      case 'approved':
        return `
          background-color: #e3f2fd;
          color: #1976d2;
        `;
      case 'rejected':
        return `
          background-color: #ffebee;
          color: #c62828;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #616161;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: ${Theme.colors.gray2};
  text-align: center;
  
  svg {
    font-size: 3rem;
    margin-bottom: 16px;
    color: ${Theme.colors.gray};
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  svg {
    animation: spin 1s linear infinite;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? Theme.colors.secondary : Theme.colors.gray};
  border-radius: 4px;
  background-color: ${props => props.$active ? Theme.colors.secondary : 'white'};
  color: ${props => props.$active ? 'white' : Theme.colors.gray2};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? Theme.colors.secondary : '#f5f5f5'};
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: ${Theme.borders.radius.sm};
  padding: 0 1rem;
  width: 300px;
  
  input {
    flex: 1;
    border: none;
    padding: 0.75rem 0;
    outline: none;
    
    &::placeholder {
      color: ${Theme.colors.gray2};
    }
  }
  
  svg {
    color: ${Theme.colors.gray2};
    margin-right: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: 1px solid ${Theme.colors.tertiary};
  border-radius: 4px;
  background-color: white;
  color: ${Theme.colors.gray2};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    margin-right: 6px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PaginationButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.$active ? Theme.colors.secondary : Theme.colors.gray};
  border-radius: 4px;
  background-color: ${props => props.$active ? Theme.colors.secondary : 'white'};
  color: ${props => props.$disabled ? Theme.colors.gray : props.$active ? 'white' : Theme.colors.gray2};
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$disabled ? 'white' : props.$active ? Theme.colors.secondary : '#f5f5f5'};
  }
`;

const TotalAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${Theme.colors.primary};
  margin-top: 20px;
  text-align: right;
`;

const PayoutsHistoryPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'advertiser' | 'tenant' | 'pending' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastDocId, setLastDocId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageSize] = useState(20);
  
  // Load payouts
  const loadPayouts = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Get payouts with pagination
        const result = await getAllPayouts(pageSize, reset ? undefined : (lastDocId || undefined));
        
        if (reset) {
          setPayouts(result.payouts);
          setFilteredPayouts(result.payouts);
        } else {
          setPayouts(prev => [...prev, ...result.payouts]);
          setFilteredPayouts(prev => [...prev, ...result.payouts]);
        }
        
        setLastDocId(result.lastDocId);
        setHasMore(result.hasMore);
      } catch (err) {
        console.error('Error loading payouts:', err);
        setError('Failed to load payouts. Please try again later.');
      }
    } catch (err) {
      console.error('Error loading payouts:', err);
      setError('Failed to load payouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadPayouts(true);
  }, []);
  
  // Handle filter change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPayouts(payouts);
    } else if (filter === 'advertiser' || filter === 'tenant') {
      setFilteredPayouts(payouts.filter(payout => payout.payeeType === filter));
    } else {
      setFilteredPayouts(payouts.filter(payout => payout.status === filter));
    }
  }, [filter, payouts]);
  
  // Handle search term change
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search term is empty, just apply the filter
      if (filter === 'all') {
        setFilteredPayouts(payouts);
      } else if (filter === 'advertiser' || filter === 'tenant') {
        setFilteredPayouts(payouts.filter(payout => payout.payeeType === filter));
      } else {
        setFilteredPayouts(payouts.filter(payout => payout.status === filter));
      }
      return;
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filter payouts by search term
    const matchedPayouts = payouts.filter(payout => {
      return (
        payout.payeeName.toLowerCase().includes(term) ||
        payout.paymentMethod.bankName.toLowerCase().includes(term) ||
        payout.reason.toLowerCase().includes(term)
      );
    });
    
    // Apply both search and filter
    if (filter !== 'all') {
      if (filter === 'advertiser' || filter === 'tenant') {
        setFilteredPayouts(matchedPayouts.filter(payout => payout.payeeType === filter));
      } else {
        setFilteredPayouts(matchedPayouts.filter(payout => payout.status === filter));
      }
    } else {
      setFilteredPayouts(matchedPayouts);
    }
  }, [searchTerm, filter, payouts]);
  
  // Load more payouts
  const handleLoadMore = () => {
    if (hasMore) {
      loadPayouts();
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'MAD') => {
    return `${amount.toLocaleString()} ${currency}`;
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Payee Name', 'Payee Type', 'Reason', 'Amount', 'Status', 'Created Date', 'Paid Date', 'Bank', 'Account Type'];
    const rows = filteredPayouts.map(payout => [
      payout.payeeName,
      payout.payeeType,
      payout.reason,
      `${payout.amount} ${payout.currency || 'MAD'}`,
      payout.status,
      formatDate(payout.createdAt),
      payout.paidAt ? formatDate(payout.paidAt) : '',
      payout.paymentMethod.bankName,
      payout.paymentMethod.type
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payouts-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate total amount
  const totalAmount = filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0);
  
  return (
    <PageContainer>
      <PageHeader title="Payouts History" />
        <FilterBar>
          <FilterGroup>
            {(['all','advertiser','tenant','pending','paid'] as const).map(k => (
              <Pill key={k}
                onClick={() => setFilter(k)}
                style={{
                  cursor: 'pointer',
                  background: filter === k ? `${Theme.colors.tertiary}30` : Theme.colors.white,
                  borderColor: filter === k ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
                }}
              >
                {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1)}
              </Pill>
            ))}
          </FilterGroup>
          
          <FilterGroup>
            <GlassSearchBox>
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </GlassSearchBox>
            <ActionButton onClick={() => loadPayouts(true)}>
              <FaSync /> Refresh
            </ActionButton>
            <ActionButton onClick={exportToCSV}>
              <FaDownload /> Export
            </ActionButton>
          </FilterGroup>
        </FilterBar>
        
        {loading && payouts.length === 0 ? (
          <LoadingState>
            <FaSpinner size={24} />
          </LoadingState>
        ) : error && payouts.length === 0 ? (
          <EmptyState>
            <div>{error}</div>
          </EmptyState>
        ) : filteredPayouts.length === 0 ? (
          <EmptyState>
            <FaInbox size={48} />
            <h3>No payouts found</h3>
            <p>No payouts match your current filters.</p>
          </EmptyState>
        ) : (
          <>
            <GlassCard>
              <GlassTable>
                <thead>
                  <tr>
                    <th>Payee</th>
                    <th>Pay-out Method</th>
                    <th>Reason</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Paid Date</th>
                  </tr>
                </thead>
                <tbody>
                {filteredPayouts.map(payout => (
                  <TableRow key={payout.id} $status={payout.status}>
                    <TableCell>
                      <PayeeInfo>
                        <PayeeName>{payout.payeeName}</PayeeName>
                        <PayeePhone>{payout.payeePhone}</PayeePhone>
                      </PayeeInfo>
                    </TableCell>
                    <TableCell>
                      <PaymentMethodInfo>
                        <BankName>{payout.paymentMethod.bankName}</BankName>
                        <AccountNumber>
                          {payout.paymentMethod.type} ending in {payout.paymentMethod.accountLast4}
                        </AccountNumber>
                      </PaymentMethodInfo>
                    </TableCell>
                    <TableCell>
                      <ReasonBadge $type={payout.reason}>
                        {payout.reason}
                      </ReasonBadge>
                    </TableCell>
                    <TableCell>
                      <Amount>{formatCurrency(payout.amount, payout.currency)}</Amount>
                    </TableCell>
                    <TableCell>
                      <GlassStatusBadge status={payout.status}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </GlassStatusBadge>
                    </TableCell>
                    <TableCell>
                      {formatDateSafe(payout.createdAt)}
                    </TableCell>
                    <TableCell>
                      {payout.paidAt ? formatDateSafe(payout.paidAt) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                </tbody>
              </GlassTable>
            </GlassCard>
            
            <TotalAmount>
              Total: {formatCurrency(totalAmount)}
            </TotalAmount>
            
            {hasMore && (
              <PaginationContainer>
                <PaginationButton onClick={handleLoadMore} disabled={loading}>
                  {loading ? <FaSpinner /> : 'Load More'}
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
    </PageContainer>
  );
};

export default PayoutsHistoryPage; 