import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { Theme } from '../../../../theme/theme';
import {
  DashboardCard,
  CardTitle,
  CardContent,
} from '../styles';
import { getAllPendingPayouts, markPayoutAsPaid } from '../../../../backend/server-actions/PayoutsServerActions';

// Types
interface Payout {
  id: string;
  payeeId: string;
  payeeName: string;
  payeePhone: string;
  payeeType: 'advertiser' | 'tenant';
  paymentMethod: {
    bankName: string;
    accountLast4: string;
    type: 'RIB' | 'IBAN';
  };
  reason: 'Rent – Move-in' | 'Cushion – Pre-move Cancel' | 'Cushion – Haani Max Cancel' | 'Referral Commission' | 'Tenant Refund';
  amount: number;
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
      case 'Cushion – Haani Max Cancel':
        return `
          background-color: #fce4ec;
          color: #c2185b;
        `;
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

const ActionButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.$disabled ? Theme.colors.gray : Theme.colors.primary};
  color: white;
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.$disabled ? Theme.colors.gray : Theme.colors.secondary};
  }
  
  svg {
    margin-right: 6px;
  }
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

const TotalAmount = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${Theme.colors.primary};
  margin-top: 20px;
  text-align: right;
`;

const PendingPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayouts, setProcessingPayouts] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'advertiser' | 'tenant'>('all');
  
  // Load payouts
  useEffect(() => {
    const loadPayouts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          // Get real data from Firestore
          const allPayouts = await getAllPendingPayouts();
          
          if (allPayouts && allPayouts.length > 0) {
            setPayouts(allPayouts);
            setFilteredPayouts(allPayouts);
          } else {
            // No payouts found
            setPayouts([]);
            setFilteredPayouts([]);
          }
        } catch (err) {
          console.error('Error loading payouts from Firestore:', err);
          setError('Failed to load pending payouts. Please try again later.');
          setPayouts([]);
          setFilteredPayouts([]);
        }
      } catch (err) {
        console.error('Error loading payouts:', err);
        setError('Failed to load pending payouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPayouts();
  }, []);
  
  // Handle filter change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredPayouts(payouts);
    } else {
      setFilteredPayouts(payouts.filter(payout => payout.payeeType === filter));
    }
  }, [filter, payouts]);
  
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
      
      // Update local state
      setPayouts(prevPayouts => 
        prevPayouts.filter(payout => payout.id !== payoutId)
      );
      setFilteredPayouts(prevPayouts => 
        prevPayouts.filter(payout => payout.id !== payoutId)
      );
    } catch (err) {
      console.error('Error marking payout as paid:', err);
      setError('Failed to mark payout as paid. Please try again later.');
    } finally {
      setProcessingPayouts(prev => ({ ...prev, [payoutId]: false }));
    }
  };
  
  // Calculate total amount
  const totalAmount = filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} MAD`;
  };
  
  return (
    <DashboardCard>
      <CardTitle>Pending Payouts</CardTitle>
      <CardContent>
        <FilterContainer>
          <FilterGroup>
            <FilterButton 
              $active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              $active={filter === 'advertiser'} 
              onClick={() => setFilter('advertiser')}
            >
              Advertisers
            </FilterButton>
            <FilterButton 
              $active={filter === 'tenant'} 
              onClick={() => setFilter('tenant')}
            >
              Tenants
            </FilterButton>
          </FilterGroup>
        </FilterContainer>
        
        {loading ? (
          <LoadingState>
            <FaSpinner size={24} />
          </LoadingState>
        ) : error ? (
          <EmptyState>
            <div>{error}</div>
          </EmptyState>
        ) : filteredPayouts.length === 0 ? (
          <EmptyState>
            <div>No pending payouts found</div>
            <div>When payouts are ready, they will appear here.</div>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Payee</TableHeader>
                  <TableHeader>Pay-out Method</TableHeader>
                  <TableHeader>Reason</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status / Action</TableHeader>
                </tr>
              </TableHead>
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
                      <Amount>{formatCurrency(payout.amount)}</Amount>
                    </TableCell>
                    <TableCell>
                      {payout.status === 'pending' ? (
                        <ActionButton
                          onClick={() => handleMarkAsPaid(payout.id)}
                          $disabled={processingPayouts[payout.id]}
                        >
                          {processingPayouts[payout.id] ? (
                            <FaSpinner />
                          ) : (
                            <FaCheck />
                          )}
                          Mark as Paid
                        </ActionButton>
                      ) : (
                        <StatusBadge $status={payout.status}>
                          Paid
                        </StatusBadge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
            
            <TotalAmount>
              Total: {formatCurrency(totalAmount)}
            </TotalAmount>
          </>
        )}
      </CardContent>
    </DashboardCard>
  );
};

export default PendingPayoutsPage; 