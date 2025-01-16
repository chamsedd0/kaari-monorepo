import ButtonVariant3 from "../button-variant-3"
import { Theme } from "../../../../theme/theme"

export default function WhiteButtonVariant3_4({ text}: { text: string, variant?: boolean }) {
    return (
        <ButtonVariant3 text={text} variant={true} style={{ width: '100%', maxWidth: '144px', height: '40px', font: Theme.typography.fonts.largeB}}/>
    )
}

