import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';
import { PerformanceChart } from '../../../../components/skeletons/constructed/chart/performance-chart';
const DashboardPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;

  .dashboard-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 20px;
  }

  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const DashboardPage: React.FC = () => {
  return (
    <DashboardPageStyle>
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="dashboard-content">
        <p>This is dashboard</p>
      </div>
    </DashboardPageStyle>
  );
};

export default DashboardPage;
