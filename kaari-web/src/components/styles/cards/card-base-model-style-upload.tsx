import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const UploadCard = styled.div`
       background-color: ${Theme.colors.white};
    border-radius: ${Theme.borders.radius.md};
    padding: 20px;
    border: ${Theme.borders.primary};
    display: flex;
    flex-direction: column;
    gap: 34px;
    width: 100%;

    .title-container{
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
        justify-content: start;
        
        .title{
            font: ${Theme.typography.fonts.extraLargeB};
            color: ${Theme.colors.black};
        }

        .description{
            font: ${Theme.typography.fonts.text16};
            color: ${Theme.colors.gray2};
        }
    }

    .upload-container{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .text-container{
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            justify-content: start;

            .size-text{
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.gray2};
            }

        }

        .upload-button{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: 150px;
            
        }
    }

`;