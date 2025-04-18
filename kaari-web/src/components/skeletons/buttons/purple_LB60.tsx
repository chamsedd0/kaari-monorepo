import { PurpleLB60 } from "../../styles/buttons/purple_LB60_style"
import React from "react"

export const PurpleButtonLB60 = ({ text, onClick }: { text: string, onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void }) => {
    return (
        <PurpleLB60 onClick={onClick}>
            {text}
        </PurpleLB60>
    )
}