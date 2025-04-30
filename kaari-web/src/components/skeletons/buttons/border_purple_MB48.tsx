import { ReactElement } from "react";
import { BpurpleMB48 } from "../../styles/buttons/Bpurple_MB48_style";

export const BpurpleButtonMB48 = ({
    text, 
    icon, 
    onClick,
    disabled
}: {
    text: string, 
    icon?: ReactElement<any, any>,
    onClick?: () => void,
    disabled?: boolean
}) => {
    return (
        <BpurpleMB48 onClick={onClick} disabled={disabled}>
            {text}{icon}
        </BpurpleMB48>
    )
}