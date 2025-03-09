import styled from "styled-components";
import { Theme } from "./theme/theme";


const LandingPage = styled.div`
    

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    min-height: 110vh;
    background-color: ${Theme.colors.black};

    .search-section {
        width: 100%;
        display: flex;
        min-height: 100vh;
        padding: 189px 134px;
        align-items: start;
        flex-direction: column;
        justify-content: center;
        position: relative;



        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
        }


        .title {
            z-index: 2;
            font: ${Theme.typography.fonts.h1};
            color: ${Theme.colors.white};
            text-align: start;
            max-width: 470px;
            margin-bottom: 32px;
            line-height: 150%;
        }

        .form-container {
            z-index: 2;
            width: 100%;
            display: flex;
            align-items: start;
            margin-bottom: 24px;
        }

        .explore-link {
            z-index: 2;
            font-size: 16px;
            font-weight: 500;
            color: ${Theme.colors.white};
            cursor: pointer;

            display: flex;
            align-items: center;
            justify-content: start;
            gap: 10px;

            transition: all 0.3s ease-in-out;

            &:hover {
                gap: 18px;
            }
        }

        .bottom-banner {
            position: absolute;
            width: 100%;
            background-color: ${Theme.colors.secondary};
            padding: 16px 32px;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .up-sell-for-owners {
                background-color: ${Theme.colors.primary};
                color: ${Theme.colors.white};
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                padding: 16px 20px;
                
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;

                border-radius: ${Theme.borders.radius.extreme};
            }
        }
    }

    .description-section {
        width: 100%;
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 40px;
        padding: 50px 20px;
        background-color: ${Theme.colors.white};
        
    }

    .mission-statment-section {
        width: 100%;
        min-width: 1136px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 100px;
        padding: 158px 20px; 
        background-color: ${Theme.colors.white};
        position: relative;

        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 0;
        }

        .what-is-kaari {
            z-index: 2;
            max-width: 400px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 32px;
            text-align: center;

            .title {
                font: ${Theme.typography.fonts.h2};
                color: ${Theme.colors.white};
            }

            .subtitle {
                font: ${Theme.typography.fonts.h4DB};
                line-height: 1;
                max-width: 266px;
                color: ${Theme.colors.white};
            }

            .buttons {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;
            }

        }

        .mission-blocks {
            width: 100%;
            display: flex;
            align-items: start;
            justify-content: space-between;
            gap: 40px;
            flex-wrap: wrap;
        }
    }

    .top-picks-section {
        width: 100%;
        padding: 116px 20px;

        display: flex;
        align-items: start;
        justify-content: center;
        gap: 44px;

        .title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .list-of-picks {
            width: 100%;
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 20px;
            overflow-x: scroll;
        }
    }

    .renter-protection-section {
        width: 100%;
        padding: 120px 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 70px;

        img {
            width: 37%;
        }

        .content {
            display: flex;
            flex-direction: column;
            align-items: start;
            justify-content: space-between;
            gap: 40px;

            .title {
                font-size: 90px;
                font-weight: 900;
                color: ${Theme.colors.white};
            }

            .list-item {
                display: flex;
                align-items: start;
                justify-content: center;
                gap: 16px;

                .item-title {
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    gap: 10px;
                    font: ${Theme.typography.fonts.h3};
                    color: ${Theme.colors.white};

                    img {
                        width: 32px;
                        height: 32px;
                    }
                }

                .item-content {
                    font: ${Theme.typography.fonts.extraLargeM};
                    color: ${Theme.colors.white};

                }
            }
        }
    }

    .recommendations-section {
        width: 100%;
        padding: 66px 20px;

        display: flex;
        align-items: start;
        justify-content: center;
        gap: 50px;

        .title {
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .list-of-recommendations {
            width: 100%;
            display: flex;
            align-items: start;
            justify-content: start;
            gap: 20px;
            overflow-x: scroll;
        }
    }

    .next-destination-section {

    }

    .ad-section {

    }

    .form-section {

    }


`


export default LandingPage;