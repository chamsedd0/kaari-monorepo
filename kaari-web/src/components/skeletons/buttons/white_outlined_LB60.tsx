import styled from "styled-components";
import { Theme } from "../../../theme/theme";

interface WhiteOutlinedButtonLB60Props {
  text: string | JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
}

export const ButtonStyle = styled.button<{ disabled?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  height: 48px;
  background: transparent;
  color: ${Theme.colors.primary};
  border: 2px solid ${Theme.colors.primary};
  border-radius: 100px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  outline: none;
  
  &:hover:not(:disabled) {
    background: rgba(103, 58, 183, 0.1);
  }
`;

export const WhiteOutlinedButtonLB60: React.FC<WhiteOutlinedButtonLB60Props> = ({ 
  text, 
  onClick, 
  disabled = false
}) => {
  return (
    <ButtonStyle 
      onClick={onClick} 
      disabled={disabled}
      type="button"
    >
      {text}
    </ButtonStyle>
  );
};

export default WhiteOutlinedButtonLB60; 