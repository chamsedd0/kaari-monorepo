import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const TenantsPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;

  .title {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
  }
  .group-title {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
    }

  .tenants-group {
    display: flex;
    flex-direction: column;
    width: 100%;

    .group-title {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
    }
    .tenants-table {
      width: 100%;
      border-collapse: collapse;
      background-color: ${Theme.colors.white};
      border-radius: ${Theme.borders.radius.md};
      overflow: hidden;      
      th, td {
        padding: 24px 20px;
        text-align: left;
      }
      
      th {
        font: ${Theme.typography.fonts.largeB};
        color: ${Theme.colors.black};
        border-bottom: ${Theme.borders.primary};
      }
      
      td {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.black};
        border-bottom: ${Theme.borders.primary};
      }
      
      tr:last-child td {
        border-bottom: none;
      }
      
      .tenant-info {
        display: flex;
        align-items: center;
        gap: 6px;
        
        img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .tenant-name {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.black};
        }
      }
      
      .property-info {
        display: flex;
        flex-direction: column;
        
        .property-name {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
        }
        
        .property-location {
          font: ${Theme.typography.fonts.mediumM};
          color: ${Theme.colors.gray2};
        }
      }
      
      .move-in-date {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
      }
    }
    .slider-container {
        display: flex;
        max-width: 190px;
        width: 100%;
    }
    .border-container {
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.md};
        padding: 20px;
    }
  }
`;