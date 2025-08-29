import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const DashboardPageStyle = styled.div`
    display: flex;
    flex-direction: row;
    gap: clamp(12px, 3vw, 24px);
    width: 100%;
    box-sizing: border-box;
    padding: 0 clamp(12px, 3vw, 24px);
    
    .left {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        margin-top: 18px;
        gap: clamp(12px, 3vw, 24px);
        min-width: 0; /* allow children to shrink */
    }

    .right {
        width: clamp(260px, 28vw, 340px);
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        gap: clamp(12px, 3vw, 24px);
    }

    .empty-module {
        border: ${Theme.borders.primary};
        border-radius: ${Theme.borders.radius.lg};
        padding: clamp(16px, 3.2vw, 24px);
        width: 100%;
        
        h3 {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
            margin-top: 0;
            margin-bottom: clamp(10px, 1.5vw, 16px);
            }
        }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: clamp(16px, 3.2vw, 24px);
        text-align: center;
        
        img {
            width: clamp(48px, 6vw, 64px);
            height: clamp(48px, 6vw, 64px);
            margin-bottom: clamp(10px, 2.5vw, 16px);
        }
        
        .title {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            margin-bottom: clamp(6px, 2vw, 8px);
        }
        
        .description {
            font: ${Theme.typography.fonts.mediumM};
            color: ${Theme.colors.gray2};
            margin-bottom: clamp(10px, 2.5vw, 16px);
            max-width: min(100%, 48ch);
        }

        .action-button {
            background-color: ${Theme.colors.primary};
            color: white;
            border: none;
            border-radius: ${Theme.borders.radius.md};
            padding: clamp(10px, 1.6vw, 12px) clamp(16px, 2.4vw, 24px);
            font: ${Theme.typography.fonts.mediumB};
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
                background-color: ${Theme.colors.primary};
            }
        }
    }

    /* Utility wrappers for responsive spacing and horizontal scroll */
    .section-spacer {
        margin-top: clamp(16px, 3.2vw, 24px);
    }

    .scroll-x {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 1200px) {
        .right {
            width: clamp(240px, 28vw, 320px);
        }
    }

    @media (max-width: 1024px) {
        flex-direction: column;

        .right {
            width: 100%;
            order: -1; /* move checklist above main on narrow screens */
        }
    }

    /* Ultra small devices */
    @media (max-width: 420px) {
        padding: 0 12px;

        .left { margin-top: 12px; }

        .empty-module h3 { font-size: 1rem; }
    }
`;
