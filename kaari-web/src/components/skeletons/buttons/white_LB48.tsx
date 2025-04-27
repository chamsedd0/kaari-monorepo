import { WhiteLB48 } from "../../styles/buttons/white_LB48_style";

interface WhiteButtonLB48Props {
    text: String;
    onClick?: () => void;
}

export const WhiteButtonLB48 = ({ text, onClick }: WhiteButtonLB48Props) => {
    return (
        <WhiteLB48 onClick={onClick}>
            {text}
        </WhiteLB48>
    )   
}