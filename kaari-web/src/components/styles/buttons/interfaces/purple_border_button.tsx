import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


export const PurpleBorderButton = styled.button`
  background-color: transparent;
  border: 3px solid ${Theme.colors.secondary};
  border-radius: ${Theme.borders.radius.extreme};
  color: ${Theme.colors.secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 100%;
  width: 100%;
  
  &:hover {
    border-color: ${Theme.colors.primary};
    color: ${Theme.colors.primary};
  }
`;