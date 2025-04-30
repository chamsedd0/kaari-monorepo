import { WhiteLB60 } from "../../styles/buttons/white_LB60_style";
import React, { ReactNode } from "react";

interface WhiteButtonLB60Props {
  text: string | ReactNode;
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