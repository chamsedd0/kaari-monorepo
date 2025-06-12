import styled from "styled-components";
import { Theme } from "../../../../../theme/theme";

export const SimulatorPageStyle = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    margin-bottom: 32px;
    
    .back-button-wrapper {
      display: inline-block;
      margin-bottom: 16px;
      cursor: pointer;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 600;
      color: #252525;
      margin: 0;
    }
  }
  
  .simulator-layout {
    display: flex;
    gap: 24px;
    
    @media (max-width: 1024px) {
      flex-direction: column;
    }
    
    .input-panel, .results-panel {
      background-color: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #E0E0E0;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .input-panel {
      flex: 2;
      
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #252525;
        margin: 0 0 24px 0;
      }
      
      .listings-input {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        input {
          width: 40px;
          height: 40px;
          border: 1px solid #E0E0E0;
          border-radius: 4px;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          margin: 0 8px;
          color: #252525;
        }
        
        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .photoshoot-button-wrapper {
          margin-left: 16px;
          
          .book-photoshoot-button {
            background-color: #8F27CE;
            color: white;
            border: none;
            border-radius: 100px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
            
            &:hover {
              background-color: #6A2AF4;
            }
          }
        }
        
        @media (max-width: 768px) {
          flex-wrap: wrap;
          
          .photoshoot-button-wrapper {
            margin-left: 0;
            margin-top: 8px;
            width: 100%;
            
            .book-photoshoot-button {
              width: 100%;
            }
          }
        }
      }
      
      .info-text {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 24px;
        color: #8F27CE;
        font-size: 14px;
        
        svg {
          flex-shrink: 0;
        }
      }
      
      .bonus-progress {
        margin-bottom: 32px;
        
        .percentage-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #252525;
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
            background-color: #E0E0E0;
            
            &.active {
              background-color: #8F27CE;
            }
          }
        }
        
        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #767676;
          margin-top: 4px;
        }
      }
      
      .sliders {
        .slider-section {
          margin-bottom: 32px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          label {
            display: block;
            font-size: 16px;
            font-weight: 500;
            color: #252525;
            margin-bottom: 16px;
          }
          
          .slider-container {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            
            .min-value, .max-value {
              font-size: 14px;
              color: #767676;
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
                  z-index: 2;
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
                top: -5px;
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
      max-width: 360px;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 1024px) {
        max-width: 100%;
      }
      
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #252525;
        margin: 0 0 24px 0;
      }
      
      .annual-earnings {
        margin-bottom: 32px;
        
        .earnings-label {
          font-size: 16px;
          color: #767676;
          margin-bottom: 8px;
        }
        
        .earnings-value {
          font-size: 40px;
          font-weight: 600;
          color: #252525;
        }
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px 16px;
        margin-bottom: 32px;
        
        .stat-item {
          .stat-label {
            font-size: 14px;
            color: #767676;
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #8F27CE;
          }
        }
      }
      
      .book-photoshoot-container {
        margin-top: auto;
        margin-bottom: 24px;
        
        button {
          width: 100%;
          height: 48px;
          border-radius: 100px;
          background-color: #8F27CE;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
          
          &:hover {
            background-color: #6A2AF4;
          }
        }
      }
      
      .commission-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #767676;
        font-size: 14px;
        
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