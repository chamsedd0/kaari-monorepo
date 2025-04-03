import { PurpleLB60 } from "../../styles/buttons/purple_LB60_style"

export const PurpleButtonLB60 = ({ text, onClick }: { text: string, onClick?: () => void }) => {
    return (
        <PurpleLB60 onClick={onClick}>
            {text}
        </PurpleLB60>
    )
}