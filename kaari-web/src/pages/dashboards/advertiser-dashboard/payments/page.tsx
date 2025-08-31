import React, { useState, useEffect } from 'react';
import { PaymentsPageStyle } from "./styles";
import SelectFieldBaseModelVariant2 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';
import { getAdvertiserPayments, getAdvertiserPaymentStats, getAdvertiserPendingPayouts } from '../../../../backend/server-actions/PaymentServerActions';
import { getCurrentUserPayoutRequests, requestRentPayout, getCurrentUserPayoutHistory, requestReferralPayout } from '../../../../backend/server-actions/PayoutsServerActions';
import { formatDateSafe } from '../../../../utils/dates';
import { PurpleButtonMB48 } from '../../../../components/skeletons/buttons/purple_MB48';
import { BorderPurpleLB40 } from '../../../../components/skeletons/buttons/border_purple_LB40';
import { PayoutRequest, Payout } from '../../../../services/PayoutsService';
import { usePaymentMethod } from '../../../../components/PaymentMethodProvider';
import { toast } from 'react-toastify';

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
  const { isModalOpen, openModal, closeModal, hasPaymentMethod, checkPaymentMethod, ensurePaymentMethod } = usePaymentMethod();
  const [pendingPayoutSchedule, setPendingPayoutSchedule] = useState<Record<string, Date>>({});
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Helper to fetch pending schedules with a simple retry
  const fetchPendingSchedules = async () => {
    try {
      const pending = await getAdvertiserPendingPayouts();
      const map: Record<string, Date> = {};
      pending.forEach(p => { map[p.reservationId] = p.scheduledReleaseDate; });
      setPendingPayoutSchedule(map);
    } catch (e1) {
      // Retry once
      try {
        const pending2 = await getAdvertiserPendingPayouts();
        const map2: Record<string, Date> = {};
        pending2.forEach(p => { map2[p.reservationId] = p.scheduledReleaseDate; });
        setPendingPayoutSchedule(map2);
      } catch {
        // Graceful fallback: keep existing map; UI already falls back to generic label
      }
    }
  };

  // Load advertiser payments and stats
  useEffect(() => {
    loadPayments();
  }, []);

  // Refresh countdowns every minute
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);
  
  // Function to load payments data
  const loadPayments = async () => {
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
      // Fetch pending payout schedules with retry
      await fetchPendingSchedules();
      
      setError(null);
    } catch (err: any) {
      console.error('Error loading payment data:', err);
      setError(err.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };
  
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
    if (!value) return;
    const lc = value.toLowerCase();
    if (lc.includes('tenant')) setSortBy('tenant');
    else if (lc.includes('property')) setSortBy('property');
    else setSortBy('date');
  };
  
  // Handle request payout (kept for referrals; rent is auto-scheduled by system)
  const handleRequestPayout = async (type: string, id: string) => {
    // First check if the user has a payment method
    ensurePaymentMethod(async () => {
      // This callback will only run if the user has a payment method
      try {
        setPayoutLoading(true);
        setPayoutError(null);
        setPayoutSuccess(null);
        
        if (type === 'referral') {
          const success = await requestReferralPayout(id);
          if (success) {
            setPayoutSuccess('Referral payout requested successfully');
            toast.success('Referral payout requested successfully');
          } else {
            throw new Error('Failed to request referral payout');
          }
        }
        
        // Refresh data
        await loadPayments();
      } catch (err: any) {
        console.error('Error requesting payout:', err);
        setPayoutError(err.message || 'Failed to request payout');
        toast.error('Failed to request payout');
      } finally {
        setPayoutLoading(false);
      }
    });
  };
  
  // Payout requests are not used for rent (auto-scheduled). Still used for referrals in the Payouts tab.
  
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
      
      {!hasPaymentMethod && (
        <div className="payment-method-alert">
          <div className="alert-content">
            <h3>{t('advertiser_dashboard.payments.payment_method_required', 'Payment Method Required')}</h3>
            <p>{t('advertiser_dashboard.payments.payment_method_description', 'To receive payments, you need to add your bank account information.')}</p>
          </div>
          <button 
            className="add-payment-method-btn"
            onClick={openModal}
          >
            {t('advertiser_dashboard.payments.add_payment_method', 'Add Payment Method')}
          </button>
        </div>
      )}
      
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
              <SelectFieldBaseModelVariant2
                options={[
                  t('advertiser_dashboard.payments.sort_by_date', 'By date'),
                  t('advertiser_dashboard.payments.sort_by_tenant', 'By tenant'),
                  t('advertiser_dashboard.payments.sort_by_property', 'By property')
                ]}
                placeholder={t('advertiser_dashboard.payments.sort_placeholder', 'Sort by...')}
                value={t(
                  sortBy === 'tenant' ? 'advertiser_dashboard.payments.sort_by_tenant' :
                  sortBy === 'property' ? 'advertiser_dashboard.payments.sort_by_property' :
                  'advertiser_dashboard.payments.sort_by_date',
                  sortBy === 'tenant' ? 'By tenant' : sortBy === 'property' ? 'By property' : 'By date'
                )}
                onChange={handleSortChange}
              />
            </div>
            <div className="border-container" style={{ marginTop: 12, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8 }}>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                {t('advertiser_dashboard.payments.info_auto_payouts', 'Note: Rent payouts are created automatically 24h after tenant move-in (safety window). Referral payouts can be requested below.')}
              </div>
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
                        <td title={(() => {
                              if (paymentItem.payment.status !== 'pending') return undefined as unknown as string;
                              const releaseAt = pendingPayoutSchedule[paymentItem.payment.reservationId];
                              return releaseAt ? `Releases at ${releaseAt.toLocaleString()}` : undefined as unknown as string;
                            })()}>
                          {paymentItem.payment.status === 'completed' ? (
                            t('advertiser_dashboard.payments.status_completed', 'Completed')
                          ) : paymentItem.payment.status === 'pending' ? (
                            (() => {
                              const releaseAt = pendingPayoutSchedule[paymentItem.payment.reservationId];
                              if (!releaseAt) return t('advertiser_dashboard.payments.status_pending', 'Pending (24h after move-in)');
                              const ms = Math.max(0, releaseAt.getTime() - nowTick);
                              const hours = Math.ceil(ms / (60*60*1000));
                              return `${t('advertiser_dashboard.payments.status_pending', 'Pending')} · ${hours}h`;
                            })()
                          ) : (
                            paymentItem.payment.status
                          )}
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
                          {formatDateSafe(paymentItem.payment.paymentDate)}
                        </td>
                        <td>
                          {paymentItem.payment.transactionId || paymentItem.payment.id.substring(0, 7)}
                        </td>
                        <td>
                          {paymentItem.payment.status === 'pending' ? (
                            <span className="payout-status pending">
                              {t('advertiser_dashboard.payments.not_available_yet', 'Not available yet')}
                            </span>
                          ) : (
                            <span className="payout-status approved">
                              {t('advertiser_dashboard.payments.status_completed', 'Completed')}
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
                          {formatDateSafe(request.createdAt)}
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
                          {formatDateSafe(payout.createdAt)}
                        </td>
                        <td>
                          {payout.paidAt ? formatDateSafe(payout.paidAt) : '-'}
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
