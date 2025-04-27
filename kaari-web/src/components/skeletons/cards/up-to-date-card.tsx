import React from 'react';
import { UpToDateCard } from '../../../components/styles/cards/card-base-model-style-up-to-date';
import report from '../icons/Report.svg'
import { WhiteButtonLB48 } from '../../../components/skeletons/buttons/white_LB48';

interface UpToDateCardProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const UpToDateCardComponent: React.FC<UpToDateCardProps> = ({
  title = "Keep Availability up to date",
  description = "Go to the properties section in your profile and modify the availability by unlisting it when it's not available and listing it when it is available.",
  onClick = () => {}
}) => {
  return (
    <UpToDateCard>
      <div className="report-icon-container">
        <img src={report} alt="report" className="report-Icon" />
      </div>
      <h3 className="report-title">{title}</h3>
      <p className="report-description">{description}</p>
      <div className="report-button">
        <WhiteButtonLB48 text="Go to properties" onClick={() => onClick()} />
      </div>
    </UpToDateCard>
  );
};

export default UpToDateCardComponent;
