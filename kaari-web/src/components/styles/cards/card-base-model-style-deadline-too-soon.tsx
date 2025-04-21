import styled from "styled-components";
import { Theme } from "../../../theme/theme";

export const DeadlineTooSoonCardStyle = styled.div`
    display: flex;
    align-items: start;
    justify-content: start;
    padding: 20px;
    gap: 12px;
    border-radius: 16px;
    border: ${Theme.borders.primary};
    background-color: ${Theme.colors.white};
    width: 100%;


    .text-container {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 20px;
    
    .title {
        font: ${Theme.typography.fonts.extraLargeB};
        color: ${Theme.colors.black};
    }

    .description {
        font: ${Theme.typography.fonts.text14};
        color: ${Theme.colors.gray2};
    }

}

    .img-button-container {
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: space-between;
        height: 100%;
        

        img {
            width: 80px;
            height: 80px;
        }

        .button-container {
            min-width: 140px;
        }
        
    }
    
    

`