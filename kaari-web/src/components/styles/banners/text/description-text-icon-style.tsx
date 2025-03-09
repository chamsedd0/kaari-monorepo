import { Theme } from "../../../../theme/theme";
import styled from "styled-components";

const DescriptionText = styled.div`
    
    width: 100%;
    height: 100%;
    max-width: 300px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    img {
        width: 41px;
        height: 48px;
    }

    .text {
        font: ${Theme.typography.fonts.text16};
        color: ${Theme.colors.black};
        text-align: center;
        max-width: 100%;
        line-height: 24px;
    }


`

export default DescriptionText;