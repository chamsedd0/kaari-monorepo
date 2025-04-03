import { PurpleMB48 } from "../../styles/buttons/purple_MB48_style";


export const PurpleButtonMB48 = ({ text, onClick, disabled }: { text: string, onClick?: () => void, disabled?: boolean }) => {
    return (
        <PurpleMB48 onClick={onClick} disabled={disabled}>
            {text}
        </PurpleMB48>
    )
}