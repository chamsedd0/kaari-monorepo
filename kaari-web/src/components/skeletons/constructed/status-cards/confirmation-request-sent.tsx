import React from 'react';
import { StatusCardStylePending } from '../../../styles/constructed/status-card/status-card-style-pending';
import { WhiteButtonLB48 } from '../../buttons/white_LB48';
import girlThumbsUpImage from './icons/girl-thumps-up.svg';

interface ConfirmationRequestSentCardProps {
    onCancel?: () => void;
}

export const ConfirmationRequestSentCard: React.FC<ConfirmationRequestSentCardProps> = ({ onCancel }) => {
    return (
        <StatusCardStylePending>
            <div className="left-container">
                <div className="text-container">
                    <div className="confirmation-status-text">Confirmation Status</div>
                    <div className="h3-text">Your Request has been sent!</div>
                </div>
                <div className="text16-text">
                    We will keep you updated on your request.<br />
                    Make sure to check emails regularly.
                </div>
                <div className="button-container">
                <WhiteButtonLB48 text="Cancel without charge" />
                </div>
            </div>
            <div className="right-container">
                <img src={girlThumbsUpImage} alt="Confirmation illustration" />
            </div>
        </StatusCardStylePending>
    );
};

