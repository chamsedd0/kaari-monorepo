import { PurpleMB48 } from "../../styles/buttons/purple_MB48_style";


export const PurpleButtonMB48 = ({ text, onClick }: { text: string, onClick?: () => void }) => {
    return (
        <PurpleMB48 onClick={onClick}>
            {text}
        </PurpleMB48>
    )
}