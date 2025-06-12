import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const DashboardPageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 32px;
    padding: 0;
    
    @media (max-width: 1200px) {
        flex-direction: column;
    }

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: 24px;
        max-width: 320px;
        
        @media (max-width: 1200px) {
            max-width: 100%;
            flex: 1;
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 24px;
        width: 100%;
        
        /* Add consistent styling to all card containers */
        > div, > div > div {
            border-radius: 12px;
            transition: all 0.2s ease-in-out;
        }
    }
    
    /* Style for section headers */
    .title-viewmore-container {
        .title {
            font-weight: 600;
            color: ${Theme.colors.black};
        }
        
        .viewmore {
            color: ${Theme.colors.secondary};
            transition: color 0.2s ease;
            
            &:hover {
                color: ${Theme.colors.primary};
                text-decoration: underline;
            }
        }
    }
    
    /* Consistent empty state styling */
    .empty-state {
        background: white;
        border-radius: 12px;
        border: ${Theme.borders.primary};
        padding: 32px;
        text-align: center;
        
        img {
            width: 80px;
            margin-bottom: 16px;
        }
        
        .title {
            color: #555;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .description {
            color: #888;
            font-size: 14px;
            margin-bottom: 16px;
        }
    }
`;