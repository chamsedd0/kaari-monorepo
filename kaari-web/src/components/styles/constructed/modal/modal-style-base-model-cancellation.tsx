import styled from 'styled-components';
import { Theme } from '../../../../theme/theme';

export const ModalDeclineReservation = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  

    .modal-decline-reservation-container {
        background-color: ${Theme.colors.white};
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        max-width: 520px;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: modal-appear 0.3s ease-out;
        position: relative;
        

        @keyframes modal-appear {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .content-container {
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            

            .close-button {
                position: absolute;
                top: 16px;
                left: 16px;
                background: none;
                border: none;
                color: ${Theme.colors.secondary};
                font-size: 20px;
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                transition: all 0.2s ease;
                
                &:hover {
                    color: ${Theme.colors.black};
                    background-color: ${Theme.colors.gray}20;
                }
            }

            img {
                width: 80px;
                height: 80px;
            }

            .text-container {
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-width:60%;

                .title {
                    font: ${Theme.typography.fonts.extraLargeB};
                    color: ${Theme.colors.black};
                    margin: 0;
                }

                .description {
                    font: ${Theme.typography.fonts.text14};
                    color: ${Theme.colors.gray2};
                    margin: 0;
                }  
            }

            .input-container {
                display: flex;
                gap: 16px;
                width: 100%;
                
                > * {
                    flex: 1;
                }
            }

            .info-container {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px;
                border-radius: ${Theme.borders.radius.lg};
                background-color: ${Theme.colors.fifth};
                width: 100%;

                img {
                    width: 48px;
                    height: 48px;
                    opacity: 0.65;
                }

                .info-text {
                    font: ${Theme.typography.fonts.text14};
                    color: ${Theme.colors.primary};
                    opacity: 0.65;
                }
            }

            .button-container {
                display: flex;
                gap: 16px;
                width: 100%;
                
                > * {
                    flex: 1;
                }
            }
        }
    }
`;