import { WhiteSM32 } from "../../styles/buttons/white_SM32_style";


export const WhiteButtonSM32 = ({ text, onClick, type }: {text: string, onClick?: () => void, type?: "button" | "reset" | "submit"}) => {
    return (
        <WhiteSM32 onClick={onClick} type={type}>
            {text}
        </WhiteSM32>
    )
}