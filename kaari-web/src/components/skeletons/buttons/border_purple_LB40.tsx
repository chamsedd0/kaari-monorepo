import { BpurpleLB40 } from "../../styles/buttons/Bpurple_LB40_style"
import React from "react";

interface BpurpleButtonLB40Props {
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export const BpurpleButtonLB40: React.FC<BpurpleButtonLB40Props> = ({ text, onClick, disabled, children }) => {
    return (
        <BpurpleLB40 onClick={onClick} disabled={disabled}>
            {text || children}
        </BpurpleLB40>
    )
}

// Export an alias for backward compatibility
export const BorderPurpleLB40 = BpurpleButtonLB40;