import styled from "styled-components";
import { Theme } from "../../theme/theme";

export const FavouritesStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 80px;
    padding: 20px;
    padding-top: 32px;
    padding-bottom: 40px;
    max-width: 1500px;
    margin-left: auto;
    margin-right: auto;

    .favourites-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 100%;
        height: 550px; /* Fixed container height */
        gap: 24px;

        .favourites-title {
            color: ${Theme.colors.black};
            font: ${Theme.typography.fonts.h3};
        }

        .favourites-list {
            display: flex;
            align-items: start;
            justify-content: start;
            width: 100%;
            height: calc(100% - 48px); /* Container height minus title and gap */
            gap: 20px;
            overflow-x: auto;
            overflow-y: hidden;
            
            > div {
                min-width: 300px;
                width: 300px;
                height: 100%;
            }

            &::-webkit-scrollbar {
                display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    }

    .suggested-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        width: 100%;
        height: 550px; /* Fixed container height */
        gap: 24px;

        .suggested-title {
            color: ${Theme.colors.black};
            font: ${Theme.typography.fonts.extraLargeB};
        }

        .suggested-list {
            display: flex;
            align-items: start;
            justify-content: start;
            width: 100%;
            height: calc(100% - 48px); /* Container height minus title and gap */
            gap: 20px;
            overflow-x: auto;
            overflow-y: hidden;

            > div {
                min-width: 300px;
                width: 300px;
                height: 100%;
            }

            &::-webkit-scrollbar {
                display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    }

    .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .navigation-buttons {
            display: flex;
            gap: 12px;

            button {
                width: 40px;
                height: 40px;
                border-radius: ${Theme.borders.radius.md};
                border: 1px solid ${Theme.colors.tertiary};
                background: ${Theme.colors.white};
                color: ${Theme.colors.black};
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;

                &:hover {
                    background: ${Theme.colors.tertiary};
                }
            }
        }
    }
`;

