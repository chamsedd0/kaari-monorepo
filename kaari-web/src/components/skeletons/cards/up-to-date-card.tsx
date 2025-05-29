import React from 'react';
import { UpToDateCard } from '../../../components/styles/cards/card-base-model-style-up-to-date';
import report from '../icons/Report.svg'
import { WhiteButtonLB48 } from '../../../components/skeletons/buttons/white_LB48';
import { useTranslation } from 'react-i18next';

interface UpToDateCardProps {
  onClick?: () => void;
  propertiesNeedingRefresh?: number;
}

const UpToDateCardComponent: React.FC<UpToDateCardProps> = ({
  onClick = () => {},
  propertiesNeedingRefresh = 0
}) => {
  const { t } = useTranslation();
  
  // Generate dynamic title and description based on count
  const getTitle = () => {
    if (propertiesNeedingRefresh > 1) {
      return t('advertiser_dashboard.properties.refresh_multiple_title', 
        `${propertiesNeedingRefresh} Properties Need Availability Refresh`);
    } else if (propertiesNeedingRefresh === 1) {
      return t('advertiser_dashboard.properties.refresh_single_title', 
        'Property Availability Needs Refresh');
    }
    return t('advertiser_dashboard.properties.keep_availability', 'Keep Availability up to date');
  };
  
  const getDescription = () => {
    if (propertiesNeedingRefresh > 0) {
      return t('advertiser_dashboard.properties.refresh_needed_description', 
        'Some of your properties haven\'t had their availability confirmed in over 7 days. Please refresh them to keep your listings accurate.');
    }
    return t('advertiser_dashboard.properties.availability_description', 
      'Go to the properties section in your profile and modify the availability by unlisting it when it\'s not available and listing it when it is available.');
  };
  
  return (
    <UpToDateCard>
      <div className="report-icon-container">
        <img src={report} alt={t('advertiser_dashboard.properties.report_icon_alt', 'report')} className="report-Icon" />
      </div>
      <h3 className="report-title">
        {getTitle()}
      </h3>
      <p className="report-description">
        {getDescription()}
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
