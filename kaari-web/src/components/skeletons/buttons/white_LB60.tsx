import { WhiteLB60 } from "../../styles/buttons/white_LB60_style";

interface WhiteButtonLB60Props {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const WhiteButtonLB60 = ({ text, onClick, disabled }: WhiteButtonLB60Props) => {
  return (
    <WhiteLB60 onClick={onClick} disabled={disabled}>
      {text}
    </WhiteLB60>
  );
}; 