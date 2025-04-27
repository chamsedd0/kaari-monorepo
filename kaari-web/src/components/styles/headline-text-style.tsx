import { Theme } from "../../theme/theme";
import styled from "styled-components";

export const HeadlineTextStyle = styled.h1`
border-radius: ${Theme.borders.radius.md};
  display: flex;
  gap: 8px;
  min-width: 300px;
  max-width: 400px;
  z-index: 1;
  align-items: start;
  justify-content: space-between;
  padding: 16px;
  position: absolute;
  
  
  .left-group {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 16px;
    width: 75%;
    

    img {
      width: 24px;
      height: 24px;
    }

    .text-group {
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        gap: 6px;

        .title {
            font: ${Theme.typography.fonts.largeB};
            color: ${Theme.colors.white};
        }

        .description {
            font: ${Theme.typography.fonts.text14};
            color: ${Theme.colors.white};
        }  
    }
  }

  .right-group {
    display: flex;
    align-items: start;
    justify-content: end;
    gap: 16px;
    width: 25%;
    img {
        width: 16px;
        height: 16px;
        cursor: pointer;
    }
    
  }
  
  



`;