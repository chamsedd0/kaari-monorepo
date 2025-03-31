import styled from "styled-components";
import { Theme } from "../../../../../../theme/theme";

export const SupportingDocumentsPageStyle = styled.div`
    display: flex;
    width: 100%;
    gap: 40px;

    .right{
        display: flex;
        flex-direction: column;
        flex: 0.35;
        gap: 24px;
    }

    .left{
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 32px;
        width: 100%;

        .title{
            font: ${Theme.typography.fonts.h3};
            color: ${Theme.colors.black};
        }

        .container{
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        
    }
`;