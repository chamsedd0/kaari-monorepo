import { PurpleLB60 } from "../../styles/buttons/purple_LB60_style"
import React from "react"

interface ButtonProps {
  text: string;
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