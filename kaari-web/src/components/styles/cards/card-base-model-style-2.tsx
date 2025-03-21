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

  img {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: ${Theme.borders.radius.md};
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
  }


`;