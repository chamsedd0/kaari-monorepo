import { PurpleLB60 } from "../../styles/buttons/purple_LB60_style"
import React, { ReactNode } from "react"

interface ButtonProps {
  text: string | ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const PurpleButtonLB60 = ({ text, onClick, disabled }: ButtonProps) => {
    return (
        <PurpleLB60 onClick={onClick} disabled={disabled}>
            {text}
        </PurpleLB60>
    )
}