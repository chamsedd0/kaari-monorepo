import styled from "styled-components";
import { Theme } from "../../../../theme/theme";

export const PurpleButtonWhiteText = styled.button`
  background-color: ${Theme.colors.secondary};
  color: ${Theme.colors.white};
  border: none;
  border-radius: ${Theme.borders.radius.extreme};
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${Theme.colors.primary};
  }
`;