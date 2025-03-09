import styled from "styled-components";
import { Theme } from "../../theme/theme";


export const PropertyList = styled.div`

    display: flex;
    align-items: start;
    justify-content: space-between;
    width: 100%;
    height: 100vh;
    padding-top: 80px;



    .main-content {

        flex: 1.2;
        height: 100%;
        background-color: ${Theme.colors.white};
        max-width: 850px;
        padding: 30px 20px;
        padding-bottom: 0px;
        border: ${Theme.borders.primary};

        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: start;
        justify-content: start;


        .search-form {

            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            width: 100%;

            button {
                height: 48px;
            }

        }

        .search-results-container {

            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: start;
            justify-content: start;
            width: 100%;
            overflow: hidden;


            .filters-container {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: start;
                justify-content: space-between;
                width: 100%;

                .text-select {
                    display: flex;
                    align-items: start;
                    justify-content: space-between;
                    width: 100%;

                    .text {

                        text-align: start;
                        max-width: 270px;
                        color: ${Theme.colors.black};

                        .title {
                            font: ${Theme.typography.fonts.largeB};
                            margin-bottom: 8px;
                        }

                        .sub-title {
                            font: ${Theme.typography.fonts.smallM};
                            color: ${Theme.colors.gray2};
                        }

                    }


                }

                .applied-filters {

                    display: flex;
                    align-items: center;
                    justify-content: start;
                    gap: 8px;
                    flex-wrap: wrap;

                }

            }

            .results-container {

                width: 100%;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(40%, 1fr));
                gap: 17px;
                padding-bottom: 20px;
                overflow-y: scroll;

                
                .result {

                }
            }
        }

    }

    .map {

        flex: 0.8;
        height: 100%;
        background-color: ${Theme.colors.primary};

    }


`