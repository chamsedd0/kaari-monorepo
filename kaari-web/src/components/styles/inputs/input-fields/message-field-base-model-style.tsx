import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const MessageFieldBaseModel = styled.div<{isEmpty: boolean}>`
    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 100%;
    height: 100%;
    max-height: 48px;
    padding: 12px;
    background-color: white;
    border-radius: ${Theme.borders.radius.lg};


    .plus-button {
        width: 24px;
        height: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.8;

        &:hover {
            opacity: 1;
        }
    }

    .messeging-input {
        flex: 1;
        color: ${Theme.colors.black};
        font: ${Theme.typography.fonts.smallM};
        border: none;
        margin: none;
        padding: none;
        background-color: transparent;

        outline: none;
        height: 100%;


        &::placeholder {
            font: ${Theme.typography.fonts.smallM};
            color: ${Theme.colors.tertiary};
        }
    }

    .send-button {
        opacity: ${(props) => (props.isEmpty ? '0.5' : '1')};
        pointer-events: ${(props) => (props.isEmpty ? 'none' : 'all')};
        width: 17px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            opacity: 1;
        }
    }

`

export default MessageFieldBaseModel;