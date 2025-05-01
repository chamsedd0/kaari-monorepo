import React, { useState } from 'react';
import { ModalDeclineReservation } from '../../../styles/constructed/modal/modal-style-base-model-cancellation';
import warningIcon from '../../icons/Report-Icon-primary.svg';
import alertIcon from '../../icons/Report-c-fifth.svg';
import { PurpleButtonMB48 } from '../../buttons/purple_MB48';
import { BpurpleButtonMB48 } from '../../buttons/border_purple_MB48';
import UploadFieldSmall from '../../inputs/upload-fields/upload-field-small';
import SelectFieldSmallModel from '../../inputs/select-fields/select-field-small-model';
import TextAreaBaseModel from '../../inputs/input-fields/textarea-variant';



interface UnlistPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecline: (reason: string, proof?: File) => void;
}

const UnlistPropertyModal: React.FC<UnlistPropertyModalProps> = ({
  isOpen,
  onClose,
  onDecline
}) => {
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [proof, setProof] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleDecline = () => {
    if (reason) {
      const finalReason = reason === 'Other' ? otherReason : reason;
      onDecline(finalReason, proof || undefined);
      onClose();
    }
  };

  const reasonOptions = [
    'Guest no-show',
    'Property unavailable',
    'Maintenance issues',
    'Double booking',
    'Safety concerns',
    'Other'
  ];

  return (
    <ModalDeclineReservation>
      <div className="modal-decline-reservation-container">
        <div className="content-container">
          <button className="close-button" onClick={onClose}>✕</button>
          
          <img src={warningIcon} alt="Warning" />
          
          <div className="text-container">
            <h2 className="title">Unlist Property</h2>
            <p className="description">
              You are trying to unlist a property.
              Please provide us the reason of your action:
            </p>
          </div>
          
          <div className="input-container">
           <SelectFieldSmallModel
            options={reasonOptions}
            value={reason}
            onChange={setReason}
            placeholder="Reason of cancellation"
           />
            

            <UploadFieldSmall
            label="proof"
            />
          </div>

          {reason === 'Other' && (
            <div className="input-container">
              <TextAreaBaseModel
                placeholder="Please specify the reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
          
          <div className="info-container">
            <img src={alertIcon} alt="Alert" />
            <p className="info-text">
              Please provide truthful and accurate information. False
              claims may lead to account suspension.
            </p>
          </div>
          
          <div className="button-container">
          <PurpleButtonMB48 text="Unlist Property" onClick={handleDecline} disabled={!reason} />
          <BpurpleButtonMB48 text="Go back" onClick={onClose} />
          </div>
        </div>
      </div>
    </ModalDeclineReservation>
  );
};

export default UnlistPropertyModal;
