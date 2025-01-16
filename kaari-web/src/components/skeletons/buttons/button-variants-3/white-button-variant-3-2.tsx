import ButtonVariant3 from "../button-variant-3"
import { Theme } from "../../../../theme/theme"

export default function WhiteButtonVariant3_2({ text, icon }: { text: string, icon?: React.ReactNode }) {
    return (
        <ButtonVariant3 icon={icon} text={text} style={{ width: '100%', maxWidth: '188px', height: '48px', font: Theme.typography.fonts.mediumB}}/>
    )
}

