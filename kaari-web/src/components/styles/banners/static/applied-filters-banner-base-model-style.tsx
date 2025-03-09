import styled from "styled-components";
import { Theme } from "../../../../theme/theme";



export const AppliedFilterBanner = styled.div`
    
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    color: ${Theme.colors.white};
    background-color: ${Theme.colors.gray2};
    border-radius: ${Theme.borders.radius.extreme};
    font: ${Theme.typography.fonts.mediumB};

`