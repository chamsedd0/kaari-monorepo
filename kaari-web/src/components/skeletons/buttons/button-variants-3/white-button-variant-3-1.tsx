import ButtonVariant3 from "../button-variant-3"
import { Theme } from "../../../../theme/theme"

export default function WhiteButtonVariant3_1({ text, icon }: { text: string, icon?: React.ReactNode }) {
    return (
        <ButtonVariant3 icon={icon} text={text} style={{ width: '100%', maxWidth: '169px', height: '32px', font: Theme.typography.fonts.smallM}}/>
    )
}

