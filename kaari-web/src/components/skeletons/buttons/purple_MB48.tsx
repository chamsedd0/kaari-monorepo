import { PurpleMB48 } from "../../styles/buttons/purple_MB48_style";


export const PurpleButtonMB48 = ({ text, onClick, disabled, type }: { text: string, onClick?: () => void, disabled?: boolean, type?: string }) => {
    return (
        <PurpleMB48 onClick={onClick} disabled={disabled} type={type}>
            {text}
        </PurpleMB48>
    )
}