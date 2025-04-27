import { PurpleLB40 } from "../../styles/buttons/purple_LB40_style";

interface PurpleButtonLB40Props {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

export const PurpleButtonLB40: React.FC<PurpleButtonLB40Props> = ({ text, onClick, disabled }) => {
    return (
        <PurpleLB40 onClick={onClick} disabled={disabled}>
            {text}
        </PurpleLB40>
    );
}