import styled from "styled-components";
import { Theme } from "../../theme/theme";


export const PropertyList = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: calc(100vh - 80px);
    margin-top: 80px;
    
    @media (min-width: 992px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .main-content {
        padding: 20px;
        overflow-y: auto;
        box-sizing: border-box;
        display: block;
        z-index: 1;
        width: 100%;
        height: 100%;
        
        .content-container {
            margin: 0 auto;
            max-width: 820px;
            
            @media (max-width: 1240px) {
                padding: 0 20px;
            }
        }
    }

    .search-form {
        margin-bottom: 40px;
        margin-top: 20px;
        border-radius: 12px;
        
        .search-input-wrapper {
            position: relative;
            margin-bottom: 16px;
            
            .search-icon {
                position: absolute;
                left: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: ${Theme.colors.gray2};
            }
            
            input {
                width: 100%;
                padding: 12px 12px 12px 40px;
                border: 1px solid ${Theme.colors.fifth};
                border-radius: 8px;
                
                &:focus {
                    outline: none;
                    border-color: ${Theme.colors.primary};
                }
            }
            
            .clear-search {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                
                svg {
                    color: ${Theme.colors.gray2};
                }
            }
        }
        
        .filter-icon-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: ${Theme.colors.primary};
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            margin-left: 8px;
            transition: background-color 0.2s;
            
            &:hover {
                background-color: ${Theme.colors.secondary};
            }
            
            @media (min-width: 768px) {
                display: none;
            }
        }
    }

    .search-results-container {
        .filters-container {
            margin-bottom: 20px;
            
            .text-select {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
                flex-wrap: wrap;
                
                @media (max-width: 576px) {
                    flex-direction: column;
                    
                    .select-container {
                        width: 100%;
                        margin-top: 12px;
                    }
                }
                
                .text {
                    .title {
                        font-size: 1.5rem;
                        font-weight: 700;
                        margin-bottom: 4px;
                        color: ${Theme.colors.black};
                    }
                    
                    .sub-title {
                        font-size: 0.9rem;
                        color: ${Theme.colors.gray2};
                    }
                }
                
                .select-container {
                    width: 180px;
                }
            }
            
            .applied-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 12px;
                
                .filter-badge {
                    position: relative;
                    cursor: pointer;
                    
                    .remove-icon {
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background-color: ${Theme.colors.gray2};
                        color: white;
                        width: 18px;
                        height: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        border: none;
                        padding: 0;
                        line-height: 1;
                        
                        &:hover {
                            background-color: ${Theme.colors.primary};
                        }
                    }
                }
            }
        }
        
        .results-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            
            @media (min-width: 768px) {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .result {
                .property-card-wrapper {
                    max-width: 400px;
                }
            }
        }
        
        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: ${Theme.colors.primary};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            }
            
            p {
                color: ${Theme.colors.gray2};
            }
        }
        
        .no-results {
            text-align: center;
            padding: 40px 20px;
            background-color: white;
            border-radius: 8px;
            
            .no-results-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            h3 {
                margin-bottom: 12px;
                color: ${Theme.colors.black};
            }
            
            p {
                color: ${Theme.colors.gray2};
                margin-bottom: 24px;
            }
            
            button {
                background-color: ${Theme.colors.primary};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
                
                &:hover {
                    background-color: ${Theme.colors.secondary};
                }
            }
        }
        
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 32px;
            gap: 8px;
            
            .page-button {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid ${Theme.colors.fifth};
                background-color: white;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s;
                
                &.active {
                    background-color: ${Theme.colors.primary};
                    color: white;
                    border-color: ${Theme.colors.primary};
                }
                
                &:hover:not(.active):not(:disabled) {
                    border-color: ${Theme.colors.primary};
                    color: ${Theme.colors.primary};
                }
                
                &:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            }
        }
    }

    .map {
        display: none;
        background-color: #f3f3f3;
        transition: all 0.3s ease;
        position: relative;
        width: 100%;
        height: 100%;
        
        @media (min-width: 992px) {
            display: block;
            width: 100%;
            height: 100%;
            position: sticky;
            top: 80px;
        }
        
        &.active {
            display: block;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            z-index: 100;
        }
        
        .map-placeholder {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: ${Theme.colors.gray2};
            padding: 0;
            text-align: center;
            
            svg {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
            }
        }
        
        .map-controls {
            position: absolute;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            
            .map-button {
                width: 40px;
                height: 40px;
                background-color: white;
                border: none;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                
                svg {
                    width: 24px;
                    height: 24px;
                }
                
                &:hover {
                    background-color: ${Theme.colors.fifth};
                }
            }
        }
    }
    
    .toggle-map-button {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${Theme.colors.primary};
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        z-index: 10;
        
        @media (min-width: 992px) {
            display: none;
        }
        
        svg {
            font-size: 18px;
        }
    }

    @media (max-width: 991px) {
        display: block;
        
        .main-content {
            width: 100%;
            height: auto;
            max-height: none;
        }
        
        .map {
            height: 100vh;
            &:not(.active) {
                display: none;
            }
        }
    }
`;