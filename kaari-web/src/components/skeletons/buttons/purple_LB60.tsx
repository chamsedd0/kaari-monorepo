import { PurpleLB60 } from "../../styles/buttons/purple_LB60_style"
import React, { ReactNode } from "react"

interface ButtonProps {
  text: string | ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement> | React.FormEvent) => void;
  disabled?: boolean;
  icon?: ReactNode;
}

export const PurpleButtonLB60 = ({ text, onClick, disabled, icon }: ButtonProps) => {
    return (
        <PurpleLB60 onClick={onClick} disabled={disabled}>
            {icon ? <span style={{ display: 'inline-flex', marginRight: 8 }}>{icon}</span> : null}
            {text}
        </PurpleLB60>
    )
}