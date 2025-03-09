import { Theme } from "../../../../theme/theme";
import styled from "styled-components";


const ConversationHeaderBaseModel = styled.div`
    
    width: 100%;
    height: 100%;
    max-height: 80px;
    max-width: 611px;
    padding: 16px;
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};

    display: flex;
    align-items: center;
    justify-content: space-between;


    .profile-show-case {

        display: flex;
        align-items: center;
        justify-content: start;
        gap: 12px;

        img {
            width: 48px;
            height: 48px;
            cursor: pointer;
        }

        .text {

            display: flex;
            align-items: start;
            justify-content: center;
            flex-direction: column;
            gap: 7px;
            color: ${Theme.colors.black};

            .name {
                font: ${Theme.typography.fonts.largeB};
            }
            .last-online {
                font: ${Theme.typography.fonts.smallM};
            }
        }

        
    }

    .controls {
            display: flex;
            align-items: end;
            justify-content: space-between;
            max-width: 123px;
            gap: 24px;
            padding-right: 7px;

            img {
                width: 24px;
                height: 24px;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    opacity: 0.8;
                }
            }

            .dots {
                align-self: center;
                margin-left: 7px;
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

        }

`

export default ConversationHeaderBaseModel;