import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const FavouritesStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 80px;
    padding: 40px;
    
    @media (max-width: 768px) {
    padding: 20px;
    }

    .favourites-container, .suggested-container {
        width: 100%;
        max-width: 1200px;
        margin-bottom: 40px;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .favourites-title, .suggested-title {
            font-size: 24px;
            font-weight: 600;
            color: ${Theme.colors.black};
        }

        .navigation-buttons {
            display: flex;
            gap: 10px;
            
            button {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: white;
                border: 1px solid ${Theme.colors.fifth};
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
                
                &:hover {
                    background-color: ${Theme.colors.tertiary};
                    border-color: ${Theme.colors.tertiary};
                }
                
                img {
                    width: 15px;
                }
            }
        }
    }

    .favourites-list, .suggested-list {
        display: flex;
        overflow-x: auto;
        gap: 20px;
        padding-bottom: 10px;
        scrollbar-width: thin;
        scrollbar-color: ${Theme.colors.fifth} transparent;
        scroll-behavior: smooth;
        
        &::-webkit-scrollbar {
            height: 6px;
        }
        
        &::-webkit-scrollbar-track {
            background: transparent;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${Theme.colors.fifth};
            border-radius: 10px;
        }

            > div {
            flex: 0 0 auto;
                width: 300px;
            
            @media (max-width: 576px) {
                width: 100%;
                min-width: 280px;
            }
        }
    }
    
    .loading-state {
        background-color: white;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        width: 100%;
        
        p {
            color: ${Theme.colors.gray2};
            font-size: 16px;
        }
    }

    .empty-state {
        background-color: white;
        border-radius: 12px;
        padding: 60px 20px;
        text-align: center;
        
        width: 100%;

        .empty-icon {
            display: flex;
            justify-content: center;
            margin-bottom: 24px;

            svg, img {
                width: 80px;
                height: 80px;
            }
        }
        
        h3 {
            font-size: 22px;
            font-weight: 600;
            color: ${Theme.colors.black};
            margin-bottom: 16px;
        }
        
        p {
            color: ${Theme.colors.gray2};
            font-size: 15px;
            margin-bottom: 8px;
            max-width: 340px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .search-now-btn, .browse-properties-btn {
            background-color: ${Theme.colors.secondary};
            color: white;
            border: none;
            border-radius: 50px;
            padding: 12px 28px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 24px;
            box-shadow: 0 2px 6px rgba(143, 39, 206, 0.3);

            &:hover {
                background-color: ${Theme.colors.primary};
                transform: translateY(-2px);
            }
        }
    }
`;

