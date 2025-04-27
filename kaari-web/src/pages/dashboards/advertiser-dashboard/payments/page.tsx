import { PaymentsPageStyle } from "./styles";
import SelectFieldBaseModelVariant1 from '../../../../components/skeletons/inputs/select-fields/select-field-base-model-variant-2';
import { useTranslation } from 'react-i18next';

const PaymentsPage = () => {
  const { t } = useTranslation();
  
  return (
    <PaymentsPageStyle>
      <h1 className="title">{t('advertiser_dashboard.payments.title', 'Payments')}</h1>
      
      <div className="payments-stats">
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.total_collected', 'Total collected')}</div>
          <div className="payment-stat-value">{t('advertiser_dashboard.payments.amount_collected', '2500€')}</div>
        </div>
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.number_of_payments', 'Number of payments')}</div>
          <div className="payment-number">{t('advertiser_dashboard.payments.payment_count', '3')}</div>
        </div>
        <div className="payment-stat border-container">
          <div className="payment-stat-title">{t('advertiser_dashboard.payments.pending_amount', 'Pending amount')}</div>
          <div className="payment-pending">{t('advertiser_dashboard.payments.amount_collected', '2500€')}</div>
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
            onChange={(value) => console.log(value)}
          />
        </div>
        <div className="border-container">
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
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_1', 'John Smith')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_completed', 'Completed')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_1', 'Sunset Apartments New York, NY')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_1', '$1,250.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_1', 'May 15, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_1', 'PAY-001')}</td>
            </tr>
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_2', 'Sarah Johnson')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_completed', 'Completed')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_2', 'Harbor View Boston, MA')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_2', '$1,450.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_2', 'May 12, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_2', 'PAY-002')}</td>
            </tr>
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_3', 'Michael Brown')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_pending', 'Pending')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_3', 'Mountain Retreat Denver, CO')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_3', '$950.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_3', 'May 10, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_3', 'PAY-003')}</td>
            </tr>
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_4', 'Emily Wilson')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_completed', 'Completed')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_4', 'Lakeside Condos Chicago, IL')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_4', '$1,350.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_4', 'May 8, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_4', 'PAY-004')}</td>
            </tr>
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_5', 'David Thompson')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_pending', 'Pending')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_5', 'Urban Lofts Seattle, WA')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_5', '$1,150.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_5', 'May 5, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_5', 'PAY-005')}</td>
            </tr>
            <tr>
              <td>
                <div className="tenant-info">
                  <span className="tenant-name">{t('advertiser_dashboard.payments.tenant_name_6', 'Jessica Martinez')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.status_completed', 'Completed')}</td>
              <td>
                <div className="property-info">
                  <span className="property-name">{t('advertiser_dashboard.payments.property_6', 'Sunshine Villas Miami, FL')}</span>
                </div>
              </td>
              <td>{t('advertiser_dashboard.payments.amount_6', '$1,550.00')}</td>
              <td className="move-in-date">{t('advertiser_dashboard.payments.date_6', 'May 3, 2023')}</td>
              <td>{t('advertiser_dashboard.payments.payment_id_6', 'PAY-006')}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </PaymentsPageStyle>
  );
};

export default PaymentsPage;
