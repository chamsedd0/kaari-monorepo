import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const UploadCardStyled = styled.div`
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

        .uploaded-file {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            padding: 8px 12px;
            background-color: ${Theme.colors.quaternary};
            border-radius: ${Theme.borders.radius.sm};
            max-width: fit-content;

            .file-icon {
                font-size: 16px;
            }

            .file-name {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.secondary};
                word-break: break-word;
            }
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

            .error-text {
                font: ${Theme.typography.fonts.smallM};
                color: ${Theme.colors.error};
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

// Export the old name as well for backward compatibility
export { UploadCardStyled as UploadCard };