import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const SettingsPageStyle = styled.div`
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 40px;
    width: 100%;

    .right {
        display: flex;
        flex-direction: column;
        flex: 0.45;
        gap: 32px;
    }

    .left {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 40px;

    

            .settings-title {
                font: ${Theme.typography.fonts.h3};
                color: ${Theme.colors.black};
            }

            .settings-info {
                font: ${Theme.typography.fonts.text16};
                color: ${Theme.colors.gray2};
                max-width: 750px;
                line-height: 150%;
            }

            .settings-password-box {
                display: flex;
                flex-direction: column;
                gap: 40px;
                
                .password-section-title {
                    font: ${Theme.typography.fonts.extraLargeB};
                    color: ${Theme.colors.black};
                    margin-bottom: 16px;
                }
                
                .password-field-container {
                    display: flex;
                    flex-direction: column;
                    gap: 40px;

                    .row {
                        display: flex;
                        flex-direction: row;
                        gap: 20px;
                        width: 100%;

                        input {
                            width: 100%;
                        }
            }
            
        }
    }

    .save-button {
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
        max-width: 188px;

        
    }

    .email-change {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 24px;
        border-radius: ${Theme.borders.radius.md};
        border: ${Theme.borders.primary};

        .email-change-title {
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        .new-email-title {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.black};
            margin-bottom: -4px;
        }


        .your-email-info {
            display: flex;
            flex-direction: row;
            
            
        

            .current-email {
                font: ${Theme.typography.fonts.mediumM};
                color: ${Theme.colors.black};
            }
            .your-email {
                margin-left: 6px;
                font: ${Theme.typography.fonts.mediumB};
                color: ${Theme.colors.black};
            }
    }
        
    }
    }
`;

