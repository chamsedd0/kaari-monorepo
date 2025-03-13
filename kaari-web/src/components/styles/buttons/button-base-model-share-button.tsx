import styled from "styled-components";
import { Theme } from "../../../theme/theme";

const ShareButtonBaseModel = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: ${Theme.colors.white};
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.round};
  transition: all 0.3s ease-in-out;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${Theme.colors.tertiary};
  }
`;

export default ShareButtonBaseModel;

