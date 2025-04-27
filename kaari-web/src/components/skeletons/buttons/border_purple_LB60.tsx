import { BpurpleLB60 } from "../../styles/buttons/Bpurple_LB60_style";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export const BpurpleButtonLB60 = ({ text, onClick }: ButtonProps) => {
    return (
        <BpurpleLB60 onClick={onClick}>{text}</BpurpleLB60>
    )
}