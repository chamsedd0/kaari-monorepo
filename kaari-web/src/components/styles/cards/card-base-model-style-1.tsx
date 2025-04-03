import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyle1 = styled.div<{isRecommended: boolean}>`

  background-color: ${Theme.colors.white};
  border-radius: ${Theme.borders.radius.md};
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  

  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${Theme.borders.radius.md};
    filter: brightness(0.9)
  }

  .image {
    width: 100%;
    max-height: 400px;
    position: relative;

    .certifications {

      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      display: flex;
      align-items: center;
      justify-content: start;
      padding: 16px;
      gap: 12px;

      @media (max-width: 1400px) {
        gap: 6px;
        padding: 10px;
        
      }

    }
  }

  .title {
    color: ${Theme.colors.black};
  }

  .title {
    font: ${Theme.typography.fonts.extraLargeDB};

    b {
      font: ${Theme.typography.fonts.extraLargeB};
    }
  }

  .subtitle {
    font: ${Theme.typography.fonts.largeB};
    color: ${Theme.colors.gray2};
  }

  .price {
    color: ${Theme.colors.black};
    font: ${Theme.typography.fonts.h3};

    b {
      font: ${Theme.typography.fonts.h4B};
    }
  }

  .description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.gray2};
  }

  .recommendedBanner {

    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: start;
    width: 100%;

    position: absolute;
    top: 0;
    right: 0;
    
    .banner {
      
      background-color: ${Theme.colors.secondary};
      color: ${Theme.colors.white};
      font: ${Theme.typography.fonts.largeB};
      padding: 10px 0px;
      display: ${props => props.isRecommended ? "flex" : "none"};
      align-items: center;
      justify-content: center;
      border-radius: ${Theme.borders.radius.md} ${Theme.borders.radius.md} 0 0;
      width: 100%;


    }

    .icon {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;

      @media (max-width: 1400px) {
        padding: 10px;
        
      }

      img {
        width: 52px;
        height: 52px;
      }
    }


    
  }


`;