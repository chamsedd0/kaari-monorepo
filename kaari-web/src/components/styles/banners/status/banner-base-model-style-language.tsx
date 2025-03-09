import styled from "styled-components";
import { Theme } from "../../../../theme/theme";


const LanguageBannerBaseModel = styled.div`
  background-color: ${Theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  
  min-width: 73px;
  max-width: 100px;
  
  height: 40px;
  font: ${Theme.typography.fonts.extraLargeB};
  color: ${Theme.colors.primary};
  border: ${Theme.borders.primary};
  border-radius: ${Theme.borders.radius.extreme};
  transition: all 0.3s ease;
  cursor: pointer;

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 3px;
    margin-left: 2px;
  }

  &:hover {
    background-color: ${Theme.colors.tertiary};
  }
`;

export default LanguageBannerBaseModel;
