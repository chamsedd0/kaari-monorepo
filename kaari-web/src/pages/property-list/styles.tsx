import styled, { keyframes } from "styled-components";
import { Theme } from "../../theme/theme";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
  }
`;

export const PropertyList = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
    padding-top: 80px;
    background-color: #f8f9fc;
    position: relative;
    color: ${Theme.colors.gray};
    font-family: 'Inter', sans-serif;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 10% 10%, rgba(103, 58, 183, 0.03), transparent 30%),
                    radial-gradient(circle at 90% 90%, rgba(103, 58, 183, 0.03), transparent 30%);
        pointer-events: none;
    }

    .main-content {
        flex: 1.2;
        height: 100%;
        background-color: ${Theme.colors.white};
        max-width: 860px;
        border-right: 1px solid rgba(0, 0, 0, 0.05);
        overflow-y: auto;
        scrollbar-width: thin;
        position: relative;
        box-shadow: 5px 0 25px rgba(0, 0, 0, 0.03);
        
        &::-webkit-scrollbar {
            width: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: rgba(103, 58, 183, 0.2);
            border-radius: 6px;
        }
        
        &::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 6px;
        }

        display: flex;
        flex-direction: column;
        gap: 30px;
        animation: ${fadeIn} 0.5s ease-out;

        .search-form {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            width: 100%;
            padding: 16px 30px;
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: ${Theme.colors.white};
            border-bottom: 1px solid rgba(0, 0, 0, 0.03);
            
            &::after {
                content: '';
                position: absolute;
                bottom: -20px;
                left: 0;
                width: 100%;
                height: 20px;
                background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
                pointer-events: none;
            }

            button {
                height: 48px;
                min-width: 180px;
                transition: all 0.3s ease;
                background-color: ${Theme.colors.secondary};
                border-radius: ${Theme.borders.radius.extreme};
                
                &:hover {
                    transform: translateY(-3px);
                    background-color: ${Theme.colors.primary};
                }
                

            }

            .search-input-wrapper {
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                
                .search-icon {
                    position: absolute;
                    left: 16px;
                    color: ${Theme.colors.gray};
                    font-size: 20px;
                    z-index: 5;
                }
                
                input {
                    height: 48px;
                    transition: all 0.3s ease;
                    

                }
                
                .clear-search {
                    position: absolute;
                    right: -25px;
                    background: transparent;
                    border: none;
                    color: ${Theme.colors.gray};
                    cursor: pointer;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    transition: all 0.3s ease;
                    
                    &:hover {
                        color: ${Theme.colors.primary};
                        transform: scale(1.1);
                    }
                }
            }
            
            .filter-icon-button {
                display: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: ${Theme.colors.primary};
                border: none;
                color: white;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-left: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(103, 58, 183, 0.2);
                
                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 15px rgba(103, 58, 183, 0.3);
                }
                
                @media (min-width: 768px) {
                    display: none;
                }
            }
        }

        .search-results-container {
            display: flex;
            flex-direction: column;
            gap: 30px;
            width: 100%;
            padding: 0px 30px;
            padding-bottom: 30px;


            .filters-container {
                display: flex;
                flex-direction: column;
                gap: 25px;
                width: 100%;
                padding-bottom: 25px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                position: relative;

                .text-select {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .text {
                        text-align: start;
                        max-width: 380px;
                        color: ${Theme.colors.black};

                        .title {
                            font: ${Theme.typography.fonts.largeB};
                            font-size: 24px;
                            margin-bottom: 10px;
                            color: ${Theme.colors.black};
                            font-weight: 700;
                            position: relative;
                            display: inline-block;

                        }

                        .sub-title {
                            font: ${Theme.typography.fonts.smallM};
                            color: ${Theme.colors.gray2};
                            font-size: 15px;
                            letter-spacing: 0.2px;
                        }
                    }

                    .select-container {
                        min-width: 180px;
                        max-width: 200px;
                        flex-shrink: 0;
                    }
                }

                .applied-filters {
                    display: flex;
                    align-items: center;
                    justify-content: start;
                    gap: 12px;
                    flex-wrap: wrap;
                    padding: 5px 0;
                    
                    &:empty {
                        display: none;
                    }
                    
                    > div {
                        transition: all 0.3s ease;
                        
                        &:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.05);
                        }
                    }

                    .filter-badge {
                        position: relative;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        
                        .remove-icon {
                            visibility: hidden;
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            width: 20px;
                            height: 20px;
                            background: ${Theme.colors.primary};
                            color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            opacity: 0;
                            transform: scale(0.8);
                            transition: all 0.3s ease;
                        }
                        
                        &:hover .remove-icon {
                            visibility: visible;
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                }
            }

            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 0;
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(103, 58, 183, 0.1);
                    border-left-color: ${Theme.colors.primary};
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                p {
                    color: ${Theme.colors.gray};
                    font-size: 16px;
                }
            }

            .results-container {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 25px;
                padding-bottom: 40px;
                
                .result {
                    position: relative;
                    transform: none !important;
                    transition: none !important;
                    box-shadow: none !important;

                    &::after {
                        display: none;
                    }
                    
                    &:nth-child(3n+1) {
                        animation: ${fadeIn} 0.5s ease-out 0.1s backwards;
                    }
                    
                    &:nth-child(3n+2) {
                        animation: ${fadeIn} 0.5s ease-out 0.2s backwards;
                    }
                    
                    &:nth-child(3n+3) {
                        animation: ${fadeIn} 0.5s ease-out 0.3s backwards;
                    }
                }
                
                .property-card-wrapper {
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    border-radius: 16px;
                    background: white;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
                    transition: none !important;
                    
                    .favorite-button {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        width: 36px;
                        height: 36px;
                        background: white;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        z-index: 10;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                        transition: background-color 0.2s ease;
                        
                        svg {
                            font-size: 18px;
                            color: ${Theme.colors.gray};
                            transition: color 0.2s ease;
                            
                            &.filled {
                                color: #e74c3c;
                            }
                        }
                        
                        &:hover {
                            background: #fff9f9;
                            
                            svg {
                                color: #e74c3c;
                            }
                        }
                    }
                    
                    .recommended-badge {
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        padding: 6px 12px;
                        background: ${Theme.colors.primary};
                        color: white;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        z-index: 10;
                        box-shadow: 0 4px 10px rgba(103, 58, 183, 0.3);
                        
                        svg {
                            font-size: 12px;
                            color: #FFD700;
                        }
                    }
                    
                    .property-details {
                        display: flex;
                        justify-content: space-around;
                        padding: 10px 15px 15px;
                        background: #f8f9fc;
                        border-top: 1px solid rgba(0,0,0,0.03);
                        
                        .detail {
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            font-size: 13px;
                            color: ${Theme.colors.gray};
                            
                            svg {
                                color: ${Theme.colors.primary};
                                font-size: 14px;
                            }
                        }
                    }
                }
                
                @media (max-width: 1200px) {
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                }
                
                @media (max-width: 767px) {
                    grid-template-columns: 1fr;
                }
            }
            
            .pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 30px;
                gap: 8px;
                
                .page-button {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.08);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    color: ${Theme.colors.gray};
                    
                    &:hover {
                        background: #f7f9fc;
                        transform: translateY(-2px);
                        box-shadow: 0 3px 10px rgba(0,0,0,0.05);
                    }
                    
                    &.active {
                        background: ${Theme.colors.primary};
                        color: white;
                        border-color: ${Theme.colors.primary};
                        position: relative;
                        overflow: hidden;
                        
                        &::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
                            pointer-events: none;
                        }
                    }
                    
                    &.arrow {
                        color: ${Theme.colors.gray2};
                        font-size: 18px;
                        
                        &:disabled {
                            opacity: 0.3;
                            cursor: not-allowed;
                            transform: none;
                            box-shadow: none;
                        }
                    }
                }
            }
            
            .no-results {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 0;
                text-align: center;
                animation: ${fadeIn} 0.5s ease-out;
                
                .no-results-icon {
                    font-size: 80px;
                    color: ${Theme.colors.gray};
                    margin-bottom: 24px;
                    opacity: 0.3;
                    animation: ${pulse} 2s infinite;
                }
                
                h3 {
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.gray};
                    margin-bottom: 16px;
                    font-weight: 600;
                }
                
                p {
                    font: ${Theme.typography.fonts.mediumM};
                    color: ${Theme.colors.gray2};
                    max-width: 400px;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                
                button {
                    padding: 14px 30px;
                    background: ${Theme.colors.primary};
                    color: white;
                    border: none;
                    border-radius: 30px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 20px rgba(103, 58, 183, 0.2);
                    
                    &:hover {
                        background: ${Theme.colors.primary}e6;
                        transform: translateY(-3px);
                        box-shadow: 0 12px 25px rgba(103, 58, 183, 0.3);
                    }
                }
            }
        }
    }

    .map {
        flex: 0.8;
        height: 100%;
        background: linear-gradient(135deg, #f0f1f8, #e8eaf5);
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 30%, rgba(103, 58, 183, 0.03), transparent 70%),
                radial-gradient(circle at 80% 70%, rgba(103, 58, 183, 0.03), transparent 70%);
            pointer-events: none;
        }
        
        .map-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: ${Theme.colors.gray};
            font-size: 16px;
            
            svg {
                margin-bottom: 16px;
                font-size: 64px;
                opacity: 0.4;
                color: ${Theme.colors.primary};
            }
            
            span {
                background: rgba(255,255,255,0.7);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
            }
        }
        
        .map-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 10;
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            .map-button {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: white;
                border: none;
                box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                
                svg {
                    font-size: 20px;
                    color: ${Theme.colors.gray};
                }
                
                &:hover {
                    background: #f8f9fc;
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                    
                    svg {
                        color: ${Theme.colors.primary};
                    }
                }
            }
        }
        
        .property-popup {
            position: absolute;
            background: white;
            border-radius: 15px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
            width: 260px;
            overflow: hidden;
            transform: translate(-50%, -100%);
            margin-top: -15px;
            z-index: 20;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: ${fadeIn} 0.3s ease-out;
            border: 1px solid rgba(0,0,0,0.05);
            
            .popup-image {
                width: 100%;
                height: 150px;
                object-fit: cover;
                transition: all 0.5s ease;
                
                &:hover {
                    transform: scale(1.05);
                }
            }
            
            .popup-content {
                padding: 16px;
                
                .popup-title {
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: ${Theme.colors.black};
                }
                
                .popup-price {
                    font-weight: 700;
                    font-size: 18px;
                    color: ${Theme.colors.primary};
                    margin-bottom: 10px;
                }
                
                .popup-details {
                    display: flex;
                    gap: 15px;
                    margin-top: 12px;
                    font-size: 13px;
                    color: ${Theme.colors.gray2};
                    
                    .detail-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        
                        svg {
                            font-size: 16px;
                            color: ${Theme.colors.primary}aa;
                        }
                    }
                }
            }
            
            &::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-right: 10px solid transparent;
                border-top: 10px solid white;
                filter: drop-shadow(0 3px 3px rgba(0,0,0,0.1));
            }
            
            &:hover {
                transform: translate(-50%, -105%);
                box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            }
        }
    }
    
    .toggle-map-button {
        display: none;
    }
    
    @media (max-width: 992px) {
        flex-direction: column;
        height: auto;
        
        .main-content {
            max-width: 100%;
            flex: 1;
            border-right: none;
            height: auto;
            min-height: calc(100vh - 80px);
            padding: 20px;
            
            .search-form {
                flex-direction: column;
                align-items: stretch;
                
                button {
                    width: 100%;
                }
            }
        }
        
        .map {
            flex: 1;
            height: 400px;
            display: none;
            
            &.active {
                display: block;
            }
        }
        
        .toggle-map-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 180px;
            height: 50px;
            background: linear-gradient(135deg, ${Theme.colors.primary}, #8662D9);
            color: white;
            border: none;
            border-radius: 30px;
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 100;
            box-shadow: 0 10px 25px rgba(103, 58, 183, 0.3);
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            font-size: 15px;
            
            svg {
                font-size: 22px;
            }
            
            &:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: 0 15px 30px rgba(103, 58, 183, 0.4);
            }
            
            &:active {
                transform: translateY(-2px) scale(1.02);
            }
        }
    }
`;