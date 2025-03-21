import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

const ReservationsPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;

  .reservations-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 20px;
  }

  .reservations-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const ReservationsPage: React.FC = () => {
  return (
    <ReservationsPageStyle>
      <h2 className="reservations-title">Reservations</h2>
      <div className="reservations-content">
        <p>This is reservations page</p>
      </div>
    </ReservationsPageStyle>
  );
};

export default ReservationsPage;
