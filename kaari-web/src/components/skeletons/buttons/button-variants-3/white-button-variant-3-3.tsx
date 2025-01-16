import ButtonVariant3 from "../button-variant-3"
import { Theme } from "../../../../theme/theme"

export default function WhiteButtonVariant3_3({ text }: { text: string }) {
    return (
        <ButtonVariant3 text={text} style={{ width: '100%', maxWidth: '95px', height: '35px', font: Theme.typography.fonts.mediumB}}/>
    )
}

