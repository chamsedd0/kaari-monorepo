import { Theme } from "../../../../theme/theme";
import styled from "styled-components";


const CalendarComponentBaseModel = styled.div`

    * {
        transition: all 0.3s ease;
    }
    
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    max-width: 424px;
    max-height: 450px;
    background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.lg};
    border: ${Theme.borders.primary};
    color: ${Theme.colors.black};

    .chosen-date {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 13px 24px;
        font: ${Theme.typography.fonts.largeM};
        border-bottom: ${Theme.borders.primary};
        width: 100%;
    }

    .control-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-bottom: ${Theme.borders.primary};

        

        .year-select, .month-select {
            padding: 13px 0px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            span {
                font: ${Theme.typography.fonts.largeM};
                margin-left: 24px;
            }

            .controls {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-right: 24px;

                button {
                    border: none;
                    background-color: transparent;
                    width: 12px;
                    height: 7px;

                    img {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                        filter: brightness(0);
                    }

                }

                .up {
                    transform: rotate(180deg);
                }
            }

        }
        .month-select {
            border-right: ${Theme.borders.primary};
        }


    }

    .calendar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        
        .days-enum {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            border-bottom: ${Theme.borders.primary};
            padding: 13px 19px;

            .day {
                font: ${Theme.typography.fonts.mediumM};
                min-width: 34px;
                text-align: center;
            }
        }


        .day-numbers {
            display: flex;
            align-items: start;
            justify-content: center;
            padding: 4px 3px;
            gap: 4px;
            flex-wrap: wrap;
            width: 100%;

            .day-number-box {
                border-radius: ${Theme.borders.radius.lg};
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                font: ${Theme.typography.fonts.mediumB};
                background-color: ${Theme.colors.white};
                cursor: pointer;
                color: ${Theme.colors.black};

                &:hover {
                    background-color: ${Theme.colors.secondary};
                    color: ${Theme.colors.white};

                }


            }
        }



    }



`

export default CalendarComponentBaseModel;