import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const MessagesPageLayout = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 600px;
    border-radius: ${Theme.borders.radius.md};
    overflow: hidden;
    border: ${Theme.borders.primary};
`;

export const ConversationsList = styled.div`
    width: 30%;
    border-right: 1px solid ${Theme.colors.tertiary};
    display: flex;
    flex-direction: column;
`;

export const ConversationsHeader = styled.div`
    padding: 16px;
    border-bottom: 1px solid ${Theme.colors.tertiary};
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font: ${Theme.typography.fonts.h4B};
        color: ${Theme.colors.black};
    }

    .actions {
        display: flex;
        gap: 8px;
    }
`;

export const ConversationsListContent = styled.div`
    flex: 1;
    overflow-y: auto;
`;

export const ConversationItem = styled.div<{ isActive: boolean }>`
    background-color: ${props => props.isActive ? '#f5f3fa' : 'transparent'};
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: ${Theme.colors.gray6};
    }
`;

export const ChatArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f5f3fa;
`;

export const ChatContent = styled.div`
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const MessageContainer = styled.div<{ isSender: boolean }>`
    align-self: ${props => props.isSender ? 'flex-end' : 'flex-start'};
    max-width: 70%;
`;
