import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .verified-badge {
    color: #4CAF50;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const SettingsPageStyle = styled.div`
  display: flex;
  gap: 40px;
  padding: 32px;
  width: 100%;

  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .settings-title {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};
    }

    .settings-info {
      font: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
      margin-bottom: 16px;

      &.warning {
        color: ${Theme.colors.error};
      }
    }

    .settings-password-box {
      .password-field-container {
        display: flex;
        flex-direction: column;
        gap: 16px;

        .row {
          display: flex;
          gap: 16px;
        }
      }
    }

    .save-button {
      margin-top: 24px;
    }

    .email-change {
      margin-top: 32px;

      .email-change-title {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
        margin-bottom: 16px;
      }

      .your-email-info {
        margin-bottom: 24px;

        .current-email {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          margin-bottom: 8px;
        }

        .your-email {
          display: flex;
          align-items: center;
          gap: 8px;
          font: ${Theme.typography.fonts.largeM};
          color: ${Theme.colors.black};

          .verified-badge {
            color: #4CAF50;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }

      .new-email-box {
        .new-email-title {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
          margin-bottom: 8px;
        }
      }
    }
  }

  .right {
    width: 300px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;

    .right {
      width: 100%;
    }
  }
`; 