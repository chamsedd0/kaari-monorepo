import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePaymentMethod } from '../../../components/PaymentMethodProvider';
import ReservationsPage from './reservations/page';
import MessagesPage from './messages/page';
import PaymentsPage from './payments/page';
import ReviewsPage from './reviews/page';
import SettingsPage from './settings/page';
import ProfilePage from './profile/page';
import PerksPage from './perks/page';
import ContactsPage from './contacts/page';
import FAQsPage from './FAQs/page';
import { NavigationPannel } from '../../../components/skeletons/constructed/dashboard-navigation-pannel/navigation-pannel';
import { AdvertiserDashboardStyle } from '../advertiser-dashboard/styles';

// Sections supported by user dashboard
 type Section = 'profile' | 'reservations' | 'messages' | 'payments' | 'reviews' | 'settings' | 'contacts' | 'faq' | 'perks';

const URL_TO_SECTION: Record<string, Section> = {
  'profile': 'profile',
  'reservations': 'reservations',
  'messages': 'messages',
  'payments': 'payments',
  'reviews': 'reviews',
  'settings': 'settings',
  'contacts': 'contacts',
  'faq': 'faq',
  'perks': 'perks',
  '': 'profile'
};

const SECTION_TO_URL: Record<Section, string> = {
  'profile': 'profile',
  'reservations': 'reservations',
  'messages': 'messages',
  'payments': 'payments',
  'reviews': 'reviews',
  'settings': 'settings',
  'contacts': 'contacts',
  'faq': 'faq',
  'perks': 'perks'
};

const UserDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPaymentMethod, openModal } = usePaymentMethod();

  const [activeSection, setActiveSection] = useState<Section>(() => {
    const seg = location.pathname.split('/').pop() || '';
    return URL_TO_SECTION[seg] || 'profile';
  });

  useEffect(() => {
    const seg = location.pathname.split('/').pop() || '';
    const newSection = URL_TO_SECTION[seg] || 'profile';
    if (newSection !== activeSection) setActiveSection(newSection);
  }, [location.pathname]);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    navigate(`/dashboard/user/${SECTION_TO_URL[section]}`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfilePage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'reviews':
        return <ReviewsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'perks':
        return <PerksPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'faq':
        return <FAQsPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div style={{ display: 'flex', maxWidth: '1500px', margin: '0 auto' }}>
      <NavigationPannel activeSection={activeSection} onSectionChange={handleSectionChange} />
      <AdvertiserDashboardStyle>
        {!hasPaymentMethod && (
          <div className="payment-method-alert">
            <div className="alert-icon">!</div>
            <div className="alert-content">
              <h3>{t('user_dashboard.payment_method_required', 'Payment method required')}</h3>
              <p>{t('user_dashboard.payment_method_description', "To receive refunds, add a payout method to your account.")}</p>
            </div>
            <button className="add-payment-method-btn" onClick={openModal}>
              {t('user_dashboard.add_payment_method', 'Add Payment Method')}
            </button>
          </div>
        )}
        <div className="section-container">
          {renderSection()}
        </div>
      </AdvertiserDashboardStyle>
    </div>
  );
};

export default UserDashboard;
