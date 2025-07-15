import React, { useState, useEffect } from 'react';
import { PaymentsPageStyle } from "./styles";
import SelectFieldBaseModelVariant1 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';
import { getAdvertiserPayments, getAdvertiserPaymentStats } from '../../../../backend/server-actions/PaymentServerActions';
import { formatDate } from '../../../../utils/date-utils';

const PaymentsPage = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState({
    totalCollected: 0,
    paymentCount: 0,
    pendingAmount: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');

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
        <h2 className="payments-title">{t('advertiser_dashboard.payments.title', 'Payments')}</h2>
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
                      {paymentItem.payment.status === 'completed' 
                        ? t('advertiser_dashboard.payments.status_completed', 'Completed')
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PaymentsPageStyle>
  );
};

export default PaymentsPage;
