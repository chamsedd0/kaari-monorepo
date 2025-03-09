import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

interface ExistsBannerBaseModelProps {
  status: 'exists' | 'not_exists';
}

const ExistsBannerBaseModel = styled.div<ExistsBannerBaseModelProps>`
  background-color: ${props => {
    switch (props.status) {
      case 'exists':
        return Theme.colors.secondary;
      case 'not_exists':
        return Theme.colors.primary;
      default:
        return Theme.colors.white;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  border: none;
  border-radius: ${Theme.borders.radius.round};

  img {
    width: 12px;
    height: 12px;
  }

`;

export default ExistsBannerBaseModel;
