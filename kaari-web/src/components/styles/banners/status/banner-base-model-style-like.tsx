import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


const LikeBannerBaseModel = styled.div`

  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;

  border-radius: ${Theme.borders.radius.round};

  img {
    width: 24px;
    height: 21px;
  }
`;

export default LikeBannerBaseModel;
