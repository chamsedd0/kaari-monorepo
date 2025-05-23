import React from 'react';
import { UpToDateCard } from '../../../components/styles/cards/card-base-model-style-up-to-date';
import report from '../icons/Report.svg'
import { WhiteButtonLB48 } from '../../../components/skeletons/buttons/white_LB48';
import { useTranslation } from 'react-i18next';

interface UpToDateCardProps {
  onClick?: () => void;
}

const UpToDateCardComponent: React.FC<UpToDateCardProps> = ({
  onClick = () => {}
}) => {
  const { t } = useTranslation();
  
  return (
    <UpToDateCard>
      <div className="report-icon-container">
        <img src={report} alt={t('advertiser_dashboard.properties.report_icon_alt', 'report')} className="report-Icon" />
      </div>
      <h3 className="report-title">
        {t('advertiser_dashboard.properties.keep_availability', 'Keep Availability up to date')}
      </h3>
      <p className="report-description">
        {t('advertiser_dashboard.properties.availability_description', 'Go to the properties section in your profile and modify the availability by unlisting it when it\'s not available and listing it when it is available.')}
      </p>
      <div className="report-button">
        <WhiteButtonLB48 
          text={t('advertiser_dashboard.properties.go_to_properties', 'Go to properties')} 
          onClick={() => onClick()} 
        />
      </div>
    </UpToDateCard>
  );
};

export default UpToDateCardComponent;
