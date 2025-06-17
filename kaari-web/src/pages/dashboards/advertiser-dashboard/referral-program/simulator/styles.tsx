import styled from "styled-components";
import { Theme } from "../../../../../theme/theme";

export const SimulatorPageStyle = styled.div`

  
  .page-header {
    margin-bottom: 20px;
    
    .back-link {
      color:${Theme.colors.secondary};
          text-decoration: none;
          font: ${Theme.typography.fonts.mediumM};
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          margin-bottom: 13px;
          
          &:hover {
            text-decoration: underline;
          }
    }
    
    h1 {
      font: ${Theme.typography.fonts.h3};
      color: ${Theme.colors.black};

    }
  }
  
  .simulator-layout {
    display: flex;
    gap: 20px;
    
    @media (max-width: 777px) {
      flex-direction: column;
    }
    
    .input-panel, .results-panel {
      border: ${Theme.borders.primary};
      border-radius: ${Theme.borders.radius.lg};
      padding: 20px;
    }
    
    .input-panel {
      flex: 2;
      
      h2 {
        font: ${Theme.typography.fonts.extraLargeB};
        color:${Theme.colors.black};
        margin-bottom: 24px;
      }
      
      .listings-input {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        
        .listing-controls {
          display: flex;
          align-items: center;
          border: ${Theme.borders.primary};
          border-radius: ${Theme.borders.radius.extreme};
          padding: 4px;
          max-width: 100px;
          height: 32px;

          input {
            border: none;
            text-align: center;
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.black};
            width: 25px;
            height: 30px;
            outline: none;
          }
        }
        
        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      
        
        .photoshoot-button-wrapper {
          margin-left: 16px;
          max-width: 250px;
        }

      }
      
      .info-text {
        display: flex;
        align-items: center;
        margin-left: 16px;
        gap: 8px;
        color:${Theme.colors.gray2};
       font: ${Theme.typography.fonts.text14};
        
        svg {
          flex-shrink: 0;
        }
      }
      
      .bonus-progress {
        margin-bottom: 24px;
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.black};
        }
        
        .progress-bar {
          display: flex;
          height: 8px;
          gap: 3px;
          margin-bottom: 8px;
          
          .segment {
            flex: 1;
            height: 100%;
            border-radius: 100px;
            background-color: ${Theme.colors.sixth};
            
            &.active {
              background-color: ${Theme.colors.secondary};
            }
          }
        }
        
        .range-labels {
          display: flex;
          justify-content: space-between;
          font: ${Theme.typography.fonts.smallM};
          color: ${Theme.colors.black};
          margin-top: 4px;
        }
      }
      
      .sliders {
        .slider-section {
          margin-bottom: 20px;
          
          .label {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: 16px;
          }
          
          .slider-container {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            
            .min-value, .max-value {
              font: ${Theme.typography.fonts.mediumB};
              color: ${Theme.colors.black};
              min-width: 20px;
            }
            
            .slider-track {
              flex: 1;
              position: relative;
              height: 30px;
              
              input[type="range"] {
                width: 100%;
                height: 6px;
                -webkit-appearance: none;
                appearance: none;
                background: #E0E0E0;
                border-radius: 100px;
                outline: none;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                
                &::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: #8F27CE;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
                  z-index: 2;
                  position: relative;
                }
                
                &::-moz-range-thumb {
                  width: 18px;
                  height: 18px;
                  border-radius: 50%;
                  background: #8F27CE;
                  cursor: pointer;
                  border: 2px solid white;
                  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
                  z-index: 4;
                  position: relative;
                }
              }
              
              &::before {
                content: '';
                position: absolute;
                height: 6px;
                background-color: #8F27CE;
                top: 50%;
                transform: translateY(-50%);
                left: 0;
                border-radius: 100px;
                width: calc(var(--slider-percent, 50%) * 1%);
                z-index: 1;
              }
              
              .slider-bubble {
                position: absolute;
                top: -20px;
                transform: translateX(-50%);
                background-color: #FFFFFF;
                border: 1px solid #E0E0E0;
                color: #8F27CE;
                font-size: 14px;
                font-weight: 500;
                padding: 4px 10px;
                border-radius: 100px;
                white-space: nowrap;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
                z-index: 3;
                text-align: center;
                min-width: 20px;
              }
            }
          }
        }
      }
    }
    
    .results-panel {
      flex: 1;
      max-width: 310px;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 1024px) {
        max-width: 100%;
      }
      
      h2 {
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
        margin: 0 0 24px 0;
      }
      
      .annual-earnings {
        margin-bottom: 24px;
        
        .earnings-label {
          font: ${Theme.typography.fonts.mediumB};
          color: ${Theme.colors.gray2};
          margin-bottom: 8px;
        }
        
        .earnings-value {
          font: ${Theme.typography.fonts.h3};
          color: ${Theme.colors.black};
        }
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px 40px;
        margin-bottom: 24px;
        
        .stat-item {
          .stat-label {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.gray2};
            margin-bottom: 8px;
          }
          
          .stat-value {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
          }
        }
      }
      
      .book-photoshoot-container {
        margin-bottom: 12px;
        align-items: center;
        justify-content: center;
      }
      
      .commission-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: ${Theme.colors.gray2};
        font: ${Theme.typography.fonts.text14};
        
        svg {
          flex-shrink: 0;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    .input-panel, .results-panel {
      padding: 16px;
    }
  }
`; 