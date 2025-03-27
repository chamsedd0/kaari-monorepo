import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';


export const PerformanceChartStyling = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  border: ${Theme.borders.primary};

  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;

  .chart-info {

    display: flex;
    gap: 24px;
    align-items: start;
    justify-content: space-between;
    width: 100%;

    .header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: start;
    gap: 9px;

    .title {
      font-size: ${Theme.typography.fonts.extraLargeB};
      color: ${Theme.colors.black};
    }

    .date {
      font-size: ${Theme.typography.fonts.mediumM};
      color: ${Theme.colors.gray2};
    }
  }

  .metrics {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 40px;


    .metric {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      

      .value {
          

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        .value-number {
          font: ${Theme.typography.fonts.h3};
          
        }

        &.views {
          color: #8F27CE;
        }

        &.clicks {
          color: #0595C3;
        }

        &.bookings {
          color: #29822D;
        }

        .trend-icon {
          font-size: 28px;

          &.up {
            color: #29822D;
            transform: rotate(30deg);
          }

          &.down {
            color: #9B0303;
            transform: rotate(-30deg);
          }
        }
      }

      .label {
        font-size: ${Theme.typography.fonts.largeM};
        color: ${Theme.colors.black};
      }
    }
  }
  }

  .chart {
    width: 100%;
    height: 140px;
    position: relative;
    border-radius: 16px;
    overflow: hidden;

    .area {
      fill-opacity: 0.2;
      transition: all 0.3s ease;

      &.views {
        fill: #8F27CE;
      }

      &.clicks {
        fill: #0595C3;
      }

      &.bookings {
        fill: #29822D;
      }
    }

    .line {
      fill: none;
      stroke-width: 1;
      transition: all 0.3s ease;

      &.views {
        stroke: #8F27CE;
      }

      &.clicks {
        stroke: #0595C3;
      }

      &.bookings {
        stroke: #29822D;
      }
    }
  }
`;


