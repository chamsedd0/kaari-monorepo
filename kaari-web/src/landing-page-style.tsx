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
        
        

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 20%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%),
                linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.20) 100%);
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
            
            @media (max-width: 1050px) {
                .explore-link {
                    justify-content: center;
                    display: flex;
                }
            }

            @media (max-width: 700px) {
                .explore-link {
                    font-size: 14px;
                    gap: 8px;
                    margin-top: 18px;
                    .arrow-icon img { width: 16px; height: 16px; }
                }
            }
            
            .hero-stats {
                display: flex;
                margin-top: 60px;
                gap: 40px;
                cursor: default;
                animation: fadeInUp 1s ease-out 0.6s backwards;
                
                @media (max-width: 1050px) {
                    width: 100%;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    gap: clamp(6px, 2vw, 12px);
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: relative;
                    transition: transform 0.3s ease;
                    
                    @media (max-width: 1050px) {
                        flex: 0 1 33.33%;
                        min-width: 0;
                        align-items: center;
                        text-align: center;
                    }
                    
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
                    /* Keep row layout for small screens; override defaults */
                    flex-direction: row;
                    gap: clamp(8px, 3vw, 16px);
                    margin-top: 24px;
                }
                
                @media (max-width: 1050px) {
                    .stat-number { font-size: clamp(12px, 2.8vw, 16px); line-height: 1.15; }
                    .stat-number::after { width: clamp(12px, 2.5vw, 20px); height: 2px; margin-top: 6px; }
                    .stat-label { font-size: clamp(8px, 2vw, 9px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .stat-item { align-items: center; }
                }

                @media (max-width: 700px) {
                    gap: clamp(4px, 2vw, 10px);
                    .stat-number { font-size: clamp(11px, 3.4vw, 15px); }
                    .stat-number::after { width: clamp(10px, 2.2vw, 18px); }
                    .stat-label { font-size: clamp(7px, 1.8vw, 8px); }
                }
            }
            
            @media (max-width: 1050px) {
                /* Ensure old desktop stats are hidden on mobile with higher specificity */
                .hero-stats { display: none !important; }
                .mobile-hero-stats { display: flex; }
            }
        }

        /* Mobile hero stats (hidden by default) */
        .mobile-hero-stats {
            display: none;
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
        
        @media (max-width: 1050px) {
            .hero-stats { display: none; }
            .mobile-hero-stats {
                display: flex;
                width: 100%;
                max-width: 760px;
                margin: 18px auto 0;
                gap: 8px;
                justify-content: space-between;
            }
            .mobile-hero-stats .stat {
                flex: 1 1 0;
                min-width: 0;
                border-radius: 14px;
                padding: 10px 12px;
                background: rgba(255,255,255,0.15);
                backdrop-filter: saturate(160%) blur(6px);
                border: 1px solid rgba(255,255,255,0.20);
                color: ${Theme.colors.white};
                text-align: center;
            }
            .mobile-hero-stats .num {
                font-weight: 800;
                font-size: clamp(12px, 3.4vw, 16px);
                line-height: 1.1;
            }
            .mobile-hero-stats .lab {
                margin-top: 6px;
                font-size: clamp(8px, 2.2vw, 10px);
                color: rgba(255,255,255,0.9);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .hosting-button { display: none; }
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

        /* Mobile hero search bar */
        .mobile-hero-search {
            display: none;
            width: 100%;
            max-width: 760px;
            margin-top: 28px;
            border-radius: 999px;
            background: rgba(255,255,255,0.92);
            backdrop-filter: saturate(180%) blur(10px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.06);
            position: relative;
        }
        .mobile-hero-search .section {
            appearance: none;
            outline: none;
            border: 0;
            background: transparent;
            flex: 1 1 0;
            display: flex;
            flex-direction: column;
            text-align: left;
            padding: 16px 18px;
        }
        .mobile-hero-search .divider { width: 1px; background: rgba(0,0,0,0.08); }
        .mobile-hero-search .label { font: ${Theme.typography.fonts.smallM}; color: ${Theme.colors.gray2}; }
        .mobile-hero-search .value { font: ${Theme.typography.fonts.mediumB}; color: ${Theme.colors.black}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; display: block; }

        /* Inline small search trigger button */
        .mobile-hero-search .search-go {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: ${Theme.colors.secondary};
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
            cursor: pointer;
        }
        .mobile-hero-search .search-go:hover { background: ${Theme.colors.primary}; }
        .mobile-hero-search .search-go svg { width: 18px; height: 18px; }

        /* Mobile modal styles */
        .mobile-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: stretch; justify-content: center; z-index: 2000; }
        .mobile-modal .modal-card { width: 100%; background: #fff; border-radius: 0; padding: 14px 16px; height: 100%; display: flex; flex-direction: column; }
        .mobile-modal .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .mobile-modal .modal-header .title { font-weight: 800; font-size: 16px; }
        .mobile-modal .modal-header .close { width: 28px; height: 28px; border-radius: 50%; border: none; background: ${Theme.colors.tertiary}; position: relative; }
        .mobile-modal .modal-header .close::before, .mobile-modal .modal-header .close::after { content: ''; position: absolute; top: 50%; left: 50%; width: 12px; height: 2px; background: #fff; transform-origin: center; }
        .mobile-modal .modal-header .close::before { transform: translate(-50%, -50%) rotate(45deg); }
        .mobile-modal .modal-header .close::after { transform: translate(-50%, -50%) rotate(-45deg); }
        .mobile-modal .modal-body { padding: 8px 2px; overflow: auto; }
        .mobile-modal .text-input { width: 100%; border: 1px solid #eee; border-radius: 10px; padding: 12px 14px; font-size: 14px; }
        .mobile-modal .hint { margin-top: 8px; font-size: 12px; color: ${Theme.colors.gray2}; }
        .mobile-modal .tiles { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .mobile-modal .tile { border: 1px solid #eee; border-radius: 10px; padding: 10px 0; font-weight: 700; background: #fafafa; }
        .mobile-modal .tile.active { background: ${Theme.colors.secondary}; color: #fff; border-color: ${Theme.colors.secondary}; }
        .mobile-modal .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px; }
        .mobile-modal .modal-actions .secondary { background: #f2f2f2; border: none; border-radius: 10px; padding: 10px 14px; }
        .mobile-modal .modal-actions .primary { background: ${Theme.colors.secondary}; color: #fff; border: none; border-radius: 10px; padding: 10px 14px; }

        /* Google Places suggestions drawer */
        /* Ensure Places suggestions are visible and on top */
        .pac-container { 
          z-index: 4000 !important; 
          border-radius: 12px; 
          box-shadow: 0 12px 24px rgba(0,0,0,0.18); 
          overflow: hidden; 
          background: #fff !important; 
          border: 1px solid #e6e6e6; 
          pointer-events: auto; 
        }
        .pac-container .pac-item, .pac-container .pac-item-query { color: #222; }
        .pac-logo:after { display: none; }
        .pac-item { padding: 10px 12px; cursor: pointer; }
        .pac-item:hover { background: ${Theme.colors.tertiary}; color: ${Theme.colors.black}; }

        @media (max-width: 1050px) {
            /* Swap to mobile-friendly background via Unsplash */
            background-image: url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop');
            background-position: center;
            background-size: cover;
            /* center hero block under header */
            align-items: center;
            min-height: calc(100vh - 80px);
            padding-top: 0;

            .hero-content { 
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            .hero-content h1 {
                margin-left: auto;
                margin-right: auto;
                font-size: clamp(36px, 7vw, 52px);
            }

            .search-container { display: none; }
            .mobile-hero-search { display: flex; }
        }

        @media (max-width: 700px) {
            background-image: url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop');
        }
    }

    /* Features Section */
    .features-section {
        padding: 80px 6%;
        background-color: ${Theme.colors.white};
        max-width: 1400px;
            width: 100%;
        margin: 0 auto;

        /* Desktop grid */
        .features-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(160px, 1fr));
            gap: 24px;
            align-items: center;
            justify-items: center;
        }
        .features-grid .feature-item { 
            display: flex; flex-direction: column; align-items: center; text-align: center; 
            padding: 24px 16px; border-radius: 12px; background: ${Theme.colors.white};
        }
        .features-grid .feature-item img { width: 48px; height: 48px; margin-bottom: 12px; }
        .features-grid .feature-item p { font: ${Theme.typography.fonts.mediumM}; color: ${Theme.colors.gray2}; }

        /* Mobile slider */
        .features-slider {
            max-width: 520px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            overflow: hidden;
        }
        .feature-track {
            display: flex;
            width: 100%;
            transition: transform 400ms ease;
            will-change: transform;
        }
        .feature-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 28px 24px;
            border-radius: 16px;
            background: ${Theme.colors.white};
            min-width: 100%;
        }
        .feature-icon {
            width: 56px;
            height: 56px;
            margin-bottom: 16px;
        }
        .feature-text {
            font: ${Theme.typography.fonts.largeM};
                color: ${Theme.colors.gray2};
        }
        .feature-dots {
            display: flex;
            gap: 6px;
            align-items: center;
            justify-content: center;
        }
        .feature-dots .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${Theme.colors.sixth};
            cursor: pointer;
            transition: transform 0.2s ease, background 0.2s ease;
        }
        .feature-dots .dot.active { background: ${Theme.colors.secondary}; transform: scale(1.15); }

        /* Show grid on desktop, slider on mobile */
        @media (max-width: 1050px) {
            .features-grid { display: none; }
            .features-slider { display: flex; }
        }
        @media (min-width: 1051px) {
            .features-grid { display: grid; }
            .features-slider { display: none; }
        }
    }

    .what-is-kaari-container {
        max-width: 1400px;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
    }

    /* Hide the What is Kaari section on mobile */
    @media (max-width: 1050px) {
        .what-is-kaari-container { display: none !important; }
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
        
        @media (max-width: 1050px) {
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
        padding: 140px 8%;
        background-color: ${Theme.colors.white};
        
        .carousel-viewport {
            max-width: 1400px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
        }
        
        .carousel-viewport::before,
        .carousel-viewport::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 40px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
        }
        
        /* Left fade */
        .carousel-viewport::before {
            left: 0;
            background: linear-gradient(to right, ${Theme.colors.white} 0%, rgba(255,255,255,0) 100%);
        }
        
        /* Right fade */
        .carousel-viewport::after {
            right: 0;
            background: linear-gradient(to left, ${Theme.colors.white} 0%, rgba(255,255,255,0) 100%);
        }
        
        .carousel-viewport.show-left-fade::before { opacity: 1; }
        .carousel-viewport.show-right-fade::after { opacity: 1; }
        
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1400px;
            margin: 0 auto 24px;
        
        h2 {
            font: ${Theme.typography.fonts.h2};
            color: ${Theme.colors.black};
                margin: 0;
                text-align: left;
            }
            
            .navigation-buttons {
                display: flex;
                gap: 8px;
                
                button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: ${Theme.borders.primary};
                    background: ${Theme.colors.white};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                    
                    &:hover {
                        background: ${Theme.colors.tertiary};
                    }
                }
            }
        }
        
        .property-grid {
            display: flex;
            gap: clamp(12px, 2vw, 24px);
            max-width: 1400px;
            margin: 0 auto;
            overflow-x: hidden;
            overflow-y: hidden;
            scroll-behavior: smooth;
            padding-bottom: 8px;
            
            &::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none; background: transparent; }
            
            .property-card {
                min-width: clamp(240px, 24vw, 320px);
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 16px;
                overflow: hidden;
                
                &:hover {
                    transform: translateY(-10px);
                }
            }
        }
        
        .pagination-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
            
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${Theme.colors.sixth};
                cursor: pointer;
                &.active { background: ${Theme.colors.secondary}; transform: scale(1.1); }
            }
        }

        /* Mobile tweaks */
        @media (max-width: 1050px) {
            padding: 80px 4%;
            .section-header { margin-bottom: 16px; font-size: 12px; }
            .section-header .top-picks-title { font-size: 24px !important; }
            .carousel-viewport { width: 100%; max-width: 100%; overflow: visible; }
            .property-grid { width: 100%; max-width: 100%; gap: 16px; overflow-x: auto; padding-left: 8px; padding-right: 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
            .property-grid .property-card { min-width: calc(100% - 16px); max-width: calc(100% - 16px); scroll-snap-align: start; }
            .navigation-buttons button { width: 36px; height: 36px; }
        }

        /* Mobile tweaks */
        @media (max-width: 1050px) {
            padding: 80px 4%;
            .section-header { margin-bottom: 16px; }
            .property-grid { gap: 16px; overflow-x: auto; padding-left: 4px; padding-right: 4px; scroll-snap-type: x mandatory; }
            .property-grid .property-card { min-width: clamp(220px, 82vw, 300px); scroll-snap-align: start; }
            .property-grid .property-card:first-child { margin-left: 4px; }
            .property-grid .property-card:last-child { margin-right: 4px; }
            .navigation-buttons button { width: 36px; height: 36px; }
        }

        /* Smaller cards under 700px */
        @media (max-width: 700px) {
            .property-grid { gap: 12px; padding-left: 4px; padding-right: 4px; }
            .property-grid .property-card { min-width: clamp(200px, 74vw, 260px); max-width: clamp(200px, 74vw, 260px); }
            .navigation-buttons button { width: 32px; height: 32px; }
            /* Softer, narrower fades on mobile */
            .carousel-viewport::before,
            .carousel-viewport::after { width: 28px; }
            .carousel-viewport::before { background: linear-gradient(to right, ${Theme.colors.white} 0%, rgba(255,255,255,0) 80%); }
            .carousel-viewport::after { background: linear-gradient(to left, ${Theme.colors.white} 0%, rgba(255,255,255,0) 80%); }
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

    /* Renter Protection - responsive adjustments under 1050px */
    @media (max-width: 1050px) {
        /* Standardize section horizontal padding under 1050px */
        .top-picks,
        .recommended-properties,
        .city-selection,
        .app-download,
        .list-property,
        .renter-protection {
            padding-left: 4% !important;
            padding-right: 4% !important;
        }

        .renter-protection {
            padding: 40px 5%;
            gap: 28px;
            border-radius: 16px;
            width: calc(100% - 20px);

            .protection-content {
                h2 { font-size: clamp(18px, 5vw, 26px); }
                .protection-feature { margin-bottom: 22px; }
                .protection-feature h3 { font-size: clamp(14px, 4vw, 18px); }
                .protection-feature p { font-size: clamp(12px, 3.5vw, 15px); }
            }

            .protection-image {
                flex: 1 1 320px;
                min-width: 260px;
            }
        }
    }

    /* Renter Protection - dedicated mobile version under 700px */
    @media (max-width: 700px) {
        .renter-protection { display: none !important; }
        .renter-protection-mobile { display: block !important; }
    }

    .renter-protection-mobile {
        display: none;
        width: 100%;
        margin: 0 auto;
        background: linear-gradient(180deg, #8F27CE, #6903C2);
        padding: 18px 4% 22px;
        color: ${Theme.colors.white};
        box-shadow: 0 10px 24px rgba(0,0,0,0.12);

        .rp-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;

            .rp-title {
                font-weight: 800;
                font-size: 18px;
                line-height: 1.2;
            }
        }

        .rp-points {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;

            .rp-point {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 10px 12px;

                .icon-circle { flex: 0 0 24px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.15); display: inline-flex; align-items: center; justify-content: center; }
                h4 { margin: 0; font-size: 14px; line-height: 1.2; }
                p { margin: 2px 0 0 0; font-size: 12px; opacity: 0.95; }
            }
        }

        .rp-cta {
            margin-top: 14px;
            display: flex;
            gap: 10px;

            .primary-button, .secondary-button {
                display: inline-block;
                padding: 12px 24px;
                border-radius: 30px;
                font: ${Theme.typography.fonts.largeB};
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 140px;
                text-align: center;
                flex: 1;
            }
            .primary-button {
                background-color: ${Theme.colors.white};
                color: ${Theme.colors.secondary};
            }
            .secondary-button {
                background-color: transparent;
                color: ${Theme.colors.white};
                border: 3px solid ${Theme.colors.white};
            }
        }
    }

    /* Recommended Properties Section */
    .recommended-properties {
        padding: 120px 8%;
        background-color: ${Theme.colors.white};
        
        .carousel-viewport {
            max-width: 1400px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
        }
        
        .carousel-viewport::before,
        .carousel-viewport::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            width: 40px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
        }
        
        .carousel-viewport::before { left: 0; background: linear-gradient(to right, ${Theme.colors.white} 0%, rgba(255,255,255,0) 100%); }
        .carousel-viewport::after { right: 0; background: linear-gradient(to left, ${Theme.colors.white} 0%, rgba(255,255,255,0) 100%); }
        .carousel-viewport.show-left-fade::before { opacity: 1; }
        .carousel-viewport.show-right-fade::after { opacity: 1; }
        
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1400px;
            margin: 0 auto 24px;
        
        h2 {
            font: ${Theme.typography.fonts.h2};
            color: ${Theme.colors.black};
                margin: 0;
                text-align: left;
            }
            
            .navigation-buttons {
                display: flex;
                gap: 8px;
                
                button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: ${Theme.borders.primary};
                    background: ${Theme.colors.white};
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s ease;
                    
                    &:hover {
                        background: ${Theme.colors.tertiary};
                    }
                }
            }
        }
        
        .property-grid {
            display: flex;
            gap: 24px;
            max-width: 1400px;
            margin: 0 auto;
            overflow-x: hidden;
            overflow-y: hidden;
            scroll-behavior: smooth;
            padding-bottom: 8px;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
            &::-webkit-scrollbar { width: 0 !important; height: 0 !important; display: none; background: transparent; }
            
            .property-card {
                min-width: 300px;
                cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 16px;
                overflow: hidden;
                
                &:hover {
                    transform: translateY(-10px);
                }
            }
        }
        
        .pagination-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
            
            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${Theme.colors.sixth};
                cursor: pointer;
                &.active { background: ${Theme.colors.secondary}; transform: scale(1.1); }
            }
        }
    }

    /* Recommended section mobile fade softness */
    @media (max-width: 700px) {
        .recommended-properties .carousel-viewport::before,
        .recommended-properties .carousel-viewport::after { width: 28px; }
        .recommended-properties .carousel-viewport::before { background: linear-gradient(to right, ${Theme.colors.white} 0%, rgba(255,255,255,0) 80%); }
        .recommended-properties .carousel-viewport::after { background: linear-gradient(to left, ${Theme.colors.white} 0%, rgba(255,255,255,0) 80%); }
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
                font-size: 24px;
            }
            
            .view-all {
                margin-bottom: 24px;
                padding: 10px 18px;
                font-size: 14px;
                
                &::after {
                    width: 16px;
                    height: 16px;
                }
            }
            
            /* Mobile bento grid */
            .city-grid {
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: clamp(90px, 22vw, 140px);
                grid-auto-flow: dense;
                gap: 12px;
                
                .city-card {
                    height: 100% !important;

                    &:nth-child(1) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }
                    &:nth-child(2) {
                        grid-column: span 1;
                        grid-row: span 1;
                    }
                    &:nth-child(3) {
                        grid-column: span 1;
                        grid-row: span 1;
                    }
                    &:nth-child(4) {
                        grid-column: span 1;
                        grid-row: span 2;
                    }
                    &:nth-child(5) {
                        grid-column: span 1;
                        grid-row: span 1;
                    }
                    &:nth-child(6) {
                        grid-column: span 1;
                        grid-row: span 1;
                    }
                    &:nth-child(7) {
                        grid-column: span 2;
                        grid-row: span 2;
                    }
                    
                    .city-label {
                        font-size: 14px;
                        padding: 6px 14px;
                    }
                }
            }
        }

        /* Tighter bento sizing under 700px */
        @media (max-width: 700px) {
            .city-grid {
                /* Use 3 columns for smaller tiles and denser packing */
                grid-template-columns: repeat(3, 1fr);
                grid-auto-rows: clamp(70px, 18vw, 110px);
                grid-auto-flow: dense;
                gap: 10px;

                .city-card {
                    /* Default 1x1; create a balanced bento with no full-row singles */
                    /* Large featured tile */
                    &:nth-child(1) {
                        grid-column: span 2 !important;
                        grid-row: span 2 !important;
                    }
                    /* Tall tile later to keep early rows packed */
                    &:nth-child(4) {
                        grid-row: span 2 !important;
                    }

                    .city-label {
                        font-size: 12px;
                        padding: 5px 12px;
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

    /* App Download - Mobile section (hidden by default; shows under 1050px) */
    .app-download-mobile {
        display: none;
        width: 100%;
        background: ${Theme.colors.white};
        padding: 40px 4%;
        box-sizing: border-box;

        .mobile-card {
            background: linear-gradient(180deg, #ffffff, #f7f4ff);
            border: 1px solid ${Theme.colors.tertiary};
            border-radius: 16px;
            padding: 18px 16px 22px;
            box-shadow: 0 8px 18px rgba(0,0,0,0.06);
        }

        .title {
            font-weight: 800;
            font-size: clamp(18px, 5vw, 26px);
            color: ${Theme.colors.black};
            margin-bottom: 6px;
            text-align: center;
        }
        .subtitle {
            font-size: clamp(12px, 3.8vw, 15px);
            color: ${Theme.colors.gray2};
            text-align: center;
            margin-bottom: 14px;
        }

        .mockup {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            margin: 10px 0 14px;
            img { width: 70%; height: auto; }
        }

        .store-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;

            a {
                display: flex;
                align-items: center;
                gap: 12px;
                border-radius: 16px;
                padding: 10px 15px;
                min-width: 200px;
                max-width: 220px;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            a.app-store {
                background: #000; border: 2px solid #000;
                .store-icon { color: #fff; }
                .small-text { color: #f2f2f2; }
                .big-text { color: #fff; }
                &:hover { transform: translateY(-6px); background: #222; border-color: #222; }
            }
            a.google-play {
                background: #fff; border: 2px solid #e6e6e6;
                .store-icon { color: ${Theme.colors.primary}; }
                .small-text { color: #666; }
                .big-text { color: #333; }
                &:hover { transform: translateY(-6px); background: #f9f9f9; border-color: #e0e0e0; }
            }
            .store-icon { font-size: 26px; }
            .store-text { display: flex; flex-direction: column; align-items: flex-start; }
            .small-text { font-size: 12px; }
            .big-text { font-size: 18px; font-weight: 600; }
        }
    }

    /* Switch to mobile app section under 1050px */
    @media (max-width: 1050px) {
        .app-download { display: none !important; }
        .app-download-mobile { display: block !important; }
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

    /* Photoshoot card - mobile redesign <=700px */
    @media (max-width: 700px) {
        .list-property {
            width: calc(100% - 24px);
            padding: 22px 18px;
            margin: 24px auto;
            border-radius: 16px;
            background: ${Theme.colors.secondary};
            box-shadow: 0 8px 24px rgba(0,0,0,0.10);
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: center;
            gap: 12px;

            &::after { display: none; }

            .list-property-image {
                order: 2;
                margin: 0;
                align-self: center;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: auto;
                    height: 120px;
                }
            }

            .list-property-content {
                order: 1;
                padding: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                h3 { 
                    display: block; 
                    color: ${Theme.colors.white};
                    font-weight: 800; 
                    font-size: 16px; 
                    line-height: 16px; 
                    margin: 0; 
                }
                h2 {
                    font-weight: 800;
                    font-size: 24px;
                    line-height: 28px;
                    margin: 8px 0 6px 0;
                    color: ${Theme.colors.white};
                }
                p {
                    margin: 8px 0;
                    font-size: 12px;
                    line-height: 16px;
                    opacity: 0.95;
                    max-width: none;
                    color: ${Theme.colors.white};
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    max-width: 50%;
                }

                .buttons-container {
                    width: 100%;
                    gap: 0;
                }
                .photoshoot-button {
                    width: 70%;
                    border-radius: 100px;
                    font-size: 15px;
                    font-weight: 800;
                    min-width: 0;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    background: ${Theme.colors.white};
                    color: ${Theme.colors.secondary};
                    border: none;
                    max-width: 100%;
                    box-sizing: border-box;
                    overflow: hidden;
                }
                .read-more-button { display: none; }
            }
        }
    }

    /* Features Footer */
    .features-footer {
        padding: 60px 6%;
        background-color: ${Theme.colors.white};
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;

        /* Desktop grid */
        .features-footer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
        }

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

        /* Mobile slider (hidden on desktop) */
        .footer-features-slider {
            max-width: 520px;
            margin: 0 auto;
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            overflow: hidden;
        }

        /* Reuse feature-track/card/dots styles */
        .feature-track { display: flex; width: 100%; transition: transform 400ms ease; will-change: transform; }
        .feature-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 28px 24px; border-radius: 16px; background: ${Theme.colors.white}; min-width: 100%; }
        .feature-icon { width: 56px; height: 56px; margin-bottom: 16px; }
        .feature-text { font: ${Theme.typography.fonts.largeM}; color: ${Theme.colors.gray2}; }
        .feature-dots { display: flex; gap: 6px; align-items: center; justify-content: center; }
        .feature-dots .dot { width: 8px; height: 8px; border-radius: 50%; background: ${Theme.colors.sixth}; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; }
        .feature-dots .dot.active { background: ${Theme.colors.secondary}; transform: scale(1.15); }

        @media (max-width: 1050px) {
            .features-footer-grid { display: none; }
            .footer-features-slider { display: flex; }
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

/* Enforce 100% width carousels on mobile and one-card paging */
export const MobileCarouselFix = styled.div`
  @media (max-width: 1050px) {
    /* Smaller, responsive section titles across landing page (strong override) */
    .section-header h2,
    .top-picks .section-header h2,
    .recommended-properties .section-header h2,
    .city-selection h2,
    .renter-protection .protection-content h2,
    .app-download .app-content h2,
    .list-property .list-property-content h2 {
      font-size: clamp(14px, 3.8vw, 20px) !important;
      line-height: 1.2 !important;
    }

    /* Ensure fades show correctly on mobile when classes are toggled */
    .top-picks .carousel-viewport::before,
    .top-picks .carousel-viewport::after,
    .recommended-properties .carousel-viewport::before,
    .recommended-properties .carousel-viewport::after {
      opacity: 0;
    }
    .top-picks .carousel-viewport.show-left-fade::before,
    .recommended-properties .carousel-viewport.show-left-fade::before {
      opacity: 1;
    }
    .top-picks .carousel-viewport.show-right-fade::after,
    .recommended-properties .carousel-viewport.show-right-fade::after {
      opacity: 1;
    }

    /* Make section titles smaller/responsive on mobile */
    .top-picks .section-header h2,
    .recommended-properties .section-header h2 {
      font-size: clamp(18px, 5vw, 26px) !important;
      line-height: 1.2 !important;
    }

    .top-picks .carousel-viewport,
    .recommended-properties .carousel-viewport {
      width: 100% !important;
      max-width: 100% !important;
      overflow: visible !important;
    }
    .top-picks .property-grid,
    .recommended-properties .property-grid {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box;
      overflow-x: auto !important;
      padding-left: 10px;
      padding-right: 10px;
      gap: 12px !important;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .top-picks .property-grid .property-card,
    .recommended-properties .property-grid .property-card {
      flex: 0 0 calc(100% - 20px) !important;
      min-width: calc(100% - 20px) !important;
      max-width: calc(100% - 20px) !important;
      scroll-snap-align: start;
        }
    }
`;