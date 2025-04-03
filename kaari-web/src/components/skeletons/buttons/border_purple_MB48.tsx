import { ReactElement } from "react";
import { BpurpleMB48 } from "../../styles/buttons/Bpurple_MB48_style";

export const BpurpleButtonMB48 = ({
    text, 
    icon, 
    onClick
}: {
    text: string, 
    icon?: ReactElement<any, any>,
    onClick?: () => void
}) => {
    return (
        <BpurpleMB48 onClick={onClick}>
            {text}{icon}
        </BpurpleMB48>
    )
}