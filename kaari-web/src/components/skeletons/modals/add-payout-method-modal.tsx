import React, { useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';
import { PayoutMethod } from '../../../backend/entities';

interface AddPayoutMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: 'RIB' | 'IBAN';
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    setAsDefault: boolean;
  }) => void;
  initialData?: PayoutMethod;
  isEditing?: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #252525;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #767676;
  
  &:hover {
    color: #252525;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #252525;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #D1D1D1;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #8F27CE;
  }
  
  &::placeholder {
    color: #767676;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #252525;
`;

const RadioInput = styled.input`
  cursor: pointer;
  accent-color: #8F27CE;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #252525;
  margin-top: 8px;
`;

const CheckboxInput = styled.input`
  cursor: pointer;
  accent-color: #8F27CE;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  background-color: transparent;
  border: 2px solid #8F27CE;
  border-radius: 100px;
  color: #8F27CE;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(143, 39, 206, 0.05);
  }
`;

const SubmitButton = styled.button`
  background-color: #8F27CE;
  border: none;
  border-radius: 100px;
  color: white;
  padding: 10px 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #511B72;
  }
`;

const ErrorMessage = styled.div`
  color: #9B0303;
  font-size: 12px;
  margin-top: 4px;
`;

const AddPayoutMethodModal: React.FC<AddPayoutMethodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false
}) => {
  const { t } = useTranslation();
  
  const [type, setType] = useState<'RIB' | 'IBAN'>(initialData?.type || 'RIB');
  const [accountNumber, setAccountNumber] = useState(initialData?.accountNumber || '');
  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [accountHolderName, setAccountHolderName] = useState(initialData?.accountHolderName || '');
  const [setAsDefault, setSetAsDefault] = useState(initialData?.isDefault || false);
  
  const [errors, setErrors] = useState<{
    accountNumber?: string;
    bankName?: string;
    accountHolderName?: string;
  }>({});
  
  const validateForm = () => {
    const newErrors: {
      accountNumber?: string;
      bankName?: string;
      accountHolderName?: string;
    } = {};
    
    if (!accountNumber) {
      newErrors.accountNumber = t('advertiser_dashboard.profile.payout_method.error.account_number_required');
    } else if (type === 'RIB' && !/^\d{23}$/.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = t('advertiser_dashboard.profile.payout_method.error.invalid_rib');
    } else if (type === 'IBAN' && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = t('advertiser_dashboard.profile.payout_method.error.invalid_iban');
    }
    
    if (!bankName) {
      newErrors.bankName = t('advertiser_dashboard.profile.payout_method.error.bank_name_required');
    }
    
    if (!accountHolderName) {
      newErrors.accountHolderName = t('advertiser_dashboard.profile.payout_method.error.account_holder_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        type,
        accountNumber: accountNumber.replace(/\s/g, ''),
        bankName,
        accountHolderName,
        setAsDefault
      });
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>
            {isEditing 
              ? t('advertiser_dashboard.profile.payout_method.edit_payout_method') 
              : t('advertiser_dashboard.profile.payout_method.add_payout_method')}
          </h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>{t('advertiser_dashboard.profile.payout_method.account_type')}</Label>
            <RadioGroup>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="accountType" 
                  value="RIB" 
                  checked={type === 'RIB'} 
                  onChange={() => setType('RIB')} 
                />
                {t('advertiser_dashboard.profile.payout_method.rib')}
              </RadioLabel>
              <RadioLabel>
                <RadioInput 
                  type="radio" 
                  name="accountType" 
                  value="IBAN" 
                  checked={type === 'IBAN'} 
                  onChange={() => setType('IBAN')} 
                />
                {t('advertiser_dashboard.profile.payout_method.iban')}
              </RadioLabel>
            </RadioGroup>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="accountNumber">
              {type === 'RIB' 
                ? t('advertiser_dashboard.profile.payout_method.rib_number') 
                : t('advertiser_dashboard.profile.payout_method.iban_number')}
            </Label>
            <Input 
              id="accountNumber"
              type="text" 
              value={accountNumber} 
              onChange={(e) => setAccountNumber(e.target.value)} 
              placeholder={
                type === 'RIB' 
                  ? t('advertiser_dashboard.profile.payout_method.rib_placeholder') 
                  : t('advertiser_dashboard.profile.payout_method.iban_placeholder')
              } 
            />
            {errors.accountNumber && <ErrorMessage>{errors.accountNumber}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="bankName">{t('advertiser_dashboard.profile.payout_method.bank_name')}</Label>
            <Input 
              id="bankName"
              type="text" 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)} 
              placeholder={t('advertiser_dashboard.profile.payout_method.bank_name_placeholder')} 
            />
            {errors.bankName && <ErrorMessage>{errors.bankName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="accountHolderName">{t('advertiser_dashboard.profile.payout_method.account_holder')}</Label>
            <Input 
              id="accountHolderName"
              type="text" 
              value={accountHolderName} 
              onChange={(e) => setAccountHolderName(e.target.value)} 
              placeholder={t('advertiser_dashboard.profile.payout_method.account_holder_placeholder')} 
            />
            {errors.accountHolderName && <ErrorMessage>{errors.accountHolderName}</ErrorMessage>}
          </FormGroup>
          
          <CheckboxLabel>
            <CheckboxInput 
              type="checkbox" 
              checked={setAsDefault} 
              onChange={(e) => setSetAsDefault(e.target.checked)} 
            />
            {t('advertiser_dashboard.profile.payout_method.set_as_default')}
          </CheckboxLabel>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              {t('common.cancel')}
            </CancelButton>
            <SubmitButton type="submit">
              {isEditing ? t('common.save') : t('common.add')}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddPayoutMethodModal; 