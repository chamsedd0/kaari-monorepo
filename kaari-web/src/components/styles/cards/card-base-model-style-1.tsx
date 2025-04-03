import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyle1 = styled.div<{isRecommended?: boolean}>`

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

    .favorite-icon {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 36px;
      height: 36px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      
      svg {
        font-size: 18px;
        color: ${Theme.colors.gray};
        transition: all 0.3s ease;
        
        &.filled {
          color: #e74c3c;
        }
      }
      
      &:hover {
        transform: scale(1.15);
        background: #fff9f9;
        
        svg {
          color: #e74c3c;
          transform: scale(1.1);
        }
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
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .banner {
      background: ${Theme.colors.primary};
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(103, 58, 183, 0.3);
    }
  }


`;