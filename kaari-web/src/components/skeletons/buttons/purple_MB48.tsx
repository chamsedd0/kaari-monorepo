import { PurpleMB48 } from "../../styles/buttons/purple_MB48_style";
import { ReactNode } from "react";

export const PurpleButtonMB48 = ({ 
    text, 
    onClick, 
    disabled, 
    type = "button",
    children 
}: { 
    text: string, 
    onClick?: () => void, 
    disabled?: boolean, 
    type?: "button" | "submit" | "reset",
    children?: ReactNode 
}) => {
    return (
        <PurpleMB48 onClick={onClick} disabled={disabled} type={type}>
            {text}
            {children}
        </PurpleMB48>
    )
}