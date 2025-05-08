import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const ReservationStatusContainer = styled.div`

  max-width: 1400px;
  margin: 0 auto;
  margin-top: 120px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    grid-column: 1 / 2;
    
    @media (max-width: 1024px) {
      order: 2;
    }
  }
  
  .sidebar {
    grid-column: 2 / 3;
    grid-row: 1 / span 6;
    position: sticky;
    top: 100px;
    height: fit-content;
    
    @media (max-width: 1024px) {
      grid-column: 1 / 2;
      grid-row: auto;
      position: relative;
      top: 0;
      order: 1;
    }
  }
  
  h1 {
    font: ${Theme.typography.fonts.h3};
    color: ${Theme.colors.black};
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font: ${Theme.typography.fonts.h4B};
    color: ${Theme.colors.black};
    margin: 2rem 0 1rem;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font: ${Theme.typography.fonts.mediumB};
    color: ${Theme.colors.gray2};
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: fit-content;
    
    &:hover {
      color: ${Theme.colors.secondary};
      transform: translateX(-5px);
    }
    
    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }
    
    &:hover svg {
      transform: translateX(-3px);
    }
  }
  
  /* Status Card Placeholder */
  .status-card-container {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  /* Additional Sections */
  .section {
    margin-bottom: 2rem;
    
    .info-card {
      background-color: white;
      border-radius: ${Theme.borders.radius.lg};
      padding: 1.5rem;
      margin-bottom: 1rem;
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        
        svg {
          width: 24px;
          height: 24px;
          color: ${Theme.colors.secondary};
        }
        
        h3 {
          font: ${Theme.typography.fonts.largeB};
          color: ${Theme.colors.black};
          margin: 0;
        }
      }
      
      p {
        font: ${Theme.typography.fonts.mediumM};
        color: ${Theme.colors.gray2};
        margin-bottom: 0.5rem;
      }
      
      .card-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }
    }
  }
  
  /* Suggestions section for rejected reservations */
  .suggestions-section {
    margin-top: 2rem;
    
    .suggestions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }
  }
  
  /* Room details section */
  .room-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1.5rem 0;
    
    .room-card {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: white;
      border-radius: ${Theme.borders.radius.md};
      border: ${Theme.borders.primary};
      padding: 1rem;
      min-width: 150px;
      
      svg {
        width: 24px;
        height: 24px;
        color: ${Theme.colors.secondary};
      }
      
      .room-info {
        .room-type {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
        }
        
        .room-size {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
        }
      }
    }
  }
  
  /* Booking details section */
  .booking-details {
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    padding: 1.5rem;
    margin-top: 2rem;
    
    h3 {
      font: ${Theme.typography.fonts.largeB};
      color: ${Theme.colors.black};
      margin-bottom: 1rem;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem 2rem;
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
      
      .detail-item {
        display: flex;
        flex-direction: column;
        
        .detail-label {
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.gray2};
          margin-bottom: 0.25rem;
          position: relative;
          
          &:after {
            content: "";
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: ${Theme.colors.tertiary};
          }
        }
        
        .detail-value {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
          margin-top: 0.5rem;
        }
      }
    }
  }
  
  /* Cancellation policy table */
  .cancellation-policy {
    margin-top: 1.5rem;
    
    .policy-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
      
      th, td {
        padding: 0.75rem;
        text-align: center;
        border-bottom: 1px solid ${Theme.colors.tertiary};
      }
      
      th {
        font: ${Theme.typography.fonts.smallB};
        color: ${Theme.colors.black};
        background-color: ${Theme.colors.tertiary}20;
      }
      
      td {
        font: ${Theme.typography.fonts.smallM};
        color: ${Theme.colors.gray2};
      }
      
      tr:last-child td {
        border-bottom: none;
      }
    }
  }
`; 