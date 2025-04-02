import styled from 'styled-components';
import { Theme } from '../../../../../../theme/theme';

export const PayoutMethodStyle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 44px;
    width: 100%;
    
    .title-container {
        display: flex;
        flex-direction: column;
        gap: 24px;

        .title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .payout-complete-container {
            display: flex;
            gap: 40px;
            
           .payout-text {
            padding: 24px 0px;
            min-width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover {
              color: ${Theme.colors.secondary};
              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background-color: ${Theme.colors.secondary};
                transform-origin: center;
                transform: scaleX(0);
                opacity: 0;
                animation: fadeIn 0.3s forwards;
              }
              
              @keyframes fadeIn {
                to {
                  transform: scaleX(1);
                  opacity: 1;
                }
              }
              

            }
            
            &.active {
              color: ${Theme.colors.secondary};
              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background-color: ${Theme.colors.secondary};
                transform-origin: center;
                transform: scaleX(1);
                opacity: 1;
              }

            } 
           }
           
        }
    }

    .content-container {
        display: flex;
        flex-direction: column;
        gap: 20px;

        .content-title {
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }

        .content-description {
            font: ${Theme.typography.fonts.largeM};
            color: ${Theme.colors.gray2};
        }

        .add-payment-method-button {
            max-width: 188px;
        }
        
    }
    
    `