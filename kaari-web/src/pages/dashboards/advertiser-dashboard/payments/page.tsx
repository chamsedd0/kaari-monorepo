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
import { useToast } from '../../../../contexts/ToastContext';

const PaymentsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState({
    totalCollected: 0,
    paymentCount: 0,
    pendingAmount: 0,
    requestableAmount: 0
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
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [showPayoutConfirmation, setShowPayoutConfirmation] = useState<boolean>(false);

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

  // Load payout history when the history tab is active
  useEffect(() => {
    if (activeTab === 'history' && payoutHistory.length === 0) {
      const fetchPayoutHistory = async () => {
        try {
          setHistoryLoading(true);
          const history = await getCurrentUserPayoutHistory();
          setPayoutHistory(history);
          setHistoryError(null);
        } catch (err: any) {
          console.error('Error loading payout history:', err);
          setHistoryError(err.message || 'Failed to load payout history');
        } finally {
          setHistoryLoading(false);
        }
      };
      
      fetchPayoutHistory();
    }
  }, [activeTab, payoutHistory.length]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Sort payments based on selected sort option
  const sortedPayments = [...payments].sort((a, b) => {
    if (sortBy === 'tenant') {
      const nameA = a.client?.name || '';
      const nameB = b.client?.name || '';
      return nameA.localeCompare(nameB);
    } else if (sortBy === 'property') {
      const propertyA = a.property?.title || '';
      const propertyB = b.property?.title || '';
      return propertyA.localeCompare(propertyB);
    } else {
      // Default sort by date
      return new Date(b.payment.paymentDate).getTime() - new Date(a.payment.paymentDate).getTime();
    }
  });

  // Handle payout request
  const handlePayoutRequest = async () => {
    if (payoutLoading) return;
    
    try {
      setPayoutLoading(true);
      setPayoutError(null);
      setPayoutSuccess(null);
      
      // Request payout for all eligible reservations
      // In a real implementation, you would select specific reservations
      const success = await requestRentPayout(selectedReservationId || '');
      
      if (success) {
        setPayoutSuccess('Payout request submitted successfully.');
        toast.showToast('success', 'Payout Request Submitted', 'Your payout request has been submitted successfully.');
        
        // Refresh data
        const stats = await getAdvertiserPaymentStats();
        setPaymentStats(stats);
        
        const requests = await getCurrentUserPayoutRequests();
        setPayoutRequests(requests);
      } else {
        setPayoutError('Failed to submit payout request.');
        toast.showToast('error', 'Payout Request Failed', 'There was an error submitting your payout request. Please try again.');
      }
      
      setShowPayoutConfirmation(false);
      setSelectedReservationId(null);
    } catch (err: any) {
      console.error('Error requesting payout:', err);
      setPayoutError(err.message || 'Failed to request payout');
      toast.showToast('error', 'Payout Request Failed', err.message || 'Failed to request payout');
    } finally {
      setPayoutLoading(false);
    }
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

  // Handle reservation selection for payout
  const handleReservationSelect = (reservationId: string) => {
    setSelectedReservationId(reservationId);
    setShowPayoutConfirmation(true);
  };
  
  // Cancel payout confirmation
  const cancelPayoutConfirmation = () => {
    setShowPayoutConfirmation(false);
    setSelectedReservationId(null);
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
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.requestable_amount', 'Requestable amount')}</div>
          <div className="payment-requestable">
            {loading ? '...' : `${paymentStats.requestableAmount} MAD`}
          </div>
          {paymentStats.requestableAmount > 0 && (
            <PurpleButtonMB48 
              onClick={() => setShowPayoutConfirmation(true)}
              disabled={payoutLoading}
            >
              {payoutLoading ? 'Processing...' : 'Request Payout'}
            </PurpleButtonMB48>
          )}
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
                          <span className={`status-badge ${paymentItem.payment.status}`}>
                            {paymentItem.payment.status === 'completed' 
                              ? t('advertiser_dashboard.payments.status_completed', 'Completed')
                              : paymentItem.payment.status}
                          </span>
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
                      <tr key={request.id}>
                        <td>
                          <div className="request-type">
                            <span className={`reason-badge ${request.sourceType}`}>
                              {request.reason}
                            </span>
                          </div>
                        </td>
                        <td>
                          {`${request.amount} ${request.currency}`}
                        </td>
                        <td>
                          <span className={`status-badge ${request.status}`}>
                            {formatPayoutStatus(request.status)}
                          </span>
                        </td>
                        <td>
                          {formatDate(request.createdAt)}
                        </td>
                        <td>
                          {request.paymentMethod ? 
                            `${request.paymentMethod.bankName} (${request.paymentMethod.type} ****${request.paymentMethod.accountLast4})` : 
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
                      <tr key={payout.id}>
                        <td>
                          <div className="request-type">
                            <span className={`reason-badge ${payout.sourceType}`}>
                              {payout.reason}
                            </span>
                          </div>
                        </td>
                        <td>
                          {`${payout.amount} ${payout.currency}`}
                        </td>
                        <td>
                          <span className={`status-badge ${payout.status}`}>
                            {formatPayoutStatus(payout.status)}
                          </span>
                        </td>
                        <td>
                          {formatDate(payout.createdAt)}
                        </td>
                        <td>
                          {payout.paidAt ? formatDate(payout.paidAt) : '-'}
                        </td>
                        <td>
                          {payout.paymentMethod ? 
                            `${payout.paymentMethod.bankName} (${payout.paymentMethod.type} ****${payout.paymentMethod.accountLast4})` : 
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
      
      {/* Payout Confirmation Modal */}
      {showPayoutConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request Payout</h3>
            <p>Are you sure you want to request a payout for {formatCurrency(paymentStats.requestableAmount)}?</p>
            <p>The funds will be sent to your registered payment method once approved.</p>
            <div className="modal-actions">
              <BorderPurpleLB40 onClick={cancelPayoutConfirmation} disabled={payoutLoading}>
                Cancel
              </BorderPurpleLB40>
              <PurpleButtonMB48 onClick={handlePayoutRequest} disabled={payoutLoading}>
                {payoutLoading ? 'Processing...' : 'Confirm Request'}
              </PurpleButtonMB48>
            </div>
          </div>
        </div>
      )}
    </PaymentsPageStyle>
  );
};

export default PaymentsPage;
