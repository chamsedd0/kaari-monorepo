import React from 'react';
import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

const MessagesPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;

  .messages-title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 20px;
  }

  .messages-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

const MessagesPage: React.FC = () => {
  return (
    <MessagesPageStyle>
      <h2 className="messages-title">Messages</h2>
      <div className="messages-content">
        <p>This is messages page</p>
      </div>
    </MessagesPageStyle>
  );
};

export default MessagesPage;
