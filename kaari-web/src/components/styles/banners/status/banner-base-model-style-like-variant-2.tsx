import styled from "styled-components";
import LikeBannerBaseModel from "./banner-base-model-style-like";
import { Theme } from "../../../../theme/theme";

interface LikeBannerProps {
  isLiked: boolean;
}

const LikeBannerBaseModelVariant2 = styled(LikeBannerBaseModel)<LikeBannerProps>`
  background-color: rgba(217, 217, 217, 0.6);
  
  border: 3px solid ${Theme.colors.white};
  transition: all 0.3s ease-in-out;

  svg path {
    transition: fill 0.3s ease-in-out;
  }

  &:hover {
    opacity: 0.9;
  }
`;

export default LikeBannerBaseModelVariant2;

