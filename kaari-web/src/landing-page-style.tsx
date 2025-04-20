import styled from "styled-components";
import { Theme } from "./theme/theme";
import HeroImageBg from './assets/images/HeroImage.png';
import PhotoshootBg from './assets/images/photoshoot1.png';

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
        background: url(${HeroImageBg}) center center/cover no-repeat;
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
            gap: 8px;
            z-index: 3;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 14px;
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
                    width: 18px;
                    height: 18px;
                    filter: brightness(0) invert(1);
                }
            }
            
            &:hover .arrow-icon {
                transform: translateX(2px);
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
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.gray2};
                line-height: 1.6;
            }
        }
    }

    .what-is-kaari-container {
        max-width: 1400px;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
    }

    /* What is Kaari Section - Slider */
    .what-is-kaari {
        width: calc(100% - 40px);
        max-width: 1400px;
        margin: 60px auto;
        position: relative;
        border-radius: 16px;

        .kaari-logo {
            position: absolute;
            top: 32px;
            left: 32px;
            z-index: 10;
            img {
                height: 48px;
                width: auto;
                filter: brightness(0) invert(1);
            }
        }

        
        
        .slider-container {
            width: 100%;
            height: 100%;
            position: relative;
            max-width: 1400px;
            overflow-x: hidden;
            border-radius: 16px;
            overflow: visible;
            background: linear-gradient(to right, #8F27CE, #7624C3);
            

        }
        
        .slider-track {
            display: flex;
            transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
            overflow: visible;
        }
        
        
        .slide {
            width: 100%;
            flex-shrink: 0;
            padding: 0px 125px;
            min-height: 520px;
            border-radius: 16px;
            margin-bottom: 20px;
            position: relative;
            overflow: visible;
            margin-right: 20px;
            opacity: 0;
            transition: opacity 0.8s ease, transform 0.8s ease;
            
            &.active {
                opacity: 1;
                transform: scale(1);
                transition-delay: 0.1s;
            }
            
            &.next, &.prev {
                opacity: 0;
                transform: scale(0.95);
            }
            
            .slide-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                overflow: visible;
                z-index: 5;
                width: 100%;
                height: 100%;
                
                
                .text-content {
                    flex: 1;
                    max-width: 50%;
                    
                    h2 {
                        font: ${Theme.typography.fonts.h1};
                        color: ${Theme.colors.white};
                        margin-bottom: 15px;
                        font-size: 50px;
                    }
                    
                    p {
                        font: ${Theme.typography.fonts.extraLargeM};
                        color: rgba(255, 255, 255, 0.9);
                        margin-bottom: 30px;
                        line-height: 1.5;
                        font-size: 16px;
                        max-width: 400px;
                    }
                    

                    
                    .buttons-container {
                        display: flex;
                        gap: 15px;
                        flex-wrap: wrap;
                    }
                    
                    .primary-button, .secondary-button {
                        display: inline-block;
                        padding: 12px 24px;
                        border-radius: 30px;
                        font: ${Theme.typography.fonts.largeB};
                        border: none;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 160px;
                        text-align: center;
                    }
                    
                    .primary-button {
                        background-color: ${Theme.colors.white};
                        color: ${Theme.colors.secondary};
                        
                        &:hover {
                            background-color: rgba(255, 255, 255, 0.9);
                            transform: translateY(-3px);
                        }
                    }
                    
                    .secondary-button {
                        background-color: transparent;
                        color: ${Theme.colors.white};
                        border: 3px solid ${Theme.colors.white};
                        
                        &:hover {
                            background-color: rgba(255, 255, 255, 0.1);
                            transform: translateY(-3px);
                        }
                    }
                }
                
                .image-content {
                    flex: 0 0 auto;
                    position: relative;
                    z-index: 2;
                    overflow: visible;
                    height: 100%;
                    
                    img {
                        width: auto;
                        height: auto;
                        object-fit: cover;
                        position: absolute;
                        right: 0px;
                        bottom: 70px;
                        transform: translateX(10%);
                    }
                }
            }
        }

        .welcome-slide{
            .image-content {
                img {
                    bottom: 50px !important;
                    transform: translateX(0%) !important;
                    
                }
            }
        }

        .search-slide {
            .image-content {
                img {
                    bottom: 30px !important;
                    
                }
            }
        }

        .enjoy-slide {
            .image-content {
                img {
                    bottom: 30px !important;
                }
            }
        }

        .request-slide {
            .image-content {
                img {
                    bottom: -65px !important;
                }
            }
        }

        .payment-slide {
            .image-content {
                img {
                    transform: translateX(0%) !important;
                }
            }
        }
        
        .slider-controls {
            display: flex;
            justify-content: flex-start;
            position: absolute;
            bottom: 50px;
            left: 32px;
            z-index: 5;
            
            .slider-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.3);
                margin: 0 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &.active {
                    background-color: ${Theme.colors.white};
                    transform: scale(1.2);
                }
                
                &:hover {
                    background-color: ${Theme.colors.white};
                }
            }
        }
        
        .slider-arrows {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            transform: translateY(-50%);
            z-index: 10;
            padding: 0 20px;
            
            .slider-arrow {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                
                svg {
                    width: 24px;
                    height: 24px;
                    color: ${Theme.colors.white};
                }
                
                &:hover {
                    transform: scale(1.1);
                }
                
                &.prev {
                    margin-left: -25px;
                }
                
                &.next {
                    margin-right: -25px;
                }
            }
        }
        
        @media (max-width: 768px) {
            .slide {
                padding: 40px 30px;
                
                .slide-content {
                    flex-direction: column;
                    
                    .text-content {
                        max-width: 100%;
                        margin-bottom: 30px;
                    }
                    
                    .image-content {
                        order: -1;
                        margin-bottom: 20px;
                        
                        img {
                            max-width: 180px;
                        }
                    }
                }
            }
            
            .slider-arrows {
                .slider-arrow {
                    width: 40px;
                    height: 40px;
                    
                    svg {
                        width: 20px;
                        height: 20px;
                    }
                    
                    &.prev {
                        margin-left: -10px;
                    }
                    
                    &.next {
                        margin-right: -10px;
                    }
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
        padding: 80px 60px;
        background: linear-gradient(to right, #8F27CE, #6903C2);
        border-radius: 20px;
        max-width: 1400px;
        width: calc(100% - 40px);
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 60px;
        position: relative;
        overflow: hidden;



        .protection-content {
            flex: 1;
            min-width: 300px;
            position: relative;
            z-index: 1;
            
            h2 {
                font: ${Theme.typography.fonts.h1};
                color: ${Theme.colors.white};
                margin-bottom: 40px;
                position: relative;
                display: inline-block;
                text-shadow: none;

            }
            
            .protection-feature {
                margin-bottom: 36px;
                border-radius: 16px;
                
                box-shadow: none;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                

                
                &:hover {
                    transform: translateY(-5px);

                    box-shadow: none;
                }
                
                h3 {
                    display: flex;
                    align-items: center;
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.white};
                    margin-bottom: 10px;
                    font-weight: 700;
                    text-shadow: none;
                    
                    .icon-circle {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 18px;
                        box-shadow: none;
                        background-color: ${Theme.colors.white};

                        
                        svg {
                            width: 24px;
                            height: 24px;
                            color: ${Theme.colors.secondary};
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
            

            
            img {
                width: 100%;
                border-radius: 16px;
                box-shadow: none;
                transform: translateZ(0);
                transition: transform 0.5s ease;
                
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
        padding: 40px 6%;
        background-color: ${Theme.colors.white};
        position: relative;
        margin-bottom: 40px;
        
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
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: auto auto;
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
            
            .city-card {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
                
                &:nth-child(1) {
                    grid-column: span 4;
                    grid-row: span 1;
                    height: 280px;
                }
                
                &:nth-child(2) {
                    grid-column: span 4;
                    grid-row: span 1;
                    height: 280px;
                }
                
                &:nth-child(3) {
                    grid-column: span 4;
                    grid-row: span 1;
                    height: 280px;
                }
                
                &:nth-child(4) {
                    grid-column: span 3;
                    grid-row: span 1;
                    height: 200px;
                }
                
                &:nth-child(5) {
                    grid-column: span 3;
                    grid-row: span 1;
                    height: 200px;
                }
                
                &:nth-child(6) {
                    grid-column: span 3;
                    grid-row: span 1;
                    height: 200px;
                }
                
                &:nth-child(7) {
                    grid-column: span 3;
                    grid-row: span 1;
                    height: 200px;
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
                    background: rgba(0, 0, 0, 0.2);
                    transition: background 0.3s ease;
                }
                
                .city-label {
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    background-color: ${Theme.colors.primary};
                    color: ${Theme.colors.white};
                    font-weight: 600;
                    font-size: 18px;
                    padding: 8px 20px;
                    border-radius: 0px 16px 0px 0px;
                    z-index: 2;
                }
            }
        }
        
        @media (max-width: 1200px) {
            .city-grid {
                grid-template-columns: repeat(6, 1fr);
                
                .city-card {
                    &:nth-child(1), &:nth-child(2), &:nth-child(3) {
                        grid-column: span 6;
                    }
                    
                    &:nth-child(4), &:nth-child(5), &:nth-child(6), &:nth-child(7) {
                        grid-column: span 3;
                    }
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
            
            .city-grid {
                grid-template-columns: 1fr;
                
                .city-card {
                    &:nth-child(n) {
                        grid-column: span 1;
                    }
                    
                    .city-label {
                        font-size: 16px;
                        padding: 6px 16px;
                    }
                }
            }
        }
    }

    /* App Download Section */
    .app-download {
        padding: 40px 2%;
        width: 100%;
        max-width: 1400px;
        position: relative;
        overflow: hidden;
        border-radius: 0;
        
        
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

            
            .phone-mockup {
                img {
                    width: 100%;
                    height: 100%;
                    max-height: 700px;
                    object-fit: cover;
                }
            }
        }
    }

    /* List Property Section */
    .list-property {
        width: calc(100% - 40px);
        max-width: 1400px;
        padding: 90px 48px;
        background-color: ${Theme.colors.secondary};
        border-radius: 16px;
        margin: 40px auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
        gap: 40px;
        
        &::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 35%;
            height: 100%;
            background-image: url(${PhotoshootBg});
            background-size: cover;
            background-position: center;
            opacity: 1;
            mask-image: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
            -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
            z-index: 0;
        }

        @media (max-width: 768px) {
            flex-direction: column;
            padding: 40px 30px;
            
            .list-property-image {
                margin-right: 0;
                margin-bottom: 30px;
            }
        }

        .list-property-content {
            flex: 1;
            position: relative;
            z-index: 2;
            min-width: 280px;
            
            h2 {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.white};
                margin-bottom: 15px;
                max-width: 600px;
            }

            h3 {
                font: ${Theme.typography.fonts.h4DB};
                color: ${Theme.colors.white};
                max-width: 600px;
            }
            
            p {
                font: ${Theme.typography.fonts.mediumM};
                color: rgba(255, 255, 255, 0.95);
                margin-bottom: 25px;
                max-width: 550px;
                line-height: 1.6;
                font-size: 16px;
            }
            
            .buttons-container {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                flex-wrap: wrap;
            }
            
            .photoshoot-button {
                display: inline-block;
                padding: 14px 28px;
                border-radius: 30px;
                background-color: ${Theme.colors.white};
                color: ${Theme.colors.secondary};
                font: ${Theme.typography.fonts.largeB};
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 180px;
                text-align: center;
                
                &:hover {
                    background-color: rgba(255, 255, 255, 0.9);
                    transform: translateY(-3px);
                }
            }
            
            .read-more-button {
                display: inline-block;
                padding: 14px 28px;
                border-radius: 30px;
                background-color: transparent;
                color: ${Theme.colors.white};
                font: ${Theme.typography.fonts.largeB};
                border: 3px solid ${Theme.colors.white};
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 180px;
                text-align: center;
                
                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    transform: translateY(-3px);
                }
            }
        }
        
        .list-property-image {
            flex: 0 0 auto;
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 40px;
            
            img {
                width: 250px;
                height: auto;
                object-fit: contain;
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