import styled from 'styled-components';
import { Theme } from '../../../theme/theme';

export const CardBaseModelStyleLatestRequestDashboard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background-color: ${Theme.colors.white};
    border: ${Theme.borders.primary};
    border-radius: ${Theme.borders.radius.md};
    padding: 16px;
    width: 100%;
   
   .title-viewmore-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    .title{
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
    }

    .viewmore{ 
        font: ${Theme.typography.fonts.mediumB};
        color: ${Theme.colors.secondary};
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            color: ${Theme.colors.primary};
        }
    }
   }

   .latest-request-container{
    display: flex;
    gap: 20px;
    align-items: center;
    width: 100%;

    .latest-request-image{
        width: 301px;
        height: 244px;
        border-radius: ${Theme.borders.radius.lg};
        object-fit: cover;
    }

    .latest-request-info-container{
        display: flex;
        flex-direction: column;
        gap: 24px;
        width: 100%;

        .latest-request-title{
            font: ${Theme.typography.fonts.h4B};
            color: ${Theme.colors.black};
        }

        .latest-request-info{
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: start;
            
            .latest-request-picture-name-details{
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;

                .latest-request-picture-name-container{
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    
                    .latest-request-picture{
                        width: 40px;
                        height: 40px;
                        border-radius: ${Theme.borders.radius.round};
                        object-fit: cover;
                    }

                    .latest-request-name-container{
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        
                        .latest-request-name{
                            font: ${Theme.typography.fonts.largeB};
                            color: ${Theme.colors.black};
                    }

                    .latest-request-info{
                        font: ${Theme.typography.fonts.mediumM};
                            color: ${Theme.colors.gray2};
                        }
                    }
                }

                .details-container{
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    
                    .details-text{
                        font: ${Theme.typography.fonts.mediumM};
                        color: ${Theme.colors.gray2};
                    }

                    .details-icon{
                        width: 12px;
                        height: 12px;
                        color: ${Theme.colors.gray2};
                    }
                }
            }

            .move-in-date{
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
            }

            .text-container{
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                .text-container-text{
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                }

                .text-remaining-time{
                    font: ${Theme.typography.fonts.extraLargeB};
                    color: ${Theme.colors.black};
                }
            }
        }

        .button-container{
            display: flex;
            gap: 12px;
            align-items: center;
        }
    }
   }
`;