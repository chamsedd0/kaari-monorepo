import { ReactElement } from "react";
import { BpurpleMB48 } from "../../styles/buttons/Bpurple_MB48_style";


export const BpurpleButtonMB48 = ({text, icon}: {text: String, icon?: ReactElement<any, any>}) => {
    return (
        <BpurpleMB48>{text}{icon}</BpurpleMB48>
    )
}