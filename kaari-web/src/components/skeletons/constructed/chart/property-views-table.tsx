import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { useTranslation } from 'react-i18next';
import emptyBox from '../../../../assets/images/emptybox.svg';

interface PropertyData {
  id: string;
  name: string;
  image: string;
  thisMonth: number;
  lastMonth: number;
  clicks: number;
  requests: number;
  listedOn: string;
  totalViews: number;
}

interface PropertyViewsTableProps {
  title: string;
  properties: PropertyData[];
  totalViews: number;
  loading?: boolean;
}

const TableContainer = styled.div`
  background: white;
  border-radius: ${Theme.borders.radius.lg};
  padding: 24px;
  border: ${Theme.borders.primary};
  width: 100%;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${Theme.colors.black};
  margin: 0;
`;

const ViewCount = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${Theme.colors.secondary};
  margin: 0;
`;

const TableContent = styled.div`
  width: 100%;
  border-radius: ${Theme.borders.radius.lg};
  overflow: hidden;
`;

const TableHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 12px 16px;
  border-bottom: ${Theme.borders.primary};
  background-color: #F9F9F9;
`;

const HeaderCell = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${Theme.colors.gray2};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  border-radius: ${Theme.borders.radius.lg};
  border: ${Theme.borders.primary};
  background-color: white;
  
  img {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 700;
    color: ${Theme.colors.primary};
    margin-bottom: 8px;
  }
  
  .description {
    font-size: 14px;
    color: ${Theme.colors.primary};
    max-width: 300px;
    opacity: 0.8;
  }
`;

export const PropertyViewsTable: React.FC<PropertyViewsTableProps> = ({
  title,
  properties = [],
  totalViews = 0,
  loading = false
}) => {
  const { t } = useTranslation();
  const isEmpty = !properties || properties.length === 0;
  
  return (
    <TableContainer>
      <TableHeader>
        <Title>{title}</Title>
        <ViewCount>{totalViews}</ViewCount>
      </TableHeader>
      
      {isEmpty ? (
        <EmptyState>
          <img src={emptyBox} alt="No views" />
          <div className="title">
            {t('advertiser_dashboard.dashboard.no_views', 'You have no views yet')}
          </div>
          <div className="description">
            {t('advertiser_dashboard.dashboard.no_views_hint', 'List your property by booking a photoshoot and start getting views')}
          </div>
        </EmptyState>
      ) : (
        <TableContent>
          <TableHeaderRow>
            <HeaderCell>{t('advertiser_dashboard.dashboard.property', 'Property')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.this_month', 'This month')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.last_month', 'Last Month')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.clicks', 'Clicks')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.requests', 'Requests')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.listed_on', 'Listed on')}</HeaderCell>
            <HeaderCell>{t('advertiser_dashboard.dashboard.total_views', 'Total Views')}</HeaderCell>
          </TableHeaderRow>
          {/* Property rows would go here */}
        </TableContent>
      )}
    </TableContainer>
  );
}; 