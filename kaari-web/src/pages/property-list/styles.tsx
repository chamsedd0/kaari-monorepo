import styled from "styled-components";
import { Theme } from "../../theme/theme";

// Update PropertyList to accept isCollapsed prop
interface PropertyListProps {
  $isCollapsed?: boolean;
}

export const PropertyList = styled.div<PropertyListProps>`
    display: flex;
    flex-direction: column;

    width: 100%;
    height: calc(100vh - 80px);
    margin-top: 80px;
    
    @media (min-width: 992px) {
        display: grid;
        grid-template-columns: ${props => props.$isCollapsed ? '50px 1fr' : '1fr 1fr'};
        transition: grid-template-columns 0.3s ease;
    }

    /* Custom styles for Google Maps markers and InfoWindows */
    .gm-style {
        .property-price-label {
            z-index: 2;
            font-weight: 700;
            letter-spacing: -0.2px;
            white-space: nowrap;
            text-align: center;
            padding: 4px 8px;
            background-color: #FFFFFF;
            border: 1px solid ${Theme.colors.black};
            border-radius: 9999px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            
            &.selected {
                background-color: ${Theme.colors.primary};
                color: white !important;
                border-color: ${Theme.colors.primary};
            }
        }

        /* Styled InfoWindow */
        .gm-style-iw {
            padding: 0 !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            max-width: 320px !important;

            .gm-style-iw-d {
                overflow: hidden !important;
                padding: 0 !important;
                max-width: 320px !important;
            }

            .gm-ui-hover-effect {
                display: none !important;
            }
            
            .property-info-window {
                width: 100%;
                max-width: 320px;
                background-color: white;
                
                .info-window-image-container {
                    position: relative;
                    width: 100%;
                    height: 160px;
                    overflow: hidden;
                    
                    .info-window-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                        transition: transform 0.3s ease;
                        
                        &:hover {
                            transform: scale(1.05);
                        }
                    }
                    
                    .property-type-badge {
                        position: absolute;
                        top: 12px;
                        left: 12px;
                        background-color: ${Theme.colors.primary};
                        color: white;
                        padding: 5px 10px;
                        border-radius: 50px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: capitalize;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                        letter-spacing: 0.5px;
                    }
                    
                    .recommended-badge {
                        position: absolute;
                        bottom: 12px;
                        left: 12px;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 50px;
                        font-size: 12px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                        backdrop-filter: blur(4px);
                    }

                    .custom-close-button {
                        position: absolute;
                        top: 12px;
                        right: 12px;
                        background-color: rgba(0, 0, 0, 0.5);
                        color: white;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        border: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        cursor: pointer;
                        z-index: 10;
                        transition: all 0.2s ease;

                        img {
                            filter: brightness(0) invert(1);
                            width: 12px;
                            height: 12px;
                        }
                        &:hover {
                            background-color: rgba(0, 0, 0, 0.8);
                            transform: scale(1.1);
                        }
                    }
                }
                
                .info-window-content {
                    padding: 16px 18px;
                    
                    .info-window-title {
                        margin: 0 0 10px 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: ${Theme.colors.black};
                        line-height: 1.3;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    
                    .info-window-details {
                        margin-bottom: 18px;
                        
                        .info-window-price {
                            font-size: 18px;
                            font-weight: 700;
                            color: ${Theme.colors.primary};
                            margin-bottom: 6px;
                            
                            .price-type {
                                font-weight: 500;
                                font-size: 14px;
                                color: ${Theme.colors.gray2};
                                margin-left: 3px;
                            }
                        }
                        
                        .info-window-address {
                            font-size: 14px;
                            color: ${Theme.colors.black};
                            margin-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        
                        .info-window-features {
                            display: flex;
                            align-items: center;
                            font-size: 13px;
                            color: ${Theme.colors.gray2};
                            font-weight: 500;
                            
                            .feature {
                                white-space: nowrap;
                            }
                            
                            .feature-divider {
                                margin: 0 8px;
                                color: ${Theme.colors.fifth};
                            }
                        }
                        
                        .info-window-amenities {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 8px;
                            margin-top: 12px;
                            
                            .amenity-tag {
                                background-color: ${Theme.colors.fifth};
                                color: ${Theme.colors.white};
                                padding: 5px 10px;
                                border-radius: 50px;
                                font-size: 11px;
                                font-weight: 500;
                                letter-spacing: 0.3px;
                            }
                            
                            .more-amenities {
                                background-color: ${Theme.colors.fifth};
                                color: ${Theme.colors.white};
                                padding: 5px 10px;
                                border-radius: 50px;
                                font-size: 11px;
                                font-weight: 500;
                                letter-spacing: 0.3px;
                            }
                        }
                    }
                    
                    .info-window-actions {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        
                        .view-property-button {
                            flex: 1;
                            background-color: ${Theme.colors.secondary};
                            color: white;
                            border: none;
                            padding: 12px 16px;
                            border-radius: 50px;
                            font-weight: 600;
                            font-size: 14px;
                            cursor: pointer;
                            transition: all 0.2s;
                            
                            &:hover {
                                background-color: ${Theme.colors.primary};
                                transform: translateY(-2px);
                            }
                        }
                        
                        
                    }
                }
            }
        }
    }

    .main-content {
        padding: 20px;
        overflow-y: auto;
        box-sizing: border-box;
        display: block;
        z-index: 1;
        width: 100%;
        height: 100%;
        position: relative;
        transition: all 0.3s ease;
        
        .content-container {
            margin: 0 auto;
            max-width: 820px;
            
            @media (max-width: 1240px) {
                padding: 0 20px;
            }
        }
        
        &.collapsed {
            padding: 0;
            width: 50px;
            overflow: hidden;
            
            .filtering-section,
            .content-container {
                display: none;
            }
        }
        
        .collapse-toggle-button {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            display: none;
            width: 24px;
            height: 80px;
            background-color: ${Theme.colors.primary};
            color: white;
            border: none;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            z-index: 10;
            padding: 0;
            
            svg {
                font-size: 20px;
            }
            
            @media (min-width: 992px) {
                display: flex;
                align-items: center;
                justify-content: center;
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
            
            @media (min-width: 992px) {
                position: sticky;
                z-index: 1;
            }
        }
        
        &.expanded {
            @media (min-width: 992px) {
                grid-column: 2 / 3;
            }
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
            position: relative;
            
            svg {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
            }
            
            .property-markers {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                
                .property-marker {
                    position: absolute;
                    transform: translate(-50%, -100%);
                    
                    .price-tag {
                        position: relative;
                        background-color: ${Theme.colors.primary};
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        margin-bottom: 4px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        
                        &:after {
                            content: '';
                            position: absolute;
                            bottom: -6px;
                            left: 50%;
                            transform: translateX(-50%);
                            border-left: 6px solid transparent;
                            border-right: 6px solid transparent;
                            border-top: 6px solid ${Theme.colors.primary};
                        }
                    }
                    
                    .marker-dot {
                        width: 12px;
                        height: 12px;
                        background-color: ${Theme.colors.primary};
                        border: 2px solid white;
                        border-radius: 50%;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        margin: 0 auto;
                    }
                    
                    &:hover {
                        z-index: 10;
                        
                        .price-tag {
                            background-color: ${Theme.colors.secondary};
                            
                            &:after {
                                border-top-color: ${Theme.colors.secondary};
                            }
                        }
                        
                        .marker-dot {
                            background-color: ${Theme.colors.secondary};
                        }
                    }
                }
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
            
            &.collapsed {
                display: none;
            }
        }
        
        .map {
            height: 100vh;
            &:not(.active) {
                display: none;
            }
        }
    }
`;