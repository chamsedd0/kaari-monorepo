import styled from "styled-components";
import { Theme } from "./theme/theme";

export const UsersLandingStyle = styled.div`
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
        background: url('/src/assets/images/HeroImage.png') center center/cover no-repeat;
        padding: 0 6%;
        padding-top: 100px;
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
            
            &::before {
                content: '';
                position: absolute;
                bottom: -150px;
                right: -100px;
                width: 250px;
                height: 250px;
                background: radial-gradient(circle, ${Theme.colors.secondary}20 0%, transparent 70%);
                border-radius: 50%;
                z-index: -1;
            }
            
            &::after {
                content: '';
                position: absolute;
                top: -50px;
                left: -150px;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, ${Theme.colors.secondary}40 0%, transparent 70%);
                border-radius: 50%;
                z-index: -1;
                animation: pulse 8s infinite ease-in-out;
            }

            h1 {
            font: ${Theme.typography.fonts.h1};
            color: ${Theme.colors.white};
                margin-bottom: 2.5rem;
                max-width: 600px;
                font-weight: 800;
                font-size: 60px;
                line-height: 1.2;
                position: relative;
                animation: fadeInUp 1s ease-out;

            }

            .search-container {
                width: 100%;
                max-width: 800px;
                border-radius: 16px;
                transform: translateY(0);
                transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                position: relative;
                z-index: 3;
                animation: fadeInUp 1s ease-out 0.2s backwards;



                
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
            width: 100%;
                    height: 100%;
                    border-radius: 16px;
                    box-sizing: border-box;
                    pointer-events: none;
                    z-index: 4;
                }
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -15px;
                    left: 20px;
                    right: 20px;
                    height: 10px;
                    background: rgba(0,0,0,0.1);
                    filter: blur(10px);
                    border-radius: 50%;
                    z-index: -1;
                    transition: all 0.3s ease;
                }
        }

        .explore-link {
                display: inline-flex;
                align-items: center;
                margin-top: 30px;
                font-size: 18px;
                font-weight: 600;
                color: ${Theme.colors.white};
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                gap: 12px;
                position: relative;
                animation: fadeInUp 1s ease-out 0.4s backwards;
                
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background-color: ${Theme.colors.white};
                    transition: width 0.3s ease;
                }
                
                .arrow-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                    
                    img {
                        width: 20px;
                        height: 20px;
                        filter: brightness(0) invert(1);
                    }
                }
                
                &:hover {
                    gap: 16px;
                    transform: translateY(-2px);
                    
                    &::after {
                        width: 100%;
                    }
                    
                    .arrow-icon {
                        transform: translateX(4px);
                    }
                }
            }
            
            .hero-stats {
                display: flex;
                margin-top: 60px;
                gap: 40px;
                cursor: default;
                animation: fadeInUp 1s ease-out 0.6s backwards;
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: relative;
                    transition: transform 0.3s ease;
                    
                    &:hover {
                        transform: translateY(-5px);
                    }
                    
                    &::before {
                        content: '';
                        position: absolute;
                        top: -10px;
                        left: -15px;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        z-index: -1;
                    }
                    
                    .stat-number {
                        font-size: 36px;
                        font-weight: 800;
                        color: ${Theme.colors.white};
                        margin-bottom: 8px;
                        
                        &::after {
                            content: '';
                            display: block;
                            width: 30px;
                            height: 3px;
                            background-color: ${Theme.colors.secondary};
                            margin-top: 8px;
                            border-radius: 2px;
                        }
                    }
                    
                    .stat-label {
            font-size: 16px;
            font-weight: 500;
                        color: rgba(255, 255, 255, 0.9);
                        letter-spacing: 0.5px;
                    }
                }
                
                @media (max-width: 768px) {
                    flex-direction: column;
                    gap: 20px;
                    margin-top: 40px;
                }
            }
        }

        .hosting-button {
            position: absolute;
            bottom: 32px;
            right: 32px;
            background-color: ${Theme.colors.primary};
            color: ${Theme.colors.white};
            padding: 16px 32px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            z-index: 3;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 18px;
            animation: fadeInRight 1s ease-out 0.8s backwards;

            &:hover {
                transform: translateY(-3px);
            }
            
            .arrow-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
                
                img {
                    width: 22px;
                    height: 22px;
                    filter: brightness(0) invert(1);
                }
            }
            
            &:hover .arrow-icon {
                transform: translateX(3px);
            }
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 0.6;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.3;
            }
            100% {
                transform: scale(1);
                opacity: 0.6;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideRight {
            from {
                width: 0;
            }
            to {
                width: 80px;
            }
        }
    }

    /* Features Section */
    .features-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        padding: 60px 6%;
        background-color: ${Theme.colors.white};
        max-width: 1400px;
            width: 100%;
        margin: 0 auto;

        .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 32px 24px;
            border-radius: 12px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            
            &:hover {
                transform: translateY(-5px);
            }

            img {
                width: 48px;
                height: 48px;
                margin-bottom: 20px;
            }

            p {
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.gray2};
                line-height: 1.6;
            }
        }
    }

    /* What is Kaari Section */
    .what-is-kaari {
        width: 100%;
        background: url('/src/assets/images/waves.svg') center center/cover no-repeat;
        padding: 100px 6%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(45, 27, 78, 0.3), rgba(106, 48, 199, 0.3));
            z-index: 0;
        }
        
        .section-content {
            text-align: center;
            max-width: 600px;
            position: relative;
            z-index: 1;

            h2 {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.white};
                margin-bottom: 16px;
            }
            
            p {
                font: ${Theme.typography.fonts.largeB};
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 32px;
            }
            
            .button-group {
                display: flex;
                gap: 16px;
                justify-content: center;
                flex-wrap: wrap;
                
                button {
                    padding: 16px 32px;
                    border-radius: 30px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    
                    &.primary-button {
                        background: ${Theme.colors.white};
                        color: ${Theme.colors.primary};
                        border: none;
                        
                        &:hover {
                            background: rgba(255, 255, 255, 0.9);
                            transform: translateY(-3px);
                            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                        }
                    }
                    
                    &.secondary-button {
                        background: transparent;
                        color: ${Theme.colors.white};
                        border: 2px solid ${Theme.colors.white};
                        
                        &:hover {
                            background: rgba(255, 255, 255, 0.1);
                            transform: translateY(-3px);
                            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                        }
                    }
                }
            }
        }
    }

    /* How It Works Section */
    .how-it-works {
        padding: 100px 6%;
        padding-bottom: 0px;
        background: ${Theme.colors.white};
        
        .steps-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            
            .step {
                flex: 1;
                min-width: 300px;
                max-width: 350px;
                padding: 20px;
                position: relative;
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                
                .step-number {
                    font-size: 180px;
                    font-weight: 700;
                    color: ${Theme.colors.primary};
                    margin-bottom: 20px;
                    line-height: 1;
                }
                
                h3 {
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.black};
                    margin-bottom: 16px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 28px;
                }
                
                p {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                    line-height: 1.6;
                    text-align: center;
                }
            }
        }
    }

    /* Top Picks Section */
    .top-picks {
        padding: 100px 6%;
        background-color: ${Theme.colors.white};
        
        h2 {
            font: ${Theme.typography.fonts.h2};
            color: ${Theme.colors.black};
            text-align: center;
            margin-bottom: 50px;
        }
        
        .property-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
            
            .property-card {
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 16px;
                overflow: hidden;
                
                &:hover {
                    transform: translateY(-10px);
                }
            }
        }
    }

    /* Renter Protection Section */
    .renter-protection {
        padding: 60px 6%;
        background: url('/src/assets/images/renterProtection.svg') center center/cover no-repeat;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 60px;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(45, 27, 78, 0.5), rgba(26, 12, 46, 0.4));
            z-index: 0;
        }

        .protection-content {
            flex: 1;
            min-width: 300px;
            position: relative;
            z-index: 1;
            
            h2 {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.white};
                margin-bottom: 40px;
                font-size: 44px;
                position: relative;
                display: inline-block;
                text-shadow: none;
                
                &::after {
                    content: '';
                    display: block;
                    width: 60px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.8);
                    margin-top: 16px;
                    border-radius: 3px;
                }
            }
            
            .protection-feature {
                margin-bottom: 36px;
                background: rgba(255,255,255,0.06);
                border-radius: 16px;
                padding: 28px;
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255,255,255,0.18);
                box-shadow: none;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        to bottom right,
                        rgba(255, 255, 255, 0.1),
                        rgba(255, 255, 255, 0.05) 30%,
                        rgba(255, 255, 255, 0) 50%
                    );
                    pointer-events: none;
                }
                
                &:hover {
                    transform: translateY(-5px);
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.25);
                    box-shadow: none;
                }
                
                h3 {
                    display: flex;
                    align-items: center;
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.white};
                    margin-bottom: 16px;
                    font-weight: 700;
                    text-shadow: none;
                    
                    .icon-circle {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        background-color: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                        margin-right: 18px;
                        box-shadow: none;
                        
                        svg {
                            width: 24px;
                            height: 24px;
                            color: ${Theme.colors.primary};
                        }
                    }
                }
                
                p {
                    font: ${Theme.typography.fonts.mediumM};
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.7;
                    padding-left: 66px;
                }
            }
        }
        
        .protection-image {
            flex: 0 1 520px;
            position: relative;
            z-index: 1;
            
            &::before {
                content: '';
                position: absolute;
                top: -20px;
                left: -20px;
                width: 70%;
                height: 70%;
                border: 4px solid rgba(255, 255, 255, 0.4);
                border-radius: 16px;
                z-index: -1;
            }
            
            img {
                width: 100%;
                border-radius: 16px;
                box-shadow: none;
                transform: translateZ(0);
                transition: transform 0.5s ease;
                border: 3px solid rgba(255, 255, 255, 0.2);
                
                &:hover {
                    transform: scale(1.02);
                }
            }
        }
    }

    /* Recommended Properties Section */
    .recommended-properties {
        padding: 100px 6%;
        background-color: ${Theme.colors.white};
        
        h2 {
            font: ${Theme.typography.fonts.h2};
            color: ${Theme.colors.black};
            text-align: center;
            margin-bottom: 50px;
        }
        
        .property-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
            
            .property-card {
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 16px;
                overflow: hidden;
                
                &:hover {
                    transform: translateY(-10px);
                }
            }
        }
    }

    /* City Selection Section */
    .city-selection {
        padding: 100px 6%;
        background-color: ${Theme.colors.white};
        position: relative;
        
        h2 {
            font: ${Theme.typography.fonts.h2};
            color: ${Theme.colors.black};
            text-align: center;
            margin-bottom: 20px;
        }
        
        .view-all {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 0 auto 50px;
            padding: 12px 24px;
            background-color: ${Theme.colors.primary};
            color: ${Theme.colors.white};
            font: ${Theme.typography.fonts.largeB};
            border-radius: 30px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: none;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            
            &::after {
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3Cpolyline points='12 5 19 12 12 19'%3E%3C/polyline%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                transition: transform 0.3s ease;
            }
            
            &:hover {
                background-color: ${Theme.colors.primary}e6;
                transform: translateX(-50%) translateY(-3px);
                
                &::after {
                    transform: translateX(4px);
                }
            }
        }
        
        .city-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 24px;
            max-width: 1400px;
            margin: 0 auto;
            
            .city-card {
                border-radius: 16px;
                overflow: hidden;
                position: relative;
                width: 250px;
                height: 200px;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                flex-grow: 0;
                flex-shrink: 0;
                
                @media (max-width: 1400px) {
                    width: calc(25% - 18px);
                }
                
                @media (max-width: 1200px) {
                    width: calc(33.333% - 16px);
                }
                
                @media (max-width: 900px) {
                    width: calc(50% - 12px);
                }
                
                @media (max-width: 600px) {
                    width: 100%;
                    max-width: 350px;
                }
                
                &:hover {
                    transform: translateY(-5px);
                    
                    img {
                        transform: scale(1.1);
                    }
                    
                    &::after {
                        background: rgba(0,0,0,0.4);
                    }
                }
                
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    transition: background 0.3s ease;
                }
                
                h3 {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    color: ${Theme.colors.white};
                    font-weight: 700;
                    font-size: 20px;
                    z-index: 2;
                }
            }
        }
        
        @media (max-width: 768px) {
            padding: 60px 4%;
            
            h2 {
                font-size: 28px;
            }
            
            .view-all {
                margin-bottom: 30px;
                padding: 10px 20px;
                font-size: 14px;
                
                &::after {
                    width: 16px;
                    height: 16px;
                }
            }
        }
    }

    /* App Download Section */
    .app-download {
        padding: 120px 2%;
        width: 100%;
        max-width: 1400px;
        position: relative;
        overflow: hidden;
        border-radius: 0;
        
        &::before {
            content: '';
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            top: -200px;
            right: -100px;
            z-index: 0;
        }
        
        &::after {
            content: '';
            position: absolute;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, ${Theme.colors.primary}10 0%, transparent 70%);
            border-radius: 50%;
            bottom: -200px;
            left: -100px;
            z-index: 0;
        }
        
        .app-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            gap: 60px;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .app-content {
            flex: 1;
            min-width: 300px;
            position: relative;
            z-index: 1;
            
            .app-badge {
                display: inline-block;
                background: ${Theme.colors.primary};
                color: white;
                padding: 8px 16px;
                border-radius: 30px;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 20px;
                margin-left: 20px;
                box-shadow: 0 8px 15px ${Theme.colors.primary}30;
            }
            
            h2 {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.black};
                margin-bottom: 20px;
                font-size: 44px;
                position: relative;
                display: inline-block;
                background: linear-gradient(135deg, ${Theme.colors.primary}, #9259f3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
            }
            
            .app-description {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                margin-bottom: 40px;
                font-size: 18px;
                line-height: 1.7;
                max-width: 90%;
            }
            
            .app-features {
                list-style-type: none;
                margin-bottom: 40px;
                
                li {
                    display: flex;
                    align-items: center;
                    margin-bottom: 24px;
                    font: ${Theme.typography.fonts.mediumB};
                    color: ${Theme.colors.gray2};
                    font-size: 18px;
                    transition: all 0.3s ease;
                    
                    &:hover {
                        transform: translateX(10px);
                        color: ${Theme.colors.primary};
                    }
                    
                    .check-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        background-color: ${Theme.colors.primary};
                        color: ${Theme.colors.white};
                        margin-right: 18px;
                        font-weight: 700;
                        font-size: 16px;
                        box-shadow: 0 6px 15px ${Theme.colors.primary}30;
                        transform: scale(1);
                        transition: transform 0.3s ease;
                    }
                    
                    &:hover .check-icon {
                        transform: scale(1.1);
                    }
                }
            }
            
            .app-buttons {
                display: flex;
                gap: 24px;
                flex-wrap: wrap;
                margin-top: 30px;
                
                a {
                    display: block;
                    transition: all 0.4s ease;
                    border-radius: 16px;
                    padding: 10px 15px;
                    background: #000;
                    border: 2px solid #000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 200px;
                    max-width: 220px;
                    text-decoration: none;
                    
                    .store-icon {
                        font-size: 26px;
                        color: white;
                    }
                    
                    .store-text {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        
                        .small-text {
                            font-size: 12px;
                            color: #f2f2f2;
                            margin-bottom: 2px;
                        }
                        
                        .big-text {
                            font-size: 18px;
                            font-weight: 600;
                            color: white;
                        }
                    }
                    
                    &:hover {
                        transform: translateY(-8px);
                        background: #222;
                        border-color: #222;
                    }
                    
                    &.google-play {
                        background: white;
                        border-color: #e6e6e6;
                        
                        .store-icon {
                            color: ${Theme.colors.primary};
                        }
                        
                        .store-text {
                            .small-text {
                                color: #666;
                            }
                            
                            .big-text {
                                color: #333;
                            }
                        }
                        
                        &:hover {
                            background: #f9f9f9;
                            border-color: #e0e0e0;
                        }
                    }
                }
            }
        }
        
        .app-image {
            flex: 0 1 480px;
            position: relative;
            padding: 0;
            z-index: 1;
            display: flex;
            justify-content: center;
            
            &::before {
                content: '';
                position: absolute;
                width: 350px;
                height: 350px;
                background: radial-gradient(circle, ${Theme.colors.primary}20 0%, transparent 70%);
                border-radius: 50%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: -1;
                animation: pulse 6s infinite ease-in-out;
            }
            
            .phone-mockup {
                position: relative;
                width: 300px;
                height: 600px;
                perspective: 1000px;
                
                .phone {
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transform: rotateY(-20deg) rotateX(5deg);
                    transition: all 0.5s ease;
                    position: relative;
                    
                    &:hover {
                        transform: rotateY(0deg) rotateX(0deg);
                    }
                    
                    .phone-frame {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 40px;
                        background: #222;
                        box-shadow: 0 30px 60px rgba(0,0,0,0.25), 0 0 0 10px rgba(0,0,0,0.05) inset;
                        overflow: hidden;
                        
                        .phone-screen {
                            position: absolute;
                            top: 12px;
                            left: 12px;
                            right: 12px;
                            bottom: 12px;
                            background: #fff;
                            border-radius: 30px;
                            overflow: hidden;
                            
                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                                border-radius: 30px;
                            }
                        }
                        
                        .phone-notch {
                            position: absolute;
                            top: 0;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 150px;
                            height: 30px;
                            background: #222;
                            border-bottom-left-radius: 15px;
                            border-bottom-right-radius: 15px;
                            z-index: 2;
                        }
                    }
                }
            }
            
            .phone-shadow {
                position: absolute;
                bottom: -30px;
                width: 280px;
                height: 40px;
                background: rgba(0,0,0,0.1);
                border-radius: 50%;
                filter: blur(15px);
                z-index: -1;
            }
            
            @keyframes pulse {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.3;
                }
                100% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0.6;
                }
            }
        }
        
        @media (max-width: 992px) {
            padding: 80px 4%;
            
            .app-content {
                h2 {
                    font-size: 36px;
                }
                
                .app-description {
                    font-size: 16px;
                    max-width: 100%;
                }
                
                .app-features li {
                    font-size: 16px;
                }
            }
            
            .app-image {
                margin: 0 auto;
                
                .phone-mockup {
                    width: 260px;
                    height: 520px;
                }
            }
        }
        
        @media (max-width: 576px) {
            padding: 60px 4%;
            
            .app-content {
                h2 {
                    font-size: 30px;
                }
                
                .app-buttons {
                    justify-content: center;
                    
                    a {
                        min-width: 180px;
                    }
                }
            }
            
            .app-image {
                .phone-mockup {
                    width: 220px;
                    height: 440px;
                }
            }
        }
    }

    /* List Property Section */
    .list-property {
        width: 100%;
        padding: 100px 6%;
        background: url('/src/assets/images/waves.svg') center center/cover no-repeat;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 40px;
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        .list-property-content {
            flex: 1;
            min-width: 300px;
            position: relative;
            z-index: 1;
            
            h2 {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.white};
                margin-bottom: 20px;
                max-width: 600px;
            }
            
            p {
                font: ${Theme.typography.fonts.mediumM};
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 30px;
                max-width: 550px;
                line-height: 1.6;
            }
            
            .photoshoot-button {
                display: inline-block;
                padding: 16px 32px;
                border-radius: 30px;
                background-color: ${Theme.colors.white};
                color: ${Theme.colors.primary};
                font-weight: 600;
                font-size: 18px;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 10px;
                
                &:hover {
                    background-color: rgba(255, 255, 255, 0.9);
                    transform: translateY(-3px);
                }
            }
        }
        
        .list-property-image {
            flex: 0 1 500px;
            position: relative;
            z-index: 1;
            
            img {
                width: 100%;
                border-radius: 16px;
            }
        }
    }

    /* Features Footer */
    .features-footer {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        padding: 60px 6%;
        background-color: ${Theme.colors.white};
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;

        .feature-item {
        display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 24px;
            
            img {
                width: 40px;
                height: 40px;
                margin-bottom: 16px;
            }
            
            p {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                line-height: 1.6;
            }
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 0 20px;
            
            .hero-content h1 {
                font-size: 32px;
                line-height: 1.3;
            }
        }
        
        .what-is-kaari .section-content .button-group {
            flex-direction: column;
            width: 100%;
        }
        
        .renter-protection {
            flex-direction: column;
            
            .protection-image {
                order: -1;
            }
        }
        
        .app-download {
            flex-direction: column;
            
            .app-image {
                order: -1;
            }
        }
        
        .list-property {
            flex-direction: column;
            
            .list-property-image {
                order: -1;
            }
        }
    }
`;