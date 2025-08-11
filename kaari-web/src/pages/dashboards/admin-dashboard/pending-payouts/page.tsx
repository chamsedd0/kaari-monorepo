import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaSpinner, FaMoneyBillWave, FaFileInvoiceDollar, FaInbox, FaSync, FaFilter, FaSearch } from 'react-icons/fa';
import { Theme } from '../../../../theme/theme';
import { PageContainer, PageHeader, FilterBar, SearchBox as GlassSearchBox, GlassCard, GlassTable, StatusBadge as GlassStatusBadge, Button as AdminUIButton, Pill } from '../../../../components/admin/AdminUI';
import { 
  getAllPendingPayouts, 
  markPayoutAsPaid, 
  getAllPendingPayoutRequests, 
  approvePayoutRequest, 
  rejectPayoutRequest 
} from '../../../../backend/server-actions/PayoutsServerActions';
import { PayoutRequest } from '../../../../services/PayoutsService';

// Types
  interface Payout {
  id: string;
  payeeId: string;
  payeeName: string;
  payeePhone: string;
    payeeType: 'advertiser' | 'tenant' | 'client';
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    type: 'RIB' | 'IBAN';
  };
  reason: 'Rent – Move-in' | 'Cushion – Pre-move Cancel' | 'Referral Commission' | 'Tenant Refund';
  amount: number;
  currency: string;
  status: 'pending' | 'paid';
  createdAt: Date;
  paidAt?: Date;
  sourceId?: string;
  sourceType?: string;
}

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

const TableRow = styled.tr<{ $isPending?: boolean }>`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: ${props => props.$isPending ? '#f3eefb' : '#f9f9f9'};
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

const ActionButton = styled(AdminUIButton).attrs<{ $variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' }>(({ $variant }) => ({ $variant: $variant || 'secondary' }))<{$variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'}>`
  min-width: 120px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 8px;
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

// Replace with shared Pill in render

const TotalAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${Theme.colors.primary};
  margin-top: 20px;
  text-align: right;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid ${Theme.colors.gray};
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.$active ? Theme.colors.secondary : 'transparent'};
  color: ${props => props.$active ? Theme.colors.secondary : Theme.colors.gray2};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: ${Theme.colors.secondary};
  }
  
  svg {
    margin-right: 8px;
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

const RefreshButton = styled.button`
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

const PendingPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [filteredPayoutRequests, setFilteredPayoutRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayouts, setProcessingPayouts] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'advertiser' | 'tenant'>('all');
  const [activeTab, setActiveTab] = useState<'payouts' | 'requests'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load payouts and payout requests
  const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
        // Get pending payouts
          const allPayouts = await getAllPendingPayouts();
            setPayouts(allPayouts as unknown as Payout[]);
            setFilteredPayouts(allPayouts as unknown as Payout[]);
        
        // Get pending payout requests
        const allPayoutRequests = await getAllPendingPayoutRequests();
        setPayoutRequests(allPayoutRequests);
        setFilteredPayoutRequests(allPayoutRequests);
        } catch (err) {
        console.error('Error loading payouts data:', err);
        setError('Failed to load payout data. Please try again later.');
          setPayouts([]);
          setFilteredPayouts([]);
        setPayoutRequests([]);
        setFilteredPayoutRequests([]);
        }
      } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Handle filter change
  useEffect(() => {
    const mapFilter = (f: 'all' | 'advertiser' | 'tenant') => (f === 'tenant' ? 'client' : f);
    if (filter === 'all') {
      setFilteredPayouts(payouts);
      setFilteredPayoutRequests(payoutRequests);
    } else {
      const mapped = mapFilter(filter) as 'advertiser' | 'client';
      setFilteredPayouts(payouts.filter(payout => payout.payeeType === mapped));
      setFilteredPayoutRequests(payoutRequests.filter(request => request.userType === mapped));
    }
  }, [filter, payouts, payoutRequests]);
  
  // Handle search term change
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If search term is empty, just apply the filter
      if (filter === 'all') {
        setFilteredPayouts(payouts);
        setFilteredPayoutRequests(payoutRequests);
      } else {
        const mapped = filter === 'tenant' ? 'client' : filter;
        setFilteredPayouts(payouts.filter(payout => payout.payeeType === mapped));
        setFilteredPayoutRequests(payoutRequests.filter(request => request.userType === mapped));
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
    
    // Filter payout requests by search term
    const matchedRequests = payoutRequests.filter(request => {
      return (
        (request.userId && request.userId.toLowerCase().includes(term)) ||
        (request.reason && request.reason.toLowerCase().includes(term)) ||
        (request.sourceType && request.sourceType.toLowerCase().includes(term))
      );
    });
    
    // Apply both search and type filter
    if (filter !== 'all') {
      const mapped = filter === 'tenant' ? 'client' : filter;
      setFilteredPayouts(matchedPayouts.filter(payout => payout.payeeType === mapped));
      setFilteredPayoutRequests(matchedRequests.filter(request => request.userType === mapped));
    } else {
      setFilteredPayouts(matchedPayouts);
      setFilteredPayoutRequests(matchedRequests);
    }
  }, [searchTerm, filter, payouts, payoutRequests]);
  
  // Mark payout as paid
  const handleMarkAsPaid = async (payoutId: string) => {
    try {
      setProcessingPayouts(prev => ({ ...prev, [payoutId]: true }));
      
      try {
        // Update in Firestore
        await markPayoutAsPaid(payoutId);
      } catch (err) {
        console.error('Error marking payout as paid in Firestore:', err);
        throw err; // Rethrow to handle in the catch block below
      }
      
      // Update local state and ensure counts reflect change
      setPayouts(prevPayouts => prevPayouts.filter(payout => payout.id !== payoutId));
      setFilteredPayouts(prevPayouts => prevPayouts.filter(payout => payout.id !== payoutId));
      // Optionally reload to sync with server
      // await loadData();
    } catch (err) {
      console.error('Error marking payout as paid:', err);
      setError('Failed to mark payout as paid. Please try again later.');
    } finally {
      setProcessingPayouts(prev => ({ ...prev, [payoutId]: false }));
    }
  };
  
  // Approve payout request
  const handleApproveRequest = async (requestId: string) => {
    try {
      setProcessingPayouts(prev => ({ ...prev, [requestId]: true }));
      
      try {
        // Approve the request in Firestore
        await approvePayoutRequest(requestId);
      } catch (err) {
        console.error('Error approving payout request in Firestore:', err);
        throw err;
      }
      
      // Update local state
      setPayoutRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      setFilteredPayoutRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      
      // Refresh payouts list to show the newly created payout
      await loadData();
    } catch (err) {
      console.error('Error approving payout request:', err);
      setError('Failed to approve payout request. Please try again later.');
    } finally {
      setProcessingPayouts(prev => ({ ...prev, [requestId]: false }));
    }
  };
  
  // Reject payout request
  const handleRejectRequest = async (requestId: string) => {
    try {
      setProcessingPayouts(prev => ({ ...prev, [requestId]: true }));
      
      // Ask for rejection reason
      const reason = prompt('Please enter a reason for rejecting this payout request:');
      if (!reason) {
        // User cancelled or didn't provide a reason
        setProcessingPayouts(prev => ({ ...prev, [requestId]: false }));
        return;
      }
      
      try {
        // Reject the request in Firestore
        await rejectPayoutRequest(requestId, reason);
      } catch (err) {
        console.error('Error rejecting payout request in Firestore:', err);
        throw err;
      }
      
      // Update local state
      setPayoutRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
      setFilteredPayoutRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      console.error('Error rejecting payout request:', err);
      setError('Failed to reject payout request. Please try again later.');
    } finally {
      setProcessingPayouts(prev => ({ ...prev, [requestId]: false }));
    }
  };
  
  // Calculate total amounts
  const totalPayoutAmount = filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0);
  const totalRequestAmount = filteredPayoutRequests.reduce((sum, request) => sum + request.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'MAD') => {
    return `${amount.toLocaleString()} ${currency}`;
  };
  
  return (
    <PageContainer>
      <PageHeader title="Pending Payouts" />
        <TabsContainer>
          <Tab 
            $active={activeTab === 'requests'} 
            onClick={() => setActiveTab('requests')}
          >
            <FaFileInvoiceDollar /> Payout Requests ({payoutRequests.length})
          </Tab>
          <Tab 
            $active={activeTab === 'payouts'} 
            onClick={() => setActiveTab('payouts')}
          >
            <FaMoneyBillWave /> Ready to Pay ({payouts.length})
          </Tab>
        </TabsContainer>
        
        <FilterBar>
          <FilterGroup>
            {(['all','advertiser','tenant'] as const).map(k => (
              <Pill key={k}
                onClick={() => setFilter(k)}
                style={{
                  cursor: 'pointer',
                  background: filter === k ? `${Theme.colors.tertiary}30` : Theme.colors.white,
                  borderColor: filter === k ? Theme.colors.tertiary : `${Theme.colors.tertiary}80`
                }}
              >
                {k === 'all' ? 'All' : k === 'advertiser' ? 'Advertisers' : 'Tenants'}
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
            <RefreshButton onClick={loadData}>
              <FaSync /> Refresh
            </RefreshButton>
          </FilterGroup>
        </FilterBar>
        
        {loading ? (
          <LoadingState>
            <FaSpinner size={24} />
          </LoadingState>
        ) : error ? (
          <EmptyState>
            <div>{error}</div>
          </EmptyState>
        ) : activeTab === 'requests' ? (
          // Payout Requests Tab
          filteredPayoutRequests.length === 0 ? (
          <EmptyState>
              <FaInbox size={48} />
              <h3>No pending payout requests found</h3>
              <p>When payout requests are submitted, they will appear here for approval.</p>
            </EmptyState>
          ) : (
            <>
              <GlassCard>
                <GlassTable>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>User Type</th>
                      <th>Reason</th>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>Date Requested</th>
                      <th>Payment Method</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredPayoutRequests.map(request => (
                    <TableRow key={request.id} $isPending={true}>
                      <TableCell>{request.userId}</TableCell>
                      <TableCell>
                        <GlassStatusBadge status={request.userType}>
                          {request.userType === 'advertiser' ? 'Advertiser' : 'Tenant'}
                        </GlassStatusBadge>
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <ReasonBadge $type={request.sourceType || 'unknown'}>
                          {request.sourceType} ({request.sourceId?.substring(0, 7)}...)
                        </ReasonBadge>
                      </TableCell>
                      <TableCell>
                        <Amount>{formatCurrency(request.amount, request.currency)}</Amount>
                      </TableCell>
                      <TableCell>{request.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {request.paymentMethod ? (
                          <PaymentMethodInfo>
                            <BankName>{request.paymentMethod.bankName}</BankName>
                            <AccountNumber>
                              {request.paymentMethod.type} ending in {request.paymentMethod.accountLast4}
                            </AccountNumber>
                          </PaymentMethodInfo>
                        ) : (
                          'Not specified'
                        )}
                      </TableCell>
                      <TableCell>
                        <ActionButtonsContainer>
                          <ActionButton
                            onClick={() => handleApproveRequest(request.id)}
                            disabled={processingPayouts[request.id]}
                          >
                            {processingPayouts[request.id] ? (
                              <FaSpinner />
                            ) : (
                              <FaCheck />
                            )}
                            Approve
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={processingPayouts[request.id]}
                            $variant="destructive"
                          >
                            {processingPayouts[request.id] ? (
                              <FaSpinner />
                            ) : (
                              <FaFilter />
                            )}
                            Reject
                          </ActionButton>
                        </ActionButtonsContainer>
                      </TableCell>
                    </TableRow>
                  ))}
                  </tbody>
                </GlassTable>
              </GlassCard>
              
              <TotalAmount>
                Total Requested: {formatCurrency(totalRequestAmount)}
              </TotalAmount>
            </>
          )
        ) : (
          // Payouts Tab
          filteredPayouts.length === 0 ? (
            <EmptyState>
              <FaInbox size={48} />
              <h3>No pending payouts found</h3>
              <p>When payouts are approved and ready to be paid, they will appear here.</p>
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
                    <th>Status / Action</th>
                  </tr>
                </thead>
                <tbody>
                {filteredPayouts.map(payout => (
                  <TableRow key={payout.id} $isPending={payout.status === 'pending'}>
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
                      {payout.status === 'pending' ? (
                        <ActionButton
                          onClick={() => handleMarkAsPaid(payout.id)}
                          disabled={processingPayouts[payout.id]}
                        >
                          {processingPayouts[payout.id] ? (
                            <FaSpinner />
                          ) : (
                            <FaCheck />
                          )}
                          Mark as Paid
                        </ActionButton>
                      ) : (
                        <GlassStatusBadge status={payout.status}>
                          Paid
                        </GlassStatusBadge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                </tbody>
              </GlassTable>
            </GlassCard>
            
            <TotalAmount>
                Total: {formatCurrency(totalPayoutAmount)}
            </TotalAmount>
          </>
          )
        )}
    </PageContainer>
  );
};

export default PendingPayoutsPage; 