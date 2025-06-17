import React, { useState, useEffect } from 'react';
import { PayoutMethodStyle } from './styles';
import { PurpleButtonMB48 } from '../../../../../../components/skeletons/buttons/purple_MB48';
import { CompletedPaymentCard } from '../../../../../../components/skeletons/cards/completed-payment-card';
import { useTranslation } from 'react-i18next';
import { useChecklist } from '../../../../../../contexts/checklist/ChecklistContext';
import BankAccountCard from '../../../../../../components/skeletons/cards/bank-account-card';
import AddPayoutMethodModal from '../../../../../../components/skeletons/modals/add-payout-method-modal';
import { PayoutMethod } from '../../../../../../backend/entities';
import { PayoutMethodServerActions } from '../../../../../../backend/server-actions/PayoutMethodServerActions';
import { useStore } from '../../../../../../backend/store';
import { useToast } from '../../../../../../contexts/ToastContext';

const PayoutMethodPage: React.FC = () => {
  const { t } = useTranslation();
  const { completeItem } = useChecklist();
  const { addToast } = useToast();
  const { user } = useStore();
  
  const [activeTab, setActiveTab] = useState<'payout' | 'complete'>('payout');
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayoutMethod, setEditingPayoutMethod] = useState<PayoutMethod | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [payoutMethodToDelete, setPayoutMethodToDelete] = useState<PayoutMethod | null>(null);

  // Fetch payout methods on component mount
  useEffect(() => {
    fetchPayoutMethods();
  }, []);

  // Mark the checklist item as completed if a payment method exists
  useEffect(() => {
    if (payoutMethods.length > 0) {
      completeItem('add_payout_method');
    }
  }, [payoutMethods, completeItem]);

  // Fetch payout methods from the server
  const fetchPayoutMethods = async () => {
    try {
      setLoading(true);
      const methods = await PayoutMethodServerActions.getPayoutMethods();
      setPayoutMethods(methods);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payout methods:', error);
      setLoading(false);
    }
  };

  // Handle adding a new payment method
  const handleAddPayoutMethod = async (data: {
    type: 'RIB' | 'IBAN';
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    setAsDefault: boolean;
  }) => {
    try {
      await PayoutMethodServerActions.addPayoutMethod({
        type: data.type,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        setAsDefault: data.setAsDefault
      });
      
      // Refresh payout methods
      await fetchPayoutMethods();
      
      // Close the modal
      setModalOpen(false);
      
      // Show success toast
      addToast(
        'success',
        t('advertiser_dashboard.profile.payout_method.add_success'),
        ''
      );
      
      // Mark checklist item as completed
      completeItem('add_payout_method');
    } catch (error) {
      console.error('Error adding payout method:', error);
      addToast(
        'error',
        t('advertiser_dashboard.profile.payout_method.add_error'),
        ''
      );
    }
  };

  // Handle editing a payment method
  const handleEditPayoutMethod = async (data: {
    type: 'RIB' | 'IBAN';
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    setAsDefault: boolean;
  }) => {
    if (!editingPayoutMethod) return;
    
    try {
      await PayoutMethodServerActions.updatePayoutMethod(editingPayoutMethod.id, {
        type: data.type,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountHolderName: data.accountHolderName,
        isDefault: data.setAsDefault
      });
      
      // Refresh payout methods
      await fetchPayoutMethods();
      
      // Reset editing state and close modal
      setEditingPayoutMethod(null);
      setModalOpen(false);
      
      // Show success toast
      addToast(
        'success',
        t('advertiser_dashboard.profile.payout_method.update_success'),
        ''
      );
    } catch (error) {
      console.error('Error updating payout method:', error);
      addToast(
        'error',
        t('advertiser_dashboard.profile.payout_method.update_error'),
        ''
      );
    }
  };

  // Handle deleting a payment method
  const handleDeletePayoutMethod = async (payoutMethod: PayoutMethod) => {
    try {
      await PayoutMethodServerActions.deletePayoutMethod(payoutMethod.id);
      
      // Refresh payout methods
      await fetchPayoutMethods();
      
      // Show success toast
      addToast(
        'success',
        t('advertiser_dashboard.profile.payout_method.delete_success'),
        ''
      );
    } catch (error) {
      console.error('Error deleting payout method:', error);
      addToast(
        'error',
        t('advertiser_dashboard.profile.payout_method.delete_error'),
        ''
      );
    }
  };

  // Handle setting a payment method as default
  const handleSetDefaultPayoutMethod = async (payoutMethod: PayoutMethod) => {
    try {
      await PayoutMethodServerActions.setDefaultPayoutMethod(payoutMethod.id);
      
      // Refresh payout methods
      await fetchPayoutMethods();
      
      // Show success toast
      addToast(
        'success',
        t('advertiser_dashboard.profile.payout_method.default_success'),
        ''
      );
    } catch (error) {
      console.error('Error setting default payout method:', error);
      addToast(
        'error',
        t('advertiser_dashboard.profile.payout_method.default_error'),
        ''
      );
    }
  };

  // Open the modal for adding a new payment method
  const openAddPayoutMethodModal = () => {
    setEditingPayoutMethod(null);
    setModalOpen(true);
  };

  // Open the modal for editing a payment method
  const openEditPayoutMethodModal = (payoutMethod: PayoutMethod) => {
    setEditingPayoutMethod(payoutMethod);
    setModalOpen(true);
  };

  // Handle modal submission (add or edit)
  const handleModalSubmit = (data: {
    type: 'RIB' | 'IBAN';
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    setAsDefault: boolean;
  }) => {
    if (editingPayoutMethod) {
      handleEditPayoutMethod(data);
    } else {
      handleAddPayoutMethod(data);
    }
  };

  return (
    <PayoutMethodStyle>
      <div className="title-container">
        <h1 className="title">{t('advertiser_dashboard.profile.payout_method.title')}</h1>
        <div className="payout-complete-container">
          <div 
            className={`payout-text ${activeTab === 'payout' ? 'active' : ''}`}
            onClick={() => setActiveTab('payout')}
          >
            {t('advertiser_dashboard.profile.payout_method.payout_tab')}
          </div>
          <div 
            className={`payout-text ${activeTab === 'complete' ? 'active' : ''}`}
            onClick={() => setActiveTab('complete')}
          >
            {t('advertiser_dashboard.profile.payout_method.completed_tab')}
          </div>
        </div>
      </div>

      <div className="content-container">
        {activeTab === 'payout' && (
          <div className="content-container">
            <h2 className="content-title">{t('advertiser_dashboard.profile.payout_method.payment_methods')}</h2>
            
            {loading ? (
              <p>Loading...</p>
            ) : payoutMethods.length === 0 ? (
              <p className="content-description">
                {t('advertiser_dashboard.profile.payout_method.no_payment_methods')}
              </p>
            ) : (
              payoutMethods.map((payoutMethod) => (
                <BankAccountCard
                  key={payoutMethod.id}
                  payoutMethod={payoutMethod}
                  onEdit={openEditPayoutMethodModal}
                  onDelete={handleDeletePayoutMethod}
                  onSetDefault={handleSetDefaultPayoutMethod}
                />
              ))
            )}
            
            <div className="add-payment-method-button">
              <PurpleButtonMB48 
                onClick={openAddPayoutMethodModal}
                text={t('advertiser_dashboard.profile.payout_method.add_payment_method')} 
              />
            </div>
          </div>
        )}
        
        {activeTab === 'complete' && (
          <div className="content-container">
            <h2 className="content-title">{t('advertiser_dashboard.profile.payout_method.completed_transactions')}</h2>
            <CompletedPaymentCard
              paymentDate="Sep 2024"
              cardType="Master Card"
              cardNumber="1234"
              propertyLocation={t('common.default_city')}
              moveInDate="05.09.2024"
            />
            <CompletedPaymentCard
              paymentDate="Sep 2024"
              cardType="Master Card"
              cardNumber="1234"
              propertyLocation={t('common.default_city')}
              moveInDate="05.09.2024"
            />
            <CompletedPaymentCard
              paymentDate="Sep 2024"
              cardType="Master Card"
              cardNumber="1234"
              propertyLocation={t('common.default_city')}
              moveInDate="05.09.2024"
            />
          </div>
        )}
      </div>
      
      {/* Add/Edit Payout Method Modal */}
      <AddPayoutMethodModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingPayoutMethod(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingPayoutMethod || undefined}
        isEditing={!!editingPayoutMethod}
      />
    </PayoutMethodStyle>
  );
};

export default PayoutMethodPage;

