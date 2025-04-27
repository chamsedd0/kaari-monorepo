import { BpurpleLB40 } from "../../styles/buttons/Bpurple_LB40_style"

interface BpurpleButtonLB40Props {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export const BpurpleButtonLB40: React.FC<BpurpleButtonLB40Props> = ({ text, onClick, disabled }) => {
    return (
        <BpurpleLB40 onClick={onClick} disabled={disabled}>
            {text}
        </BpurpleLB40>
    )
}