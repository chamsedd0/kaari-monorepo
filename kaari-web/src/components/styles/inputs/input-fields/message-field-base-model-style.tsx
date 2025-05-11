import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const MessageFieldBaseModel = styled.div<{isEmpty: boolean}>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
    height: 100%;
    max-height: 60px;
    padding: 14px 20px;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 1px 3px rgba(15, 15, 15, 0.03), 0 1px 2px rgba(15, 15, 15, 0.06);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
    border: 1px solid rgba(0, 0, 0, 0.04);
    
    &:focus-within {
        box-shadow: 0 2px 6px rgba(15, 15, 15, 0.05), 0 1px 3px rgba(15, 15, 15, 0.1);
        transform: translateY(-1px);
        border-color: rgba(0, 0, 0, 0.08);
    }

    .plus-button {
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all 0.2s ease;
        opacity: 0.6;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            opacity: 0.9;
            background-color: rgba(0, 0, 0, 0.05);
            transform: scale(1.05);
        }
        
        img {
            width: 18px;
            height: 18px;
        }
    }

    .messeging-input {
        flex: 1;
        color: ${Theme.colors.black};
        font: ${Theme.typography.fonts.smallM};
        border: none;
        margin: 0;
        padding: 0;
        background-color: transparent;
        outline: none;
        height: 100%;
        font-size: 15px;
        letter-spacing: 0.01em;

        &::placeholder {
            font: ${Theme.typography.fonts.smallM};
            color: #6b7280;
            opacity: 0.6;
        }
        
        &:focus::placeholder {
            opacity: 0.4;
        }
    }

    .send-button {
        opacity: ${(props) => (props.isEmpty ? '0.4' : '0.8')};
        pointer-events: ${(props) => (props.isEmpty ? 'none' : 'all')};
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 6px;
        border-radius: 50%;
        background-color: ${props => props.isEmpty ? 'transparent' : `${Theme.colors.secondary}10`};

        &:hover {
            opacity: 1;
            background-color: ${Theme.colors.secondary}20;
            transform: scale(1.05);
        }
        
        img {
            width: 20px;
            height: 20px;
        }
    }
`

export default MessageFieldBaseModel;