import React, { useState, useEffect } from 'react';
import { PaymentsPageStyle } from "./styles";
import SelectFieldBaseModelVariant1 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';
import { getAdvertiserPayments, getAdvertiserPaymentStats } from '../../../../backend/server-actions/PaymentServerActions';
import { getCurrentUserPayoutRequests, requestRentPayout, getCurrentUserPayoutHistory } from '../../../../backend/server-actions/PayoutsServerActions';
import { formatDate } from '../../../../utils/date-utils';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BorderPurpleLB40 } from '../../../../components/skeletons/buttons/border_purple_LB40';
import { PayoutRequest, Payout } from '../../../../services/PayoutsService';
import { usePaymentMethod } from '../../../../components/PaymentMethodProvider';
import { toast } from 'react-toastify';
import { requestReferralPayout } from '../../../../backend/server-actions/ReferralServerActions';

const PaymentsPage = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState({
    totalCollected: 0,
    paymentCount: 0,
    pendingAmount: 0
  });
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<Payout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [payoutLoading, setPayoutLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [activeTab, setActiveTab] = useState<'payments' | 'payouts' | 'history'>('payments');
  const { ensurePaymentMethod } = usePaymentMethod();

  // Load advertiser payments and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch payments data
        const paymentsData = await getAdvertiserPayments();
        setPayments(paymentsData);
        
        // Fetch payment statistics
        const stats = await getAdvertiserPaymentStats();
        setPaymentStats(stats);
        
        // Fetch payout requests
        const requests = await getCurrentUserPayoutRequests();
        setPayoutRequests(requests);
        
        setError(null);
      } catch (err: any) {
        console.error('Error loading payment data:', err);
        setError(err.message || 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Load payout history
  useEffect(() => {
    const fetchPayoutHistory = async () => {
      try {
        setHistoryLoading(true);
        const history = await getCurrentUserPayoutHistory();
        setPayoutHistory(history);
        setHistoryError(null);
      } catch (err: any) {
        console.error('Error loading payout history:', err);
        setHistoryError(err.message || 'Failed to load payout history');
        setPayoutHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };
    
    // Only fetch history when the history tab is active
    if (activeTab === 'history') {
      fetchPayoutHistory();
    }
  }, [activeTab]);

  // Sort payments based on selected option
  const sortedPayments = [...payments].sort((a, b) => {
    switch (sortBy) {
      case 'tenant':
        return (a.client?.name || '').localeCompare(b.client?.name || '');
      case 'property':
        return (a.property?.title || '').localeCompare(b.property?.title || '');
      case 'date':
      default:
        return new Date(b.payment.paymentDate).getTime() - new Date(a.payment.paymentDate).getTime();
    }
  });

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value.toLowerCase().split(' ')[1]);
  };
  
  // Handle request payout
  const handleRequestPayout = async (type: string, id: string) => {
    // First check if the user has a payment method
    const hasPaymentMethod = await ensurePaymentMethod();
    if (!hasPaymentMethod) {
      // The modal will be shown automatically by the ensurePaymentMethod function
      return;
    }
    
    // Continue with the payout request
    try {
      setLoading(true);
      
      if (type === 'rent') {
        await requestRentPayout(id);
        toast.success('Rent payout requested successfully');
      } else if (type === 'referral') {
        await requestReferralPayout(id);
        toast.success('Referral payout requested successfully');
      }
      
      // Refresh data
      await loadPayments();
    } catch (error) {
      console.error('Error requesting payout:', error);
      toast.error('Failed to request payout');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if a payout request exists for a reservation
  const hasPayoutRequest = (reservationId: string): boolean => {
    return payoutRequests.some(request => 
      request.sourceType === 'rent' && 
      request.sourceId === reservationId
    );
  };
  
  // Get payout request status for a reservation
  const getPayoutRequestStatus = (reservationId: string): string => {
    const request = payoutRequests.find(req => 
      req.sourceType === 'rent' && 
      req.sourceId === reservationId
    );
    
    if (!request) return 'none';
    
    return request.status;
  };
  
  // Format payout status for display
  const formatPayoutStatus = (status: string): string => {
    switch (status) {
      case 'pending':
        return t('advertiser_dashboard.payments.payout_status_pending', 'Pending');
      case 'approved':
        return t('advertiser_dashboard.payments.payout_status_approved', 'Approved');
      case 'rejected':
        return t('advertiser_dashboard.payments.payout_status_rejected', 'Rejected');
      case 'paid':
        return t('advertiser_dashboard.payments.payout_status_paid', 'Paid');
      default:
        return t('advertiser_dashboard.payments.payout_status_none', 'Not Requested');
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
    return `${amount.toLocaleString()} ${currency}`;
  };
  
  return (
    <PaymentsPageStyle>
      <h1 className="title">{t('advertiser_dashboard.payments.title', 'Payments')}</h1>
      
      <div className="payments-stats">
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.total_collected', 'Total collected')}</div>
          <div className="payment-stat-value">
            {loading ? '...' : `${paymentStats.totalCollected} MAD`}
          </div>
        </div>
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.number_of_payments', 'Number of payments')}</div>
          <div className="payment-number">
            {loading ? '...' : paymentStats.paymentCount}
          </div>
        </div>
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.pending_amount', 'Pending amount')}</div>
          <div className="payment-pending">
            {loading ? '...' : `${paymentStats.pendingAmount} MAD`}
          </div>
        </div>
      </div>
      
      <div className="payments-content">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`} 
            onClick={() => setActiveTab('payments')}
          >
            {t('advertiser_dashboard.payments.tab_payments', 'Payments')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'payouts' ? 'active' : ''}`} 
            onClick={() => setActiveTab('payouts')}
          >
            {t('advertiser_dashboard.payments.tab_payouts', 'Payout Requests')}
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            {t('advertiser_dashboard.payments.tab_history', 'Payout History')}
          </button>
        </div>
        
        {activeTab === 'payments' && (
          <>
            <div className="slider-container">
              <SelectFieldBaseModelVariant1
                options={[
                  t('advertiser_dashboard.payments.sort_by_date', 'By date'), 
                  t('advertiser_dashboard.payments.sort_by_tenant', 'By tenant'), 
                  t('advertiser_dashboard.payments.sort_by_property', 'By property')
                ]}
                placeholder={t('advertiser_dashboard.payments.select_status', 'Select Status')}
                value={t('advertiser_dashboard.payments.all', 'All')}
                onChange={handleSortChange}
              />
            </div>
            <div className="border-container">
              {loading ? (
                <div className="loading-indicator">Loading payment data...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : sortedPayments.length === 0 ? (
                <div className="no-data-message">No payment records found.</div>
              ) : (
                <table className="tenants-table">
                  <thead>
                    <tr>
                      <th>{t('advertiser_dashboard.payments.column_tenant', 'Tenant')}</th>
                      <th>{t('advertiser_dashboard.payments.column_status', 'Status')}</th>
                      <th>{t('advertiser_dashboard.payments.column_property', 'Property')}</th>
                      <th>{t('advertiser_dashboard.payments.column_amount', 'Amount')}</th>
                      <th>{t('advertiser_dashboard.payments.column_date', 'Date')}</th>
                      <th>{t('advertiser_dashboard.payments.column_payment_id', 'Payment ID')}</th>
                      <th>{t('advertiser_dashboard.payments.column_actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPayments.map((paymentItem) => (
                      <tr key={paymentItem.payment.id}>
                        <td>
                          <div className="tenant-info">
                            <span className="tenant-name">
                              {paymentItem.client?.name && paymentItem.client?.surname 
                                ? `${paymentItem.client.name} ${paymentItem.client.surname}`
                                : paymentItem.client?.name || 'Unknown Client'}
                            </span>
                          </div>
                        </td>
                        <td>
                          {paymentItem.payment.status === 'completed' 
                            ? t('advertiser_dashboard.payments.status_completed', 'Completed')
                            : paymentItem.payment.status === 'pending'
                              ? t('advertiser_dashboard.payments.status_pending', 'Pending (24h after move-in)')
                              : paymentItem.payment.status}
                        </td>
                        <td>
                          <div className="property-info">
                            <span className="property-name">
                              {paymentItem.property?.title || 'Unknown Property'}
                              {paymentItem.property?.location?.city && `, ${paymentItem.property.location.city}`}
                            </span>
                          </div>
                        </td>
                        <td>
                          {`${paymentItem.payment.amount} ${paymentItem.payment.currency || 'MAD'}`}
                        </td>
                        <td className="move-in-date">
                          {formatDate(paymentItem.payment.paymentDate)}
                        </td>
                        <td>
                          {paymentItem.payment.transactionId || paymentItem.payment.id.substring(0, 7)}
                        </td>
                        <td>
                          {paymentItem.payment.status === 'completed' && paymentItem.reservation?.status === 'movedIn' && !hasPayoutRequest(paymentItem.reservation.id) ? (
                            <button 
                              className="request-payout-button"
                              onClick={() => handleRequestPayout('rent', paymentItem.reservation.id)}
                              disabled={payoutLoading}
                            >
                              {payoutLoading ? 'Processing...' : 'Request Payout'}
                            </button>
                          ) : paymentItem.payment.status === 'pending' ? (
                            <span className="payout-status pending">
                              {t('advertiser_dashboard.payments.not_available_yet', 'Not available yet')}
                            </span>
                          ) : (
                            <span className={`payout-status ${getPayoutRequestStatus(paymentItem.reservation?.id || '')}`}>
                              {formatPayoutStatus(getPayoutRequestStatus(paymentItem.reservation?.id || ''))}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'payouts' && (
          <>
            <h2 className="section-title">{t('advertiser_dashboard.payments.payout_requests', 'Payout Requests')}</h2>
            
            {payoutSuccess && (
              <div className="success-message">{payoutSuccess}</div>
            )}
            
            {payoutError && (
              <div className="error-message">{payoutError}</div>
            )}
            
            <div className="border-container">
              {loading ? (
                <div className="loading-indicator">Loading payout requests...</div>
              ) : payoutRequests.length === 0 ? (
                <div className="no-data-message">No payout requests found.</div>
              ) : (
                <table className="tenants-table">
                  <thead>
                    <tr>
                      <th>{t('advertiser_dashboard.payments.column_request_type', 'Request Type')}</th>
                      <th>{t('advertiser_dashboard.payments.column_amount', 'Amount')}</th>
                      <th>{t('advertiser_dashboard.payments.column_status', 'Status')}</th>
                      <th>{t('advertiser_dashboard.payments.column_date', 'Date Requested')}</th>
                      <th>{t('advertiser_dashboard.payments.column_payment_method', 'Payment Method')}</th>
                      <th>{t('advertiser_dashboard.payments.column_notes', 'Notes')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutRequests.map((request) => (
                      <tr key={request.id} className={`request-row ${request.status}`}>
                        <td>
                          {request.reason}
                        </td>
                        <td>
                          {`${request.amount} ${request.currency}`}
                        </td>
                        <td className={`status ${request.status}`}>
                          {formatPayoutStatus(request.status)}
                        </td>
                        <td>
                          {formatDate(request.createdAt)}
                        </td>
                        <td>
                          {request.paymentMethod ? 
                            `${request.paymentMethod.bankName} (${request.paymentMethod.type} ending in ${request.paymentMethod.accountLast4})` : 
                            'Not specified'}
                        </td>
                        <td>
                          {request.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            <h2 className="section-title">{t('advertiser_dashboard.payments.payout_history', 'Payout History')}</h2>
            
            <div className="border-container">
              {historyLoading ? (
                <div className="loading-indicator">Loading payout history...</div>
              ) : historyError ? (
                <div className="error-message">{historyError}</div>
              ) : payoutHistory.length === 0 ? (
                <div className="no-data-message">No payout history found.</div>
              ) : (
                <table className="tenants-table">
                  <thead>
                    <tr>
                      <th>{t('advertiser_dashboard.payments.column_reason', 'Reason')}</th>
                      <th>{t('advertiser_dashboard.payments.column_amount', 'Amount')}</th>
                      <th>{t('advertiser_dashboard.payments.column_status', 'Status')}</th>
                      <th>{t('advertiser_dashboard.payments.column_created_date', 'Created Date')}</th>
                      <th>{t('advertiser_dashboard.payments.column_paid_date', 'Paid Date')}</th>
                      <th>{t('advertiser_dashboard.payments.column_payment_method', 'Payment Method')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payoutHistory.map((payout) => (
                      <tr key={payout.id} className={`payout-row ${payout.status}`}>
                        <td>
                          <span className={`reason-badge ${payout.reason.replace(/\s+/g, '-').toLowerCase()}`}>
                            {payout.reason}
                          </span>
                        </td>
                        <td>
                          {formatCurrency(payout.amount, payout.currency)}
                        </td>
                        <td className={`status ${payout.status}`}>
                          {formatPayoutStatus(payout.status)}
                        </td>
                        <td>
                          {formatDate(payout.createdAt)}
                        </td>
                        <td>
                          {payout.paidAt ? formatDate(payout.paidAt) : '-'}
                        </td>
                        <td>
                          {payout.paymentMethod ? 
                            `${payout.paymentMethod.bankName} (${payout.paymentMethod.type} ending in ${payout.paymentMethod.accountLast4})` : 
                            'Not specified'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </PaymentsPageStyle>
  );
};

export default PaymentsPage;
