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
    background-color: ${Theme.colors.white};
    border-radius: 16px;
    border: 1px solid #E0E0E0;
    color: ${Theme.colors.black};
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    .chosen-date {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 15px 24px;
        font: ${Theme.typography.fonts.largeM};
        border-bottom: 1px solid #E0E0E0;
        width: 100%;
        background-color: #FAFAFA;
    }

    .control-date {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-bottom: 1px solid #E0E0E0;
        background-color: #FAFAFA;

        .year-select, .month-select {
            padding: 13px 0px;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            span {
                font: ${Theme.typography.fonts.largeM};
                margin-left: 24px;
                color: #333;
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
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    padding: 0;
                    color: #666;
                    border-radius: 50%;

                    &:hover {
                        color: ${Theme.colors.primary};
                        background-color: rgba(128, 0, 255, 0.05);
                    }

                    svg {
                        width: 12px;
                        height: 12px;
                    }
                }
            }
        }
        
        .month-select {
            border-right: 1px solid #E0E0E0;
        }
    }

    .calendar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 12px;
        
        .days-enum {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            border-bottom: 1px solid #E0E0E0;
            padding: 12px 16px;
            background-color: #FAFAFA;

            .day {
                font: ${Theme.typography.fonts.mediumM};
                min-width: 34px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
        }

        .day-numbers {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            width: 100%;
            padding: 12px 8px;

            .day-number-box {
                border-radius: 8px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font: ${Theme.typography.fonts.mediumM};
                background-color: ${Theme.colors.white};
                cursor: pointer;
                color: #333;
                margin: 2px auto;

                &:hover:not(.disabled) {
                    background-color: rgba(128, 0, 255, 0.1);
                }

                &.selected {
                    background-color: ${Theme.colors.primary};
                    color: ${Theme.colors.white};
                    font-weight: 600;
                }

                &.today:not(.selected) {
                    border: 2px solid ${Theme.colors.primary};
                    font-weight: 600;
                }

                &.other-month {
                    color: #AAA;
                    opacity: 0.7;
                }

                &.disabled {
                    text-decoration: line-through;
                    color: #CCC;
                    cursor: not-allowed;
                    background-color: #F5F5F5;
                }
                
                &.loading {
                    position: relative;
                    
                    .loading-indicator {
                        position: absolute;
                        bottom: 2px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 8px;
                        color: ${Theme.colors.primary};
                        animation: pulse 1.5s infinite;
                    }
                    
                    @keyframes pulse {
                        0% { opacity: 0.3; }
                        50% { opacity: 1; }
                        100% { opacity: 0.3; }
                    }
                }
            }
        }
    }
`;

export default CalendarComponentBaseModel;