import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyle1 = styled.div<{$isRecommended?: boolean}>`
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
    aspect-ratio: 4/3;
    position: relative;
    overflow: hidden;
    border-radius: ${Theme.borders.radius.md};
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${Theme.borders.radius.md};
      filter: brightness(0.9);
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(255, 255, 255, 0.7);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease, background-color 0.3s ease;
      z-index: 5;

      svg {
        font-size: 18px;
        color: ${Theme.colors.black};
      }

      &.prev {
        left: 8px;
      }

      &.next {
        right: 8px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
    }

    .pagination-dots {
      position: absolute;
      bottom: 70px; /* Position above the certification banners */
      right: 16px;
      display: flex;
      gap: 6px;
      z-index: 5;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &.active {
          background-color: white;
          transform: scale(1.2);
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    &:hover {
      .nav-button {
        opacity: 1;
      }
    }

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
      transition: none;
      
      svg {
        font-size: 18px;
        color: ${Theme.colors.gray};
        transition: none;
        
        &.filled {
          color: #e74c3c;
        }
      }
      
      &:hover {
        background: #fff9f9;
        
        svg {
          color: #e74c3c;
        }
      }
    }

    .housing-preference-icon {
      position: absolute;
      top: 15px;
      right: 60px;
      width: 36px;
      height: 36px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
      z-index: 10;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      transition: none;
      
      svg {
        font-size: 18px;
        color: ${Theme.colors.gray};
      }
      
      &:hover {
        background: #f9f9ff;
      }
    }
  }

  .title {
    color: ${Theme.colors.black};
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
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

  /* Mobile reductions for <=700px */
  @media (max-width: 700px) {
    gap: 6px;

    .image {
      aspect-ratio: 16/11;
      margin-bottom: 6px;

      .pagination-dots { bottom: 56px; right: 12px; gap: 5px; }
      .pagination-dots .dot { width: 6px; height: 6px; }

      .certifications { padding: 10px 8px; gap: 6px; }
      .favorite-icon {
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        svg { font-size: 14px; }
      }

      .housing-preference-icon {
        top: 8px;
        right: 40px;
        width: 24px;
        height: 24px;
        svg { font-size: 12px; }
      }
    }

    .title {
      font-size: 14px;
      line-height: 1.2;
      b { font-size: 15px; }
      margin-bottom: 0px;
    }

    .subtitle {
      font-size: 12px;
      margin-bottom: 2px;
    }

    .price {
      font-size: 16px;
      b { font-size: 14px; }
      margin-bottom: 2px;
    }

    .description {
      font-size: 12px;
    }

    .recommendedBanner {
      top: 10px;
      left: 10px;
      .banner { padding: 4px 8px; font-size: 10px; }
    }
  }
`;