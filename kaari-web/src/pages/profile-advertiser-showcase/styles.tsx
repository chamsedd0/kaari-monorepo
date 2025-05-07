import styled from "styled-components";
import { Theme } from "../../theme/theme";


export const ProfileShowcaseStyle = styled.div`
    padding: 20px;
    padding-top: 32px;
    width: 100%;
    margin-top: 80px;
    max-width: 1600px;
    margin-left: auto;
    margin-right: auto;

    display: flex;
    align-items: start;
    justify-content: start;

    

    .info-section {

        width: 100%;
        max-width: 302px;
        margin-right: 40px;

        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: start;
        justify-content: start;

        .image {
            width: 100%;
            object-fit: cover;
            border-radius: 8px;
            height: 302px;
        }

        .about-me-section, .additional-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: start;
            justify-content: space-between;
            padding: 32px 16px;
            border-radius: ${Theme.borders.radius.lg};
            border: 1px solid ${Theme.colors.tertiary};
        }

        .about-me-section {
            
            .about-me-title {
                color: ${Theme.colors.black};
                font: ${Theme.typography.fonts.extraLargeB};

            }

            .about-me-text {

                color: ${Theme.colors.gray2};
                font: ${Theme.typography.fonts.text14};
                line-height: 150%;


            }

            .about-me-button {
                color: ${Theme.colors.black};
                font: ${Theme.typography.fonts.largeB};
                background: none;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: underline;

                &:hover {
                    opacity: 0.8;
                }

            }


        }

        .additional-info {

            .last-online, .on-kaari-since {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: start;
                justify-content: start;
                
            }

            .title {
                color: ${Theme.colors.black};
                font: ${Theme.typography.fonts.extraLargeB};

            }

            .subtitle {
                color: ${Theme.colors.gray2};
                font: ${Theme.typography.fonts.largeM};

            }


        }
    }

    .main-section {

        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 40px;
        align-items: start;
        justify-content: start;

        .profile-section {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 34px;
            align-items: start;
            justify-content: start;


            .profile-details {

                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: start;
                justify-content: start;

                .rating-stars {
                    display: flex;
                    flex-direction: row;
                    gap: 2px;
                    align-items: center;
                    justify-content: start;

                        
                }

                .profile-information {
                    
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    align-items: start;
                    justify-content: start;

                    .name {
                        color: ${Theme.colors.black};
                        font: ${Theme.typography.fonts.h2};

                    }

                    .certifications {

                        display: flex;
                        flex-direction: row;
                        gap: 12px;
                        align-items: center;
                        justify-content: start;

                    }

                    .location {

                        color: ${Theme.colors.gray2};
                        font: ${Theme.typography.fonts.h4B};

                    }
                }

                .control-buttons {

                    display: flex;
                    flex-direction: row;
                    gap: 44px;
                    align-items: end;
                    justify-content: start;

                    .control-button {

                        color: ${Theme.colors.gray2};
                        font: ${Theme.typography.fonts.extraLargeB};
                        background: none;
                        border: none;
                        cursor: pointer;
                        transition: all 0.1s ease;
                        padding: 29px 0px;

                        display: flex;
                        flex-direction: row;
                        gap: 20px;
                        align-items: center;
                        justify-content: start;

                        .icon-counter {
                            color: ${Theme.colors.white};
                            font: ${Theme.typography.fonts.smallB};
                            min-width: 27px;
                            min-height: 30px;
                            padding: 0px 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: ${Theme.borders.radius.extreme};
                            background-color: ${Theme.colors.gray2};
                            transition: all 0.3s ease;
                        }

                        &.active {
                            border-bottom: 4px solid ${Theme.colors.secondary};
                            color: ${Theme.colors.secondary};

                            .icon-counter {
                                background-color: ${Theme.colors.secondary};
                            }
                        }
                    }


                }

            }


        }

        .display-section {

            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            align-items: start;
            justify-content: start;

            .offers-content, .ratings-content {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 20px;
                
                h3 {
                    color: ${Theme.colors.black};
                    font: ${Theme.typography.fonts.h3};
                    margin-bottom: 10px;
                }
                
                p {
                    color: ${Theme.colors.gray2};
                    font: ${Theme.typography.fonts.mediumM};
                }
            }
                
                .offers-grid {
                    display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 24px;
                width: 100%;
                max-width: 100%;
                
                @media (max-width: 767px) {
                    grid-template-columns: 1fr;
                }
                
                @media (min-width: 768px) and (max-width: 1024px) {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                @media (min-width: 1025px) {
                    grid-template-columns: repeat(2, 1fr);
                    max-width: 900px;
                }
                
                /* Style for each property card item */
                > div {
                    max-width: 100%;
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    overflow: hidden;
                    
                    img {
                        height: 220px;
                        object-fit: cover;
                        width: 100%;
                    }
                    
                    .description {
                        max-height: 20px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100%;
                    }
                    
                    .title, .subtitle, .price {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        max-width: 100%;
                    }
                }
            }
        }
    }
    
    @media (max-width: 1200px) {
        flex-direction: column;
        
        .info-section {
            max-width: 100%;
            margin-right: 0;
            margin-bottom: 40px;
            
            .image {
                max-height: 400px;
                object-position: center top;
            }
        }
    }
    
    @media (max-width: 768px) {
        .profile-section .profile-details .control-buttons {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
            
            .control-button {
                padding: 15px 0;
            }
        }
    }
`