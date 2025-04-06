import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const AdvertisersLandingStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    background-color: ${Theme.colors.white};
    overflow-x: hidden;

    /* Hero Section */
    .hero-section {
        width: 100%;
        height: 100vh;
        min-height: 600px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        background: url('/src/assets/images/HeroImageAdvertiser.png') center center/cover no-repeat;
        padding: 0 6%;
        padding-top: 80px;
        overflow: hidden;
        
        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background: radial-gradient(circle at right top, ${Theme.colors.primary}10, transparent 50%);
            z-index: 1;
            opacity: 0.8;
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 100%);
            z-index: 1;
        }

        .hero-content {
            z-index: 2;
            max-width: 1400px;
            width: 100%;
            margin: 0 auto;
            padding-top: 0px;
            position: relative;
            
            h1 {
                font: ${Theme.typography.fonts.h1};
                color: ${Theme.colors.white};
                margin-bottom: 1.5rem;
                max-width: 700px;
                font: ${Theme.typography.fonts.h1};
                line-height: 1.5;
                position: relative;
                animation: fadeInUp 1s ease-out;
            }

            p {
                color: ${Theme.colors.white};
                font: ${Theme.typography.fonts.h4DB};
                max-width: 550px;
                margin-bottom: 2rem;
                line-height: 1.6;
            }

            .cta-button {
                background-color: ${Theme.colors.primary};
                color: ${Theme.colors.white};
                border: none;
                border-radius: 10px;
                font-size: 16px;
                font-weight: 600;
                padding: 15px 30px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                
                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
                }
            }
        }
    }

    /* Benefits Section */
    .benefits-section {
        padding: 100px 6%;
        width: 100%;
        background-color: ${Theme.colors.white};
        max-width: 1500px;
        margin: 0 auto;
        
        h2 {
            font-size: 38px;
            font-weight: 800;
            text-align: center;
            margin-bottom: 20px;
            color: ${Theme.colors.black};
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 4px;
                background-color: ${Theme.colors.primary};
                border-radius: 2px;
            }
        }
        
        .subtitle {
            text-align: center;
            color: ${Theme.colors.gray2};
            font-size: 18px;
            margin-bottom: 70px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 30px;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            
            margin-bottom: 80px;
            position: relative;
            transition: transform 0.3s ease-out;
            
            &:hover {
                transform: translateY(-5px);
                
                .benefit-image img {
                    transform: scale(1.03);
                    box-shadow: 0 10px 25px rgba(81, 27, 114, 0.15);
                }
            }
            
            &:nth-child(odd) {
                flex-direction: row;
                text-align: right;
                
                .benefit-content {
                    padding-right: 50px;
                }
            }
            
            &:nth-child(even) {
                flex-direction: row-reverse;
                text-align: right;
                
                .benefit-content {
                    padding-left: 50px;
                    margin-right: auto;
                    
                    .benefit-title {
                        justify-content: flex-end;
                    }
                    
                    p {
                        margin-left: auto;
                    }
                }
            }
            
            .benefit-content {
                flex: 1;
                
                .benefit-title {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    
                    .benefit-number {
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        background-color: ${Theme.colors.primary};
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        font-weight: 700;
                        margin-right: 18px;
                        box-shadow: 0 4px 10px rgba(81, 27, 114, 0.25);
                    }
                    
                    h3 {
                        font-size: 26px;
                        font-weight: 700;
                        color: ${Theme.colors.primary};
                        margin: 0;
                    }
                }
                
                p {
                    font-size: 17px;
                    line-height: 1.7;
                    color: ${Theme.colors.gray2};
                    max-width: 520px;
                }
            }
            
            .benefit-image {
                flex: 1;
                max-width: 420px;
                
                img {
                    width: 100%;
                    border-radius: 15px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                }
            }
        }
        
        @media (max-width: 768px) {
            .benefit-item {
                flex-direction: column-reverse !important;
                text-align: center !important;
                
                .benefit-content {
                    padding: 20px 0 !important;
                    margin: 0 auto !important;
                    
                    .benefit-title {
                        justify-content: center !important;
                        
                        .benefit-number {
                            order: unset !important;
                            margin: 0 15px 0 0 !important;
                        }
                    }
                    
                    p {
                        margin: 0 auto !important;
                    }
                }
                
                .benefit-image {
                    margin-bottom: 20px;
                }
            }
        }
    }

    /* How It Works Section */
    .how-it-works {
        padding: 100px 6% 120px;
        background-color: ${Theme.colors.white};
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
        position: relative;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(81,27,114,0) 0%, rgba(81,27,114,0.2) 50%, rgba(81,27,114,0) 100%);
        }
        
        h2 {
            font-size: 38px;
            font-weight: 800;
            text-align: center;
            margin-bottom: 80px;
            color: ${Theme.colors.black};
            position: relative;
            
            &::after {
                content: '';
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 4px;
                background-color: ${Theme.colors.primary};
                border-radius: 2px;
            }
        }
        
        .steps-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
            max-width: 1100px;
            margin: 0 auto;
            
            .step-card {
                max-width: 530px;
                width: 100%;
                margin: 0 auto;
                height: 400px;
            }
        }
        
        @media (max-width: 992px) {
            .steps-container {
                grid-template-columns: 1fr;
            }
        }
    }

    /* Pricing Section */
    .pricing-section {
        padding: 120px 6%;
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        
        background: ${Theme.colors.white};
        position: relative;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, rgba(81,27,114,0) 0%, rgba(81,27,114,0.2) 50%, rgba(81,27,114,0) 100%);
        }
        
        .pricing-image {
            flex: 1;
            max-width: 550px;
            margin-right: 60px;
            border-radius: 16px;
            overflow: hidden;
            
            img {
                width: 100%;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                transition: transform 0.5s ease;
                
                &:hover {
                    transform: scale(1.02);
                }
            }
        }

        .pricing-content {
            flex: 1;
            padding-left: 20px;
            
            h2 {
                font-size: 38px;
                font-weight: 800;
                margin-bottom: 15px;
                color: ${Theme.colors.black};
                position: relative;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    width: 80px;
                    height: 4px;
                    background-color: ${Theme.colors.primary};
                    border-radius: 2px;
                }
            }
            
            .fee-container {
                display: flex;
                align-items: center;
                margin: 25px 0 15px;
            }
            
            .fee-highlight {
                font-size: 100px;
                font-weight: 800;
                color: ${Theme.colors.primary};
                line-height: 1;
                position: relative;
                margin-right: 10px;
                text-shadow: 0 2px 10px rgba(81, 27, 114, 0.15);
                
                &::after {
                    content: '';
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background-image: url('/src/assets/images/purpleLogo.svg');
                    background-size: contain;
                    background-repeat: no-repeat;
                    right: -20px;
                    top: 25px;
                    opacity: 0.9;
                }
            }
            
            .fee-text {
                font-size: 60px;
                font-weight: 700;
                line-height: 1;
                color: ${Theme.colors.primary};
                margin-left: 10px;
            }
            
            .pricing-details {
                font-size: 22px;
                color: ${Theme.colors.black};
                margin-bottom: 25px;
                font-weight: 600;
            }
            
            .pricing-description {
                max-width: 500px;
                margin-bottom: 40px;
                font-size: 17px;
                line-height: 1.7;
                color: ${Theme.colors.gray2};
            }
        }
        
        @media (max-width: 992px) {
            flex-direction: column;
            
            .pricing-image {
                margin-right: 0;
                margin-bottom: 50px;
                max-width: 100%;
            }
            
            .pricing-content {
                padding-left: 0;
                text-align: center;
                
                h2 {
                    text-align: center;
                    
                    &::after {
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
                
                .fee-container {
                    justify-content: center;
                }
            }
        }
    }

    /* Get Started Section */
    .get-started {
        padding: 220px 6%;
        width: 100%;
        background: linear-gradient(rgba(16, 5, 30, 0.75), rgba(16, 5, 30, 0.75)), url('/src/assets/images/ctaBg.png') center center/cover no-repeat;
        background-attachment: fixed;
        text-align: center;
        color: ${Theme.colors.white};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(81, 27, 114, 0.3) 0%, transparent 70%);
        }

        h2 {
            font-size: 42px;
            font-weight: 900;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        
        h3 {
            font: ${Theme.typography.fonts.h1};
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        p {
            font: ${Theme.typography.fonts.h3};
            max-width: 800px;
            margin: 0 auto 40px;
            line-height: 1.6;
            position: relative;
            z-index: 1;
        }
        
        .button-container {
            position: relative;
            z-index: 1;
            transform: scale(1.1);
        }
    }

    @media (max-width: 768px) {
        .hero-section .hero-content h1 {
            font-size: 42px;
        }
        
        .fee-highlight {
            font-size: 60px;
        }
        
        .get-started h2 {
            font-size: 36px;
        }
    }
`;
