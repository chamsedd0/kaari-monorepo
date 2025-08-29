import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const CardBaseModelStyleUpcomingPhotoshoot = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.lg};


    .first-container {
        display: flex;
        justify-content: space-between;
        align-items: start;

        .title-container {
            display: flex;
            gap: 12px;
            justify-content: center;
            align-items: center;

            .circle-number {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 24px;
                height: 24px;
                border-radius: ${Theme.borders.radius.round};
                background-color: ${Theme.colors.secondary};
                color: ${Theme.colors.white};
                font: ${Theme.typography.fonts.mediumB};
            }

            .title {
                font: ${Theme.typography.fonts.h4B};
                color: ${Theme.colors.black};
            }
        }

        .info-text{
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
        }
    }

    .middle-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .left-container {
            display: flex;
            gap: 8px;
            align-items: center;
            
            img {
                width: clamp(72px, 12vw, 100px);
                height: clamp(72px, 12vw, 100px);
                object-fit: cover;
                border-radius: ${Theme.borders.radius.extreme};
                filter: brightness(0.9)
            }

            .personal-info-container {
                display: flex;
                flex-direction: column;
                gap: 6px;

                .name {
                    font: ${Theme.typography.fonts.largeB};
                    color: ${Theme.colors.black};
                }

                .info {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                .description2 {
                    font: ${Theme.typography.fonts.text16};
                    color: ${Theme.colors.black};
                    max-width: 352px;
                    line-height: 1.7;
                }

                

            }
        }

        .right-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            
            .date{
                font: ${Theme.typography.fonts.extraLargeM};
                color: ${Theme.colors.black};
            }

            .time{
                font: ${Theme.typography.fonts.h25};
                color: ${Theme.colors.black};
            }
            
        }
    }

    .bottom-container {
        display: flex;
        width: 100%;    
        justify-content: space-between;
        align-items: center;

        .button-container{
            width: min(100%, 640px);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .download-icon {
            width: 36px;
            height: 36px;
            align-self: end;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            
            &:hover {
                background-color: rgba(155, 81, 224, 0.1);
                border-radius: 50%;
                
                .tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(-5px);
                }
            }
            
            img {
                width: 24px;
                height: 24px;
            }
            
            .tooltip {
                position: absolute;
                bottom: -30px;
                right: 0;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                transform: translateY(0);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                z-index: 10;
            }
        }
    }

    @media (max-width: 900px) {
        .first-container { align-items: flex-start; }
        .title-container .title { font: ${Theme.typography.fonts.largeB}; }
        .info-text { font: ${Theme.typography.fonts.text14}; }
        .middle-container { flex-direction: column; align-items: flex-start; gap: 12px; }
        .right-container .date { font: ${Theme.typography.fonts.largeB}; }
        .right-container .time { font: ${Theme.typography.fonts.h4B}; }
        .bottom-container { flex-direction: column; align-items: stretch; gap: 10px; }
        .bottom-container .button-container { width: 100%; }
        .download-icon { align-self: flex-start; }
    }

    @media (max-width: 480px) {
        padding: 16px;
        .title-container .circle-number { width: 20px; height: 20px; }
        .left-container img { width: 72px; height: 72px; }
    }
`;