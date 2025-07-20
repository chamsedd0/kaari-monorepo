import React, { useState, useEffect } from 'react';
import { UserDashboardStyle } from './styles';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getClientStatistics } from '../../../backend/server-actions/ClientServerActions';
import { usePaymentMethod } from '../../../components/PaymentMethodProvider';

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    reservationsCount: 0,
    pendingReservations: 0,
    approvedReservations: 0,
    rejectedReservations: 0,
    paidReservations: 0,
    movedInReservations: 0,
    refundedReservations: 0,
    cancelledReservations: 0,
    underReviewReservations: 0,
    savedPropertiesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { hasPaymentMethod, openModal } = usePaymentMethod();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const stats = await getClientStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <UserDashboardStyle>
      <div className="dashboard-container">
        <div className="sidebar">
          <h2 className="sidebar-title">{t('user_dashboard.title', 'Dashboard')}</h2>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <button onClick={() => navigate('/dashboard/user')}>
                  {t('user_dashboard.overview', 'Overview')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/user/reservations')}>
                  {t('user_dashboard.reservations', 'Reservations')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/user/favorites')}>
                  {t('user_dashboard.favorites', 'Favorites')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/user/profile')}>
                  {t('user_dashboard.profile', 'Profile')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/user/messages')}>
                  {t('user_dashboard.messages', 'Messages')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard/user/payments')}>
                  {t('user_dashboard.payments', 'Payments & Refunds')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="content">
          {!hasPaymentMethod && (
            <div className="payment-method-alert">
              <div className="alert-content">
                <h3>{t('user_dashboard.payment_method_required', 'Payment Method Required')}</h3>
                <p>{t('user_dashboard.payment_method_description', 'To receive refunds, you need to add your bank account information.')}</p>
              </div>
              <button 
                className="add-payment-method-btn"
                onClick={openModal}
              >
                {t('user_dashboard.add_payment_method', 'Add Payment Method')}
              </button>
            </div>
          )}
          
          <Outlet />
        </div>
      </div>
    </UserDashboardStyle>
  );
};

export default UserDashboard;
