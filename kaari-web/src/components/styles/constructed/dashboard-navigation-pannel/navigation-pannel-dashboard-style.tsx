import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const NavigationPannelDashboardStyle = styled.div`

    min-height: 100vh;
    max-width: 208px;
    background-color: ${Theme.colors.white};
    border-right: ${Theme.borders.primary};

    margin-top: 80px;

    display: flex;
    flex-direction: column;

    gap: 30px; 
    align-items: start;
    justify-content: start;
    padding: 60px 20px;
    padding-right: 50px;

    /* Smooth slide animation for responsive modes */
    transition: transform 280ms ease, box-shadow 280ms ease, opacity 200ms ease;
    will-change: transform;

    .nav-link {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 8px;
        text-decoration: none;
        border: none;
        background-color: transparent;
        cursor: pointer;


        .nav-link-icon {
            width: 24px;
            height: 24px;
        }

        .nav-link-text {
            font: ${Theme.typography.fonts.mediumB};
            color: ${Theme.colors.black};
            transition: color 0.3s ease;
            text-align: left;
        }

        &:hover .nav-link-text {
            color: ${Theme.colors.secondary};
        }

        &.active .nav-link-text {
            color: ${Theme.colors.secondary};
        }
    }

    /* Close button (visible on small screens) */
    .close-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: ${Theme.borders.radius.full};
        border: ${Theme.borders.primary};
        background: ${Theme.colors.white};
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 61;
    }

    @media (max-width: 1200px) {
        position: fixed;
        top: 80px;
        left: 0;
        height: calc(100vh - 80px);
        width: min(80vw, 320px);
        max-width: none;
        margin-top: 0;
        z-index: 60;
        box-shadow: 0 8px 28px rgba(0,0,0,0.12);
        transform: translateX(-110%);
        overflow-y: auto;
        padding: 24px 16px;

        &.open {
            transform: translateX(0);
        }

        .close-btn { display: inline-flex; }

        /* Tile layout for nav links on phones handled below; for tablets keep column */
    }

    @media (max-width: 640px) {
        /* Convert to 2-column square tiles */
        flex-direction: row;
        flex-wrap: wrap;
        gap: 12px;
        padding-top: 48px; /* space for close button */

        .nav-link {
            flex: 0 0 calc(50% - 6px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: ${Theme.colors.white};
            border: ${Theme.borders.primary};
            border-radius: ${Theme.borders.radius.lg};
            padding: 14px 10px;
            aspect-ratio: 1 / 1;
            box-shadow: 0 1px 2px rgba(0,0,0,0.03);
            transition: transform .15s ease;
        }

        .nav-link.active { outline: 2px solid ${Theme.colors.secondary}; }

        .nav-link:active { transform: scale(0.985); }

        .nav-link-icon {
            width: clamp(24px, 8vw, 36px);
            height: clamp(24px, 8vw, 36px);
        }

        .nav-link-text {
            text-align: center;
            font: ${Theme.typography.fonts.mediumM};
        }
    }
`
