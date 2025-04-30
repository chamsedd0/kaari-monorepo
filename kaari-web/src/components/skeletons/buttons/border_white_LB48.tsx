import { BwhiteLB48 } from "../../styles/buttons/Bwhite_LB48_style";

export const BwhiteButtonLB48 = ({text, onClick}: {text: string, onClick?: () => void}) => {
    return (
        <BwhiteLB48 onClick={onClick}>
            {text}
        </BwhiteLB48>
    )
}