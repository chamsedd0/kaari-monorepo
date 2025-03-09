import styled from "styled-components";
import LikeBannerBaseModel from "./banner-base-model-style-like";
import { Theme } from "../../../../theme/theme";

interface LikeBannerProps {
  isLiked: boolean;
}

const LikeBannerBaseModelVariant1 = styled(LikeBannerBaseModel)<LikeBannerProps>`
  background-color: ${props => props.isLiked ? Theme.colors.secondary : Theme.colors.white};
  border: none;
  transition: all 0.3s ease-in-out;

  svg path {
    transition: fill 0.3s ease-in-out;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default LikeBannerBaseModelVariant1;

