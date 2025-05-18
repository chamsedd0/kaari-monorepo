import { Theme } from "../../../theme/theme";
import styled from "styled-components";

export const CardBaseModelStyle2 = styled.div`
  background-color: ${Theme.colors.white};
  border-radius: ${Theme.borders.radius.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  position: relative;

  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    border-radius: ${Theme.borders.radius.md};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: ${Theme.borders.radius.md};
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

      &:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }

      &.prev {
        left: 8px;
      }

      &.next {
        right: 8px;
      }
    }

    .pagination-dots {
      position: absolute;
      bottom: 16px;
      right: 16px;
      display: flex;
      gap: 6px;
      z-index: 5;

      span {
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
  }

  .title, .subtitle {
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
  }

  .description {
    font: ${Theme.typography.fonts.mediumM};
    color: ${Theme.colors.success};
  }

  .min-stay {
    font: ${Theme.typography.fonts.smallM};
    color: ${Theme.colors.gray2};
  }

  .control {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 12px;

    .button {
      width: 100%;
      min-width: 150px;
    }
  }
`;